import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
/* oxlint-disable react/no-unstable-nested-components -- QueryForm render entries are field render callbacks, not component definitions. */
import {
  App,
  Card,
  DatePicker,
  Descriptions,
  Drawer,
  Form,
  Input,
  Select,
  Switch,
  Tree,
  TreeSelect,
} from 'antd'
import type { TableProps } from 'antd'
import type { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'

import { ButtonList } from '~/components/button-list'
import { PageContainer } from '~/components/page-container'
import { ProTable } from '~/components/pro-table'
import { QueryForm } from '~/components/query-form'

import {
  departmentTreeData,
  flattenDepartments,
  systemApi,
  systemQueryKeys,
} from '../_shared/model'
import type { BinaryStatus, UserFormValues, UserRecord } from '../_shared/model'
import { BinaryStatusField, statusTag } from '../_shared/ui'

interface UserQueryValues {
  createTime?: [Dayjs, Dayjs]
  name?: string
  remark?: string
  status?: BinaryStatus
  userId?: string
}

type UserMutationAction =
  | { type: 'create'; values: UserFormValues }
  | { id: string; type: 'delete' }
  | { id: string; type: 'update'; values: Partial<UserFormValues> }

/** 页面隐藏期间 Activity 会断开副作用；查询草稿独立保存，重新激活时不被表单初始化覆盖。 */
const retainedUserPageState: {
  departmentId: string
  departmentSearchInput: string
  query: UserQueryValues
  queryValues: UserQueryValues
} = {
  departmentId: '',
  departmentSearchInput: '',
  query: {},
  queryValues: {},
}

export default function UsersPage() {
  const { message, modal } = App.useApp()
  const queryClient = useQueryClient()
  const usersQuery = useQuery({ queryFn: systemApi.listUsers, queryKey: systemQueryKeys.users })
  const departmentsQuery = useQuery({
    queryFn: systemApi.listDepartments,
    queryKey: systemQueryKeys.departments,
  })
  const userMutation = useMutation<unknown, Error, UserMutationAction>({
    mutationFn: (action: UserMutationAction) => {
      if (action.type === 'create') return systemApi.createUser(action.values)
      if (action.type === 'delete') return systemApi.deleteUser(action.id)
      return systemApi.updateUser(action.id, action.values)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: systemQueryKeys.users })
    },
  })
  const users = usersQuery.data ?? []
  const [query, setQuery] = useState<UserQueryValues>(() => retainedUserPageState.query)
  const [queryValues, setQueryValues] = useState<UserQueryValues>(
    () => retainedUserPageState.queryValues,
  )
  const [departmentSearchInput, setDepartmentSearchInput] = useState(
    () => retainedUserPageState.departmentSearchInput,
  )
  const [departmentSearch, setDepartmentSearch] = useState('')
  const [departmentId, setDepartmentId] = useState(() => retainedUserPageState.departmentId)
  const [editing, setEditing] = useState<UserRecord>()
  const [formOpen, setFormOpen] = useState(false)
  const [detail, setDetail] = useState<UserRecord>()
  const [form] = Form.useForm<UserFormValues>()
  const departmentNodes = departmentsQuery.data ?? []
  const departments = flattenDepartments(departmentNodes)

  useEffect(() => {
    const timer = window.setTimeout(() => setDepartmentSearch(departmentSearchInput.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [departmentSearchInput])

  const filteredUsers = users.filter((user) => {
    const inRange =
      !query.createTime?.[0] || !query.createTime[1]
        ? true
        : user.createTime.slice(0, 10) >= query.createTime[0].format('YYYY-MM-DD') &&
          user.createTime.slice(0, 10) <= query.createTime[1].format('YYYY-MM-DD')
    return (
      (!query.name || user.name.toLowerCase().includes(query.name.toLowerCase())) &&
      (!query.userId || user.id.toLowerCase().includes(query.userId.toLowerCase())) &&
      (!query.remark || user.remark.toLowerCase().includes(query.remark.toLowerCase())) &&
      (query.status === undefined || user.status === query.status) &&
      (!departmentId || user.deptId === departmentId) &&
      inRange
    )
  })

  function openUserForm(user?: UserRecord) {
    setEditing(user)
    setFormOpen(true)
    window.setTimeout(() => {
      form.setFieldsValue(
        user
          ? {
              deptId: user.deptId,
              name: user.name,
              remark: user.remark,
              status: user.status,
            }
          : { deptId: 'dept-frontend', name: '', remark: '', status: 1 },
      )
    })
  }

  async function saveUser() {
    const values = await form.validateFields()
    if (editing) {
      await userMutation.mutateAsync({ id: editing.id, type: 'update', values })
    } else {
      await userMutation.mutateAsync({ type: 'create', values })
    }
    setFormOpen(false)
    form.resetFields()
    await message.success(editing ? '用户编辑成功' : '用户创建成功')
  }

  function changeUserStatus(user: UserRecord, checked: boolean) {
    const nextStatus: BinaryStatus = checked ? 1 : 0
    modal.confirm({
      content: `你要将${user.name}的状态切换为 【${checked ? '启用' : '禁用'}】 吗？`,
      onOk: () =>
        userMutation.mutateAsync({ id: user.id, type: 'update', values: { status: nextStatus } }),
      title: '切换状态',
    })
  }

  const columns: NonNullable<TableProps<UserRecord>['columns']> = [
    { dataIndex: 'name', fixed: 'left', title: '用户名称', width: 200 },
    { dataIndex: 'id', title: '用户ID', width: 200 },
    {
      dataIndex: 'status',
      render: (value: BinaryStatus, row) => (
        <Switch checked={value === 1} onChange={(checked) => changeUserStatus(row, checked)} />
      ),
      title: '状态',
      width: 100,
    },
    { dataIndex: 'remark', ellipsis: true, title: '备注', width: 200 },
    { dataIndex: 'createTime', title: '创建时间', width: 200 },
    {
      fixed: 'right',
      key: 'operation',
      render: (_, row) => (
        <ButtonList
          gap={0}
          list={[
            {
              icon: <EyeOutlined />,
              key: 'detail',
              label: '详情',
              onClick: () => setDetail(row),
              size: 'small',
              type: 'link',
            },
            {
              icon: <EditOutlined />,
              key: 'edit',
              label: '编辑',
              onClick: () => openUserForm(row),
              size: 'small',
              type: 'link',
            },
            {
              danger: true,
              icon: <DeleteOutlined />,
              key: 'delete',
              label: '删除',
              onClick: async () => {
                const hide = message.loading({
                  content: `正在删除 ${row.name}...`,
                  duration: 0,
                  key: 'system-user-action',
                })
                try {
                  await userMutation.mutateAsync({ id: row.id, type: 'delete' })
                  await message.success({
                    content: `${row.name} 删除成功`,
                    key: 'system-user-action',
                  })
                } catch {
                  hide()
                  await message.error('删除失败，请重试')
                }
              },
              popconfirm: { description: `确认删除用户 ${row.name} 吗？`, title: '删除用户' },
              size: 'small',
              type: 'link',
            },
          ]}
        />
      ),
      title: '操作',
      width: 210,
    },
  ]

  const filteredDepartmentTree = departmentTreeData(
    departmentSearch
      ? departmentNodes
          .map((node) => ({
            ...node,
            children: (node.children ?? []).filter((child) =>
              child.name.toLowerCase().includes(departmentSearch.toLowerCase()),
            ),
          }))
          .filter(
            (node) =>
              node.name.toLowerCase().includes(departmentSearch.toLowerCase()) ||
              (node.children?.length ?? 0) > 0,
          )
      : departmentNodes,
  )

  function updateQuery(nextQuery: UserQueryValues) {
    retainedUserPageState.query = nextQuery
    retainedUserPageState.queryValues = nextQuery
    setQuery(nextQuery)
    setQueryValues(nextQuery)
  }

  return (
    <PageContainer contentClassName="system-user-page">
      <Card className="system-department-filter">
        <Form className="system-department-query" layout="vertical">
          <Form.Item label="部门名称">
            <Input
              allowClear
              onChange={(event) => {
                retainedUserPageState.departmentSearchInput = event.target.value
                setDepartmentSearchInput(event.target.value)
              }}
              placeholder="请输入部门名称"
              value={departmentSearchInput}
            />
          </Form.Item>
        </Form>
        <Tree
          blockNode
          defaultExpandAll
          key={departmentSearch || 'all-departments'}
          onSelect={(keys) => {
            const nextDepartmentId = String(keys[0] ?? '')
            retainedUserPageState.departmentId = nextDepartmentId
            setDepartmentId(nextDepartmentId)
          }}
          selectedKeys={departmentId ? [departmentId] : []}
          treeData={filteredDepartmentTree}
        />
      </Card>
      <div className="system-user-main">
        <Card className="query-form-card" size="small">
          <QueryForm<UserQueryValues>
            items={[
              { field: 'name', label: '用户名称', render: () => <Input allowClear /> },
              { field: 'userId', label: '用户ID', render: () => <Input allowClear /> },
              {
                field: 'status',
                label: '状态',
                render: () => (
                  <Select
                    allowClear
                    options={[
                      { label: '启用', value: 1 },
                      { label: '禁用', value: 0 },
                    ]}
                  />
                ),
              },
              { field: 'remark', label: '备注', render: () => <Input allowClear /> },
              {
                field: 'createTime',
                label: '创建时间',
                render: () => <DatePicker.RangePicker />,
              },
            ]}
            onQuery={updateQuery}
            onReset={updateQuery}
            onValuesChange={(_, allValues) => {
              retainedUserPageState.queryValues = allValues
              setQueryValues(allValues)
            }}
            urlSync={{ namespace: 'system-user' }}
            values={queryValues}
          />
        </Card>
        <ProTable<UserRecord>
          cardProps={{ className: 'system-grid-card' }}
          columns={columns}
          dataSource={filteredUsers}
          headerTitle="用户列表"
          loading={usersQuery.isFetching || userMutation.isPending}
          onRefresh={async () => {
            await usersQuery.refetch()
            await message.success('用户列表已刷新')
          }}
          stableRowKey="id"
          scroll={{ x: 1110 }}
          toolbarActionList={[
            {
              icon: <PlusOutlined />,
              key: 'create',
              label: '创建用户',
              onClick: () => openUserForm(),
              type: 'primary',
            },
          ]}
        />
      </div>

      <Drawer
        destroyOnHidden
        footer={
          <ButtonList
            list={[
              { key: 'cancel', label: '取消', onClick: () => setFormOpen(false) },
              { key: 'submit', label: '确认', onClick: saveUser, type: 'primary' },
            ]}
          />
        }
        onClose={() => setFormOpen(false)}
        open={formOpen}
        size={520}
        title={editing ? '编辑用户' : '创建用户'}
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item label="用户名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="所属部门" name="deptId" rules={[{ required: true }]}>
            <TreeSelect allowClear treeData={departmentTreeData(departmentNodes)} />
          </Form.Item>
          <BinaryStatusField />
          <Form.Item label="备注" name="remark">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Drawer>
      <Drawer
        destroyOnHidden
        onClose={() => setDetail(undefined)}
        open={Boolean(detail)}
        size={520}
        title="用户详情"
      >
        {detail ? (
          <Descriptions
            bordered
            column={1}
            items={[
              { children: detail.name, key: 'name', label: '用户名称' },
              { children: detail.id, key: 'id', label: '用户ID' },
              {
                children:
                  departments.find((item) => item.id === detail.deptId)?.name ?? detail.deptId,
                key: 'dept',
                label: '所属部门',
              },
              { children: statusTag(detail.status), key: 'status', label: '状态' },
              { children: detail.createTime, key: 'time', label: '创建时间' },
              { children: detail.remark, key: 'remark', label: '备注' },
            ]}
          />
        ) : null}
      </Drawer>
    </PageContainer>
  )
}
