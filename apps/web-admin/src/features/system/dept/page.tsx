import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App, Form, Input, Modal, TreeSelect } from 'antd'
import type { TableProps } from 'antd'
import { useState } from 'react'

import { ButtonList } from '~/components/button-list'
import { PageContainer } from '~/components/page-container'
import { ProTable } from '~/components/pro-table'

import { departmentTreeData, systemApi, systemQueryKeys } from '../_shared/model'
import type { DepartmentFormValues, DepartmentRecord } from '../_shared/model'
import { BinaryStatusField, statusTag } from '../_shared/ui'

type DepartmentMutationAction =
  | { type: 'create'; values: DepartmentFormValues }
  | { id: string; type: 'delete' }
  | { id: string; type: 'update'; values: DepartmentFormValues }

export default function DepartmentsPage() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  const departmentsQuery = useQuery({
    queryFn: systemApi.listDepartments,
    queryKey: systemQueryKeys.departments,
  })
  const departmentMutation = useMutation<unknown, Error, DepartmentMutationAction>({
    mutationFn: (action: DepartmentMutationAction) => {
      if (action.type === 'create') return systemApi.createDepartment(action.values)
      if (action.type === 'delete') return systemApi.deleteDepartment(action.id)
      return systemApi.updateDepartment(action.id, action.values)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: systemQueryKeys.departments })
    },
  })
  const departments = departmentsQuery.data ?? []
  const [editing, setEditing] = useState<DepartmentRecord>()
  const [parentId, setParentId] = useState('0')
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm<DepartmentFormValues>()

  function openDepartmentForm(department?: DepartmentRecord, appendTo?: string) {
    setEditing(department)
    setParentId(appendTo ?? department?.pid ?? '0')
    setOpen(true)
    window.setTimeout(() =>
      form.setFieldsValue(
        department
          ? {
              name: department.name,
              pid: department.pid,
              remark: department.remark,
              status: department.status,
            }
          : { name: '', pid: appendTo ?? '0', remark: '', status: 1 },
      ),
    )
  }

  async function saveDepartment() {
    const values = await form.validateFields()
    if (editing) {
      await departmentMutation.mutateAsync({ id: editing.id, type: 'update', values })
    } else {
      await departmentMutation.mutateAsync({ type: 'create', values })
    }
    setOpen(false)
    await message.success(editing ? '部门编辑成功' : '部门创建成功')
  }

  const columns: NonNullable<TableProps<DepartmentRecord>['columns']> = [
    { dataIndex: 'name', fixed: 'left', title: '部门名称', width: 180 },
    { dataIndex: 'status', render: statusTag, title: '状态', width: 100 },
    { dataIndex: 'createTime', title: '创建时间', width: 180 },
    { dataIndex: 'remark', ellipsis: true, title: '备注' },
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
              onClick: () => openDepartmentForm(undefined, row.id),
              size: 'small',
              type: 'link',
            },
            {
              icon: <EditOutlined />,
              key: 'edit',
              label: '编辑',
              onClick: () => openDepartmentForm(row),
              size: 'small',
              type: 'link',
            },
            {
              danger: true,
              disabled: Boolean(row.children?.length),
              icon: <DeleteOutlined />,
              key: 'delete',
              label: '删除',
              onClick: async () => {
                const hide = message.loading({
                  content: `正在删除 ${row.name}...`,
                  duration: 0,
                  key: 'system-department-action',
                })
                try {
                  await departmentMutation.mutateAsync({ id: row.id, type: 'delete' })
                  await message.success({
                    content: `${row.name} 删除成功`,
                    key: 'system-department-action',
                  })
                } catch {
                  hide()
                  await message.error('删除失败，请重试')
                }
              },
              popconfirm: {
                description: row.children?.length
                  ? '请先删除下级部门'
                  : `确认删除 ${row.name} 吗？`,
                disabled: Boolean(row.children?.length),
                title: '删除部门',
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
      <ProTable<DepartmentRecord>
        cardProps={{ className: 'system-grid-card' }}
        columns={columns}
        dataSource={departments}
        defaultExpandAllRows
        preferenceKey="system-department"
        headerTitle="部门列表"
        loading={departmentsQuery.isFetching || departmentMutation.isPending}
        onRefresh={async () => {
          await departmentsQuery.refetch()
          await message.success('部门列表已刷新')
        }}
        pagination={false}
        stableRowKey="id"
        scroll={{ x: 930 }}
        toolbarActionList={[
          {
            icon: <PlusOutlined />,
            key: 'create',
            label: '创建部门',
            onClick: () => openDepartmentForm(),
            type: 'primary',
          },
        ]}
      />
      <Modal
        destroyOnHidden
        onCancel={() => setOpen(false)}
        onOk={() => void saveDepartment()}
        open={open}
        title={editing ? '编辑部门' : parentId === '0' ? '创建部门' : '新增下级部门'}
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            label="部门名称"
            name="name"
            rules={[
              { max: 20, message: '部门名称最多 20 个字符' },
              { min: 2, message: '部门名称至少 2 个字符' },
              { required: true },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="上级部门" name="pid">
            <TreeSelect
              allowClear
              placeholder="根部门"
              treeData={departmentTreeData(
                editing
                  ? departments.filter((department) => department.id !== editing.id)
                  : departments,
              )}
            />
          </Form.Item>
          <BinaryStatusField />
          <Form.Item
            label="备注"
            name="remark"
            rules={[{ max: 50, message: '备注最多 50 个字符' }]}
          >
            <Input.TextArea maxLength={50} rows={3} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
}
