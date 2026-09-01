import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
/* oxlint-disable react/no-unstable-nested-components -- QueryForm render entries are field render callbacks, not component definitions. */
import { App, Card, Checkbox, DatePicker, Drawer, Form, Input, Select, Switch } from 'antd'
import type { TableProps } from 'antd'
import type { Dayjs } from 'dayjs'
import { useState } from 'react'
import { z } from 'zod'

import { ButtonList } from '~/components/button-list'
import { PageContainer } from '~/components/page-container'
import { ProTable } from '~/components/pro-table'
import { QueryForm } from '~/components/query-form'
import { queryFormDayjsSchema } from '~/core/query-form-search'

import { systemApi, systemQueryKeys } from '../_shared/model'
import type { BinaryStatus, RoleFormValues, RoleRecord } from '../_shared/model'
import { BinaryStatusField } from '../_shared/ui'

interface RoleQueryValues {
  createTime?: [Dayjs, Dayjs]
  name?: string
  remark?: string
  roleId?: string
  status?: BinaryStatus
}

const roleQuerySchema = z.object({
  createTime: z.tuple([queryFormDayjsSchema, queryFormDayjsSchema]).optional(),
  name: z.string().optional(),
  remark: z.string().optional(),
  roleId: z.string().optional(),
  status: z.union([z.literal(0), z.literal(1)]).optional(),
})

type RoleMutationAction =
  | { type: 'create'; values: RoleFormValues }
  | { id: string; type: 'delete' }
  | { id: string; type: 'update'; values: Partial<RoleFormValues> }

export default function RolesPage() {
  const { message, modal } = App.useApp()
  const queryClient = useQueryClient()
  const rolesQuery = useQuery({ queryFn: systemApi.listRoles, queryKey: systemQueryKeys.roles })
  const roleMutation = useMutation<unknown, Error, RoleMutationAction>({
    mutationFn: (action: RoleMutationAction) => {
      if (action.type === 'create') return systemApi.createRole(action.values)
      if (action.type === 'delete') return systemApi.deleteRole(action.id)
      return systemApi.updateRole(action.id, action.values)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: systemQueryKeys.roles })
    },
  })
  const roles = rolesQuery.data ?? []
  const [query, setQuery] = useState<RoleQueryValues>({})
  const [editing, setEditing] = useState<RoleRecord>()
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm<RoleFormValues>()
  const filtered = roles.filter((role) => {
    const inRange =
      !query.createTime?.[0] || !query.createTime[1]
        ? true
        : role.createTime.slice(0, 10) >= query.createTime[0].format('YYYY-MM-DD') &&
          role.createTime.slice(0, 10) <= query.createTime[1].format('YYYY-MM-DD')
    return (
      (!query.name || role.name.includes(query.name)) &&
      (!query.roleId || role.id.includes(query.roleId)) &&
      (!query.remark || role.remark.includes(query.remark)) &&
      (query.status === undefined || role.status === query.status) &&
      inRange
    )
  })

  function openRoleForm(role?: RoleRecord) {
    setEditing(role)
    setOpen(true)
    window.setTimeout(() =>
      form.setFieldsValue(
        role
          ? {
              name: role.name,
              permissions: role.permissions,
              remark: role.remark,
              status: role.status,
            }
          : { name: '', permissions: [], remark: '', status: 1 },
      ),
    )
  }

  async function saveRole() {
    const values = await form.validateFields()
    if (editing) {
      await roleMutation.mutateAsync({ id: editing.id, type: 'update', values })
    } else {
      await roleMutation.mutateAsync({ type: 'create', values })
    }
    setOpen(false)
    await message.success(editing ? '角色编辑成功' : '角色创建成功')
  }

  function changeStatus(row: RoleRecord, checked: boolean) {
    const next: BinaryStatus = checked ? 1 : 0
    modal.confirm({
      content: `你要将${row.name}的状态切换为 【${checked ? '启用' : '禁用'}】 吗？`,
      onOk: () =>
        roleMutation.mutateAsync({ id: row.id, type: 'update', values: { status: next } }),
      title: '切换状态',
    })
  }

  const columns: NonNullable<TableProps<RoleRecord>['columns']> = [
    { dataIndex: 'name', fixed: 'left', title: '角色名称', width: 200 },
    { dataIndex: 'id', title: '角色ID', width: 200 },
    {
      dataIndex: 'status',
      render: (value: BinaryStatus, row) => (
        <Switch checked={value === 1} onChange={(checked) => changeStatus(row, checked)} />
      ),
      title: '状态',
      width: 100,
    },
    { dataIndex: 'remark', ellipsis: true, title: '备注' },
    { dataIndex: 'createTime', title: '创建时间', width: 200 },
    {
      fixed: 'right',
      key: 'operation',
      render: (_, row) => (
        <ButtonList
          gap={0}
          list={[
            {
              icon: <EditOutlined />,
              key: 'edit',
              label: '编辑',
              onClick: () => openRoleForm(row),
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
                  key: 'system-role-action',
                })
                try {
                  await roleMutation.mutateAsync({ id: row.id, type: 'delete' })
                  await message.success({
                    content: `${row.name} 删除成功`,
                    key: 'system-role-action',
                  })
                } catch {
                  hide()
                  await message.error('删除失败，请重试')
                }
              },
              popconfirm: { description: `确认删除角色 ${row.name} 吗？`, title: '删除角色' },
              size: 'small',
              type: 'link',
            },
          ]}
        />
      ),
      title: '操作',
      width: 150,
    },
  ]

  return (
    <PageContainer>
      <Card className="query-form-card" size="small">
        <QueryForm<RoleQueryValues>
          items={[
            { field: 'name', label: '角色名称', render: () => <Input allowClear /> },
            { field: 'roleId', label: '角色ID', render: () => <Input allowClear /> },
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
          onQuery={setQuery}
          onReset={setQuery}
          urlSync={{ namespace: 'system-role', schema: roleQuerySchema }}
          values={query}
        />
      </Card>
      <ProTable<RoleRecord>
        cardProps={{ className: 'system-grid-card' }}
        columns={columns}
        dataSource={filtered}
        headerTitle="角色列表"
        loading={rolesQuery.isFetching || roleMutation.isPending}
        preferenceKey="system-role"
        onRefresh={async () => {
          await rolesQuery.refetch()
          await message.success('角色列表已刷新')
        }}
        stableRowKey="id"
        scroll={{ x: 980 }}
        toolbarActionList={[
          {
            icon: <PlusOutlined />,
            key: 'create',
            label: '创建角色',
            onClick: () => openRoleForm(),
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
              { key: 'submit', label: '确认', onClick: saveRole, type: 'primary' },
            ]}
          />
        }
        onClose={() => setOpen(false)}
        open={open}
        size={520}
        title={editing ? '编辑角色' : '创建角色'}
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item label="角色名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <BinaryStatusField />
          <Form.Item label="备注" name="remark">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="设置权限" name="permissions">
            <Checkbox.Group
              options={[
                { label: '概览', value: 'dashboard' },
                { label: '系统管理', value: 'system' },
                { label: '演示', value: 'demos' },
                { label: '示例', value: 'examples' },
              ]}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </PageContainer>
  )
}
