import type { TreeDataNode } from 'antd'

import { appendTree, flattenTree, removeTree, updateTree } from '~/core/tree-model'

/** Shared system-domain status used by all CRUD feature slices. */
export type BinaryStatus = 0 | 1

export interface DepartmentRecord {
  children?: DepartmentRecord[]
  createTime: string
  id: string
  name: string
  pid: string
  remark: string
  status: BinaryStatus
}

export interface UserRecord {
  createTime: string
  deptId: string
  id: string
  name: string
  remark: string
  status: BinaryStatus
}

export interface RoleRecord {
  createTime: string
  id: string
  name: string
  permissions: string[]
  remark: string
  status: BinaryStatus
}

export interface MenuRecord {
  authCode: string
  badge?: string
  badgeType?: 'dot' | 'normal'
  children?: MenuRecord[]
  component: string
  icon: string
  id: string
  path: string
  pid: string
  status: BinaryStatus
  title: string
  type: 'button' | 'catalog' | 'embedded' | 'link' | 'menu'
}

const initialDepartments: DepartmentRecord[] = [
  {
    children: [
      {
        createTime: '2023-04-12 10:20:00',
        id: 'dept-product',
        name: '产品设计部',
        pid: 'dept-rd',
        remark: '负责产品规划与设计',
        status: 1,
      },
      {
        createTime: '2023-05-18 09:10:00',
        id: 'dept-frontend',
        name: '前端研发部',
        pid: 'dept-rd',
        remark: '负责前端基础设施与应用开发',
        status: 1,
      },
      {
        createTime: '2023-07-08 14:35:00',
        id: 'dept-quality',
        name: '质量保障部',
        pid: 'dept-rd',
        remark: '负责质量与自动化测试',
        status: 1,
      },
    ],
    createTime: '2022-03-14 09:00:00',
    id: 'dept-rd',
    name: '研发中心',
    pid: '0',
    remark: '技术研发与产品交付',
    status: 1,
  },
  {
    children: [
      {
        createTime: '2023-06-22 11:10:00',
        id: 'dept-market',
        name: '市场运营部',
        pid: 'dept-business',
        remark: '负责市场与增长',
        status: 1,
      },
      {
        createTime: '2023-09-16 16:45:00',
        id: 'dept-customer',
        name: '客户成功部',
        pid: 'dept-business',
        remark: '负责客户服务',
        status: 0,
      },
    ],
    createTime: '2022-08-01 10:00:00',
    id: 'dept-business',
    name: '业务中心',
    pid: '0',
    remark: '业务拓展与客户运营',
    status: 1,
  },
]

const initialUsers: UserRecord[] = Array.from({ length: 32 }, (_, index) => {
  const departments = [
    'dept-product',
    'dept-frontend',
    'dept-quality',
    'dept-market',
    'dept-customer',
  ]
  return {
    createTime: `2024-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 27) + 1).padStart(2, '0')} 10:20:00`,
    deptId: departments[index % departments.length] ?? 'dept-frontend',
    id: `USR-${String(index + 1).padStart(4, '0')}`,
    name:
      ['Quantum Keyboard', 'Elegant Chair', 'Modern Computer', 'Practical Shoes'][index % 4] ??
      'Demo User',
    remark:
      ['For everyday use.', 'Built for modern teams.', 'Reliable and efficient.'][index % 3] ?? '',
    status: index % 5 === 0 ? 0 : 1,
  }
})

const initialRoles: RoleRecord[] = Array.from({ length: 24 }, (_, index) => ({
  createTime: `2024-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 27) + 1).padStart(2, '0')} 08:30:00`,
  id: `ROLE-${String(index + 1).padStart(4, '0')}`,
  name: ['超级管理员', '内容管理员', '系统审计员', '普通用户'][index % 4] ?? '普通用户',
  permissions:
    index % 4 === 0 ? ['dashboard', 'system', 'demos', 'examples'] : ['dashboard', 'demos'],
  remark: ['拥有完整系统权限', '负责日常内容维护', '只读审计权限'][index % 3] ?? '',
  status: index % 6 === 0 ? 0 : 1,
}))

const initialMenus: MenuRecord[] = [
  {
    authCode: '',
    children: [
      {
        authCode: '',
        component: '/dashboard/analytics/index',
        icon: 'lucide:area-chart',
        id: 'menu-analytics',
        path: '/dashboard/analytics',
        pid: 'menu-dashboard',
        status: 1,
        title: '分析页',
        type: 'menu',
      },
      {
        authCode: '',
        component: '/dashboard/workspace/index',
        icon: 'carbon:workspace',
        id: 'menu-workspace',
        path: '/dashboard/workspace',
        pid: 'menu-dashboard',
        status: 1,
        title: '工作台',
        type: 'menu',
      },
    ],
    component: 'BasicLayout',
    icon: 'lucide:layout-dashboard',
    id: 'menu-dashboard',
    path: '/dashboard',
    pid: '0',
    status: 1,
    title: '概览',
    type: 'catalog',
  },
  {
    authCode: '',
    badge: 'Hot',
    badgeType: 'normal',
    children: [
      {
        authCode: 'AC_100100',
        component: '/system/user/list',
        icon: 'lucide:users',
        id: 'menu-system-user',
        path: '/system/user',
        pid: 'menu-system',
        status: 1,
        title: '用户管理',
        type: 'menu',
      },
      {
        authCode: 'AC_100110',
        component: '/system/role/list',
        icon: 'lucide:badge-check',
        id: 'menu-system-role',
        path: '/system/role',
        pid: 'menu-system',
        status: 1,
        title: '角色管理',
        type: 'menu',
      },
      {
        authCode: 'AC_100120',
        component: '/system/menu/list',
        icon: 'lucide:menu',
        id: 'menu-system-menu',
        path: '/system/menu',
        pid: 'menu-system',
        status: 1,
        title: '菜单管理',
        type: 'menu',
      },
      {
        authCode: 'AC_100130',
        component: '/system/dept/list',
        icon: 'lucide:building-2',
        id: 'menu-system-dept',
        path: '/system/dept',
        pid: 'menu-system',
        status: 1,
        title: '部门管理',
        type: 'menu',
      },
    ],
    component: 'BasicLayout',
    icon: 'lucide:settings',
    id: 'menu-system',
    path: '/system',
    pid: '0',
    status: 1,
    title: '系统管理',
    type: 'catalog',
  },
]

export const systemQueryKeys = {
  departments: ['system', 'departments'] as const,
  menus: ['system', 'menus'] as const,
  roles: ['system', 'roles'] as const,
  users: ['system', 'users'] as const,
}

const systemDatabase = {
  departments: structuredClone(initialDepartments),
  menus: structuredClone(initialMenus),
  roles: structuredClone(initialRoles),
  users: structuredClone(initialUsers),
}

function cloneData<T>(value: T): T {
  return structuredClone(value)
}

async function emulateRequest<T>(operation: () => T): Promise<T> {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 180))
  return cloneData(operation())
}

export const systemApi = {
  createDepartment: (values: DepartmentFormValues) =>
    emulateRequest(() => {
      const department: DepartmentRecord = {
        ...values,
        createTime: new Date().toLocaleString('zh-CN', { hour12: false }),
        id: createId('DEPT'),
      }
      systemDatabase.departments = appendTree(systemDatabase.departments, values.pid, department)
      return department
    }),
  createMenu: (values: MenuFormValues) =>
    emulateRequest(() => {
      const menu: MenuRecord = { ...values, id: createId('MENU') }
      systemDatabase.menus = appendTree(systemDatabase.menus, values.pid, menu)
      return menu
    }),
  createRole: (values: RoleFormValues) =>
    emulateRequest(() => {
      const role: RoleRecord = {
        ...values,
        createTime: new Date().toLocaleString('zh-CN', { hour12: false }),
        id: createId('ROLE'),
      }
      systemDatabase.roles = [role, ...systemDatabase.roles]
      return role
    }),
  createUser: (values: UserFormValues) =>
    emulateRequest(() => {
      const user: UserRecord = {
        ...values,
        createTime: new Date().toLocaleString('zh-CN', { hour12: false }),
        id: createId('USR'),
      }
      systemDatabase.users = [user, ...systemDatabase.users]
      return user
    }),
  deleteDepartment: (id: string) =>
    emulateRequest(() => {
      systemDatabase.departments = removeTree(systemDatabase.departments, id)
      return true
    }),
  deleteMenu: (id: string) =>
    emulateRequest(() => {
      systemDatabase.menus = removeTree(systemDatabase.menus, id)
      return true
    }),
  deleteRole: (id: string) =>
    emulateRequest(() => {
      systemDatabase.roles = systemDatabase.roles.filter((role) => role.id !== id)
      return true
    }),
  deleteUser: (id: string) =>
    emulateRequest(() => {
      systemDatabase.users = systemDatabase.users.filter((user) => user.id !== id)
      return true
    }),
  listDepartments: () => emulateRequest(() => systemDatabase.departments),
  listMenus: () => emulateRequest(() => systemDatabase.menus),
  listRoles: () => emulateRequest(() => systemDatabase.roles),
  listUsers: () => emulateRequest(() => systemDatabase.users),
  updateDepartment: (id: string, values: DepartmentFormValues) =>
    emulateRequest(() => {
      const current = flattenDepartments(systemDatabase.departments).find((item) => item.id === id)
      if (!current) throw new Error('Department not found')
      const updated = { ...current, ...values }
      systemDatabase.departments =
        values.pid === current.pid
          ? updateTree(systemDatabase.departments, id, () => updated)
          : appendTree(removeTree(systemDatabase.departments, id), values.pid, updated)
      return updated
    }),
  updateMenu: (id: string, values: MenuFormValues) =>
    emulateRequest(() => {
      const current = flattenMenus(systemDatabase.menus).find((item) => item.id === id)
      if (!current) throw new Error('Menu not found')
      const updated = { ...current, ...values }
      systemDatabase.menus =
        values.pid === current.pid
          ? updateTree(systemDatabase.menus, id, () => updated)
          : appendTree(removeTree(systemDatabase.menus, id), values.pid, updated)
      return updated
    }),
  updateRole: (id: string, values: Partial<RoleFormValues>) =>
    emulateRequest(() => {
      const role = systemDatabase.roles.find((item) => item.id === id)
      if (!role) throw new Error('Role not found')
      Object.assign(role, values)
      return role
    }),
  updateUser: (id: string, values: Partial<UserFormValues>) =>
    emulateRequest(() => {
      const user = systemDatabase.users.find((item) => item.id === id)
      if (!user) throw new Error('User not found')
      Object.assign(user, values)
      return user
    }),
}

export function flattenDepartments(nodes: DepartmentRecord[]): DepartmentRecord[] {
  return flattenTree(nodes)
}

function flattenMenus(nodes: MenuRecord[]): MenuRecord[] {
  return flattenTree(nodes)
}

export function departmentTreeData(nodes: DepartmentRecord[]): TreeDataNode[] {
  return nodes.map((node) => ({
    ...(node.children ? { children: departmentTreeData(node.children) } : {}),
    key: node.id,
    title: node.name,
    value: node.id,
  }))
}

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
}

export type UserFormValues = Omit<UserRecord, 'createTime' | 'id'>
export type RoleFormValues = Omit<RoleRecord, 'createTime' | 'id'>
export type MenuFormValues = Omit<MenuRecord, 'children' | 'id'>

interface MenuTreeDataNode {
  children?: MenuTreeDataNode[]
  key: string
  title: string
  value: string
}

export function menuTreeData(nodes: MenuRecord[], omittedId?: string): MenuTreeDataNode[] {
  return nodes
    .filter((node) => node.id !== omittedId)
    .map((node) => {
      const item: MenuTreeDataNode = { key: node.id, title: node.title, value: node.id }
      if (node.children) item.children = menuTreeData(node.children, omittedId)
      return item
    })
}

export const menuTypeOptions = [
  { color: 'processing', label: '目录', value: 'catalog' },
  { color: 'default', label: '菜单', value: 'menu' },
  { color: 'error', label: '按钮', value: 'button' },
  { color: 'success', label: '内嵌', value: 'embedded' },
  { color: 'warning', label: '外链', value: 'link' },
] as const

export type DepartmentFormValues = Omit<DepartmentRecord, 'children' | 'createTime' | 'id'>
