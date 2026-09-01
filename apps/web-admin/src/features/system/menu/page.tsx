import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App, Drawer, Form, Input, Radio, Select, Tag, TreeSelect } from 'antd'
import type { TableProps } from 'antd'
import { useState } from 'react'

import { ButtonList } from '~/components/button-list'
import { PageContainer } from '~/components/page-container'
import { ProTable } from '~/components/pro-table'

import { menuTreeData, menuTypeOptions, systemApi, systemQueryKeys } from '../_shared/model'
import type { MenuFormValues, MenuRecord } from '../_shared/model'
import { BinaryStatusField, menuTypeTag, statusTag } from '../_shared/ui'

type MenuMutationAction =
  | { type: 'create'; values: MenuFormValues }
  | { id: string; type: 'delete' }
  | { id: string; type: 'update'; values: MenuFormValues }

export default function MenusPage() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  const menusQuery = useQuery({ queryFn: systemApi.listMenus, queryKey: systemQueryKeys.menus })
  const menuMutation = useMutation<unknown, Error, MenuMutationAction>({
    mutationFn: (action: MenuMutationAction) => {
      if (action.type === 'create') return systemApi.createMenu(action.values)
      if (action.type === 'delete') return systemApi.deleteMenu(action.id)
      return systemApi.updateMenu(action.id, action.values)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: systemQueryKeys.menus })
    },
  })
  const menus = menusQuery.data ?? []
  const [editing, setEditing] = useState<MenuRecord>()
  const [parentId, setParentId] = useState('0')
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm<MenuFormValues>()
  const menuType = Form.useWatch('type', form) ?? 'menu'

  function openMenuForm(menu?: MenuRecord, appendTo?: string) {
    setEditing(menu)
    setParentId(appendTo ?? menu?.pid ?? '0')
    setOpen(true)
    window.setTimeout(() =>
      form.setFieldsValue(
        menu
          ? {
              authCode: menu.authCode,
              ...(menu.badge ? { badge: menu.badge } : {}),
              ...(menu.badgeType ? { badgeType: menu.badgeType } : {}),
              component: menu.component,
              icon: menu.icon,
              path: menu.path,
              pid: menu.pid,
              status: menu.status,
              title: menu.title,
              type: menu.type,
            }
          : {
              authCode: '',
              component: '',
              icon: 'lucide:circle-dot',
              path: '',
              pid: appendTo ?? '0',
              status: 1,
              title: '',
              type: 'menu',
            },
      ),
    )
  }

  async function saveMenu() {
    const values = await form.validateFields()
    if (editing) {
      await menuMutation.mutateAsync({ id: editing.id, type: 'update', values })
    } else {
      await menuMutation.mutateAsync({ type: 'create', values })
    }
    setOpen(false)
    await message.success(editing ? '菜单编辑成功' : '菜单创建成功')
  }

  const columns: NonNullable<TableProps<MenuRecord>['columns']> = [
    {
      dataIndex: 'title',
      fixed: 'left',
      render: (title: string, row) => (
        <div className="system-menu-title">
          <span className="system-menu-title__icon">{row.type === 'button' ? '◈' : '◇'}</span>
          <span>{title}</span>
          {row.badgeType === 'dot' ? <i className="system-menu-badge-dot" /> : null}
          {row.badge ? <Tag color="error">{row.badge}</Tag> : null}
        </div>
      ),
      title: '菜单标题',
      width: 250,
    },
    {
      dataIndex: 'type',
      render: menuTypeTag,
      title: '类型',
      width: 100,
    },
    { dataIndex: 'authCode', title: '权限标识', width: 200 },
    { dataIndex: 'path', title: '路由地址', width: 220 },
    {
      dataIndex: 'component',
      ellipsis: true,
      title: '组件 / 地址',
      width: 250,
    },
    {
      dataIndex: 'status',
      render: statusTag,
      title: '状态',
      width: 100,
    },
    {
      fixed: 'right',
      key: 'operation',
      render: (_, row) => (
        <ButtonList
          gap={0}
          list={[
            {
              key: 'create-child',
              label: '新增下级',
              onClick: () => openMenuForm(undefined, row.id),
              size: 'small',
              type: 'link',
            },
            {
              icon: <EditOutlined />,
              key: 'edit',
              label: '编辑',
              onClick: () => openMenuForm(row),
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
                  content: `正在删除 ${row.title}...`,
                  duration: 0,
                  key: 'system-menu-action',
                })
                try {
                  await menuMutation.mutateAsync({ id: row.id, type: 'delete' })
                  await message.success({
                    content: `${row.title} 删除成功`,
                    key: 'system-menu-action',
                  })
                } catch {
                  hide()
                  await message.error('删除失败，请重试')
                }
              },
              popconfirm: {
                description: `确认删除菜单 ${row.title} 及其下级吗？`,
                title: '删除菜单',
              },
              size: 'small',
              type: 'link',
            },
          ]}
        />
      ),
      title: '操作',
      width: 230,
    },
  ]

  return (
    <PageContainer>
      <ProTable<MenuRecord>
        cardProps={{ className: 'system-grid-card' }}
        columns={columns}
        dataSource={menus}
        defaultExpandAllRows
        preferenceKey="system-menu"
        headerTitle="菜单列表"
        loading={menusQuery.isFetching || menuMutation.isPending}
        onRefresh={async () => {
          await menusQuery.refetch()
          await message.success('菜单列表已刷新')
        }}
        pagination={false}
        stableRowKey="id"
        scroll={{ x: 1350 }}
        toolbarActionList={[
          {
            icon: <PlusOutlined />,
            key: 'create',
            label: '创建菜单',
            onClick: () => openMenuForm(),
            type: 'primary',
          },
        ]}
      />
      <Drawer
        destroyOnHidden
        footer={
          <ButtonList
            list={[
              { key: 'cancel', label: '取消', onClick: () => setOpen(false) },
              { key: 'submit', label: '确认', onClick: saveMenu, type: 'primary' },
            ]}
          />
        }
        onClose={() => setOpen(false)}
        open={open}
        size={560}
        title={editing ? '编辑菜单' : parentId === '0' ? '创建菜单' : '新增下级菜单'}
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item label="上级菜单" name="pid">
            <TreeSelect
              allowClear
              placeholder="根菜单"
              treeData={menuTreeData(menus, editing?.id)}
            />
          </Form.Item>
          <Form.Item label="菜单类型" name="type" rules={[{ required: true }]}>
            <Radio.Group
              buttonStyle="solid"
              optionType="button"
              options={menuTypeOptions.map((item) => ({ label: item.label, value: item.value }))}
            />
          </Form.Item>
          <Form.Item label="菜单标题" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="图标" name="icon">
            <Input placeholder="lucide:circle-dot" />
          </Form.Item>
          <Form.Item
            label={menuType === 'button' ? '按钮标识' : '路由地址'}
            name={menuType === 'button' ? 'authCode' : 'path'}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          {menuType !== 'button' ? (
            <Form.Item
              label={
                menuType === 'embedded' ? '内嵌地址' : menuType === 'link' ? '外部链接' : '页面组件'
              }
              name="component"
            >
              <Input />
            </Form.Item>
          ) : null}
          <BinaryStatusField />
          <Form.Item label="徽标类型" name="badgeType">
            <Select
              allowClear
              options={[
                { label: '圆点', value: 'dot' },
                { label: '文字', value: 'normal' },
              ]}
            />
          </Form.Item>
          <Form.Item label="徽标文本" name="badge">
            <Input />
          </Form.Item>
        </Form>
      </Drawer>
    </PageContainer>
  )
}
