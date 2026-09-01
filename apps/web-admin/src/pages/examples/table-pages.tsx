/* oxlint-disable react/no-unstable-nested-components -- QueryForm render entries are field render callbacks, not component definitions. */
import { CheckOutlined, EditOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons'
import { App, Button, Card, DatePicker, Image, Input, Modal, Select, Switch, Tag } from 'antd'
import type { TableProps } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import type { Key } from 'react'
import { useState } from 'react'
import { z } from 'zod'

import { ButtonList } from '~/components/button-list'
import { PageContainer } from '~/components/page-container'
import { ProTable } from '~/components/pro-table'
import type { ProTableProps } from '~/components/pro-table'
import { QueryForm } from '~/components/query-form'
import { readPersisted, removePersisted, writePersisted } from '~/core/persisted-storage'

interface BasicRow {
  address: string
  age: number
  id: number
  name: string
  nickname: string
  role: string
}

const roles = ['User', 'Admin', 'Manager', 'Guest']
const basicRows: BasicRow[] = Array.from({ length: 40 }, (_, index) => ({
  address: `New York${index}`,
  age: index + 1,
  id: index,
  name: `Test${index}`,
  nickname: `Test${index}`,
  role: roles[index % roles.length] ?? 'User',
}))

const basicColumns: NonNullable<TableProps<BasicRow>['columns']> = [
  { render: (_, __, index) => index + 1, title: '序号', width: 60 },
  { dataIndex: 'name', title: 'Name' },
  { dataIndex: 'age', sorter: (a, b) => a.age - b.age, title: 'Age' },
  { dataIndex: 'nickname', title: 'Nickname' },
  { dataIndex: 'role', title: 'Role' },
  { dataIndex: 'address', ellipsis: true, title: 'Address' },
]

function DocButton() {
  return (
    <Button
      onClick={() =>
        window.open('https://ant.design/components/table', '_blank', 'noopener,noreferrer')
      }
      type="primary"
    >
      查看文档
    </Button>
  )
}

export function BasicTableExample() {
  const [bordered, setBordered] = useState(false)
  const [stripe, setStripe] = useState(false)
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()

  return (
    <PageContainer
      description="ProTable 由 Ant Design 6 基础组件灵活组装，统一提供工具栏、密度、列设置、刷新、分页与选择反馈。"
      extra={<DocButton />}
      title="表格基础示例"
    >
      <ProTable<BasicRow>
        bordered={bordered}
        columns={basicColumns}
        dataSource={basicRows}
        headerTitle="基础列表"
        loading={loading}
        onRow={(row) => ({ onClick: () => void message.info(`cell-click: ${row.name}`) })}
        pagination={false}
        rowClassName={(_, index) => (stripe && index % 2 === 1 ? 'app-table-stripe' : '')}
        stableRowKey="id"
        toolbarActionList={[
          {
            key: 'border',
            label: `${bordered ? '隐藏' : '显示'}边框`,
            onClick: () => setBordered((value) => !value),
          },
          {
            key: 'loading',
            label: '显示 loading',
            onClick: () => {
              setLoading(true)
              window.setTimeout(() => setLoading(false), 2000)
            },
          },
          {
            key: 'stripe',
            label: `${stripe ? '隐藏' : '显示'}斑马纹`,
            onClick: () => setStripe((value) => !value),
          },
        ]}
      />
    </PageContainer>
  )
}

interface ProductRow {
  category: string
  color: string
  id: number
  imageUrl: string
  open: boolean
  price: number
  productName: string
  releaseDate: string
  status: 'error' | 'success' | 'warning'
}

const productRows: ProductRow[] = Array.from({ length: 48 }, (_, index) => ({
  category: ['Electronics', 'Clothing', 'Food'][index % 3] ?? 'Electronics',
  color: ['red', 'green', 'blue', 'orange'][index % 4] ?? 'blue',
  id: index + 1,
  imageUrl: `https://picsum.photos/seed/product-${index + 1}/80/80`,
  open: index % 2 === 0,
  price: 18 + index * 3,
  productName: `Product ${index + 1}`,
  releaseDate: `2026-08-${String((index % 28) + 1).padStart(2, '0')} 12:00:00`,
  status: (['success', 'warning', 'error'] as const)[index % 3] ?? 'success',
}))

const productColumns: NonNullable<TableProps<ProductRow>['columns']> = [
  { render: (_, __, index) => index + 1, title: '序号', width: 60 },
  { dataIndex: 'category', title: 'Category', width: 130 },
  { dataIndex: 'color', title: 'Color', width: 110 },
  { dataIndex: 'productName', title: 'Product Name', width: 180 },
  { dataIndex: 'price', title: 'Price', width: 100 },
  { dataIndex: 'releaseDate', title: 'DateTime', width: 190 },
]

const productPagination: NonNullable<TableProps<ProductRow>['pagination']> = { pageSize: 10 }

function ProductTable({
  columns = productColumns,
  data = productRows,
  pagination = productPagination,
  ...props
}: Omit<ProTableProps<ProductRow>, 'columns' | 'dataSource' | 'stableRowKey'> & {
  columns?: NonNullable<TableProps<ProductRow>['columns']>
  data?: ProductRow[]
}) {
  return (
    <ProTable<ProductRow>
      {...props}
      columns={columns}
      dataSource={data}
      pagination={pagination}
      stableRowKey="id"
    />
  )
}

export function RemoteTableExample() {
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  function refresh(resetPage: boolean) {
    if (resetPage) setPage(1)
    setLoading(true)
    window.setTimeout(() => setLoading(false), 600)
  }

  const columns: NonNullable<TableProps<ProductRow>['columns']> = [
    { render: (_, __, index) => index + 1, title: '序号', width: 50 },
    {
      dataIndex: 'category',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.category.localeCompare(b.category),
      title: 'Category',
    },
    {
      dataIndex: 'color',
      sorter: (a, b) => a.color.localeCompare(b.color),
      title: 'Color',
    },
    {
      dataIndex: 'productName',
      sorter: (a, b) => a.productName.localeCompare(b.productName),
      title: 'Product Name',
    },
    { dataIndex: 'price', sorter: (a, b) => a.price - b.price, title: 'Price' },
    { dataIndex: 'releaseDate', title: 'DateTime' },
  ]

  return (
    <PageContainer title={undefined}>
      <ProTable<ProductRow>
        columns={columns}
        dataSource={productRows}
        headerTitle="数据列表"
        loading={loading}
        pagination={{ current: page, onChange: setPage, pageSize: 10, showSizeChanger: true }}
        stableRowKey="id"
        rowSelection={{}}
        toolbarActionList={[
          {
            key: 'refresh',
            label: '刷新当前页面',
            loading,
            onClick: () => refresh(false),
            type: 'primary',
          },
          {
            icon: <ReloadOutlined />,
            key: 'refresh-first',
            label: '刷新并返回第一页',
            loading,
            onClick: () => refresh(true),
            type: 'primary',
          },
        ]}
      />
    </PageContainer>
  )
}

interface TreeRow {
  children?: TreeRow[]
  date: string
  id: number
  name: string
  size: number
  type: string
}

const treeRows: TreeRow[] = [
  { date: '2020-08-01', id: 10_000, name: 'Test1', size: 1024, type: 'mp3' },
  {
    children: [
      {
        children: [
          { date: '2021-04-01', id: 20_045, name: 'Test4', size: 600, type: 'html' },
          {
            children: [
              { date: '2021-10-01', id: 24_330, name: 'Test6', size: 25, type: 'txt' },
              { date: '2020-01-01', id: 21_011, name: 'Test7', size: 512, type: 'pdf' },
              { date: '2021-06-01', id: 22_200, name: 'Test8', size: 1024, type: 'js' },
            ],
            date: '2021-04-01',
            id: 10_053,
            name: 'Test5',
            size: 0,
            type: 'avi',
          },
        ],
        date: '2020-03-01',
        id: 24_300,
        name: 'Test3',
        size: 1024,
        type: 'avi',
      },
    ],
    date: '2021-04-01',
    id: 10_050,
    name: 'Test2',
    size: 0,
    type: 'mp4',
  },
  {
    children: [
      {
        children: [
          { date: '2021-06-01', id: 23_671, name: 'Test11', size: 1024, type: 'js' },
          { date: '2021-06-01', id: 23_672, name: 'Test12', size: 1024, type: 'js' },
        ],
        date: '2021-06-01',
        id: 23_677,
        name: 'Test10',
        size: 1024,
        type: 'js',
      },
      {
        children: [
          { date: '2021-06-01', id: 23_681, name: 'Test14', size: 1024, type: 'js' },
          { date: '2021-06-01', id: 23_682, name: 'Test15', size: 1024, type: 'js' },
        ],
        date: '2021-06-01',
        id: 23_688,
        name: 'Test13',
        size: 1024,
        type: 'js',
      },
    ],
    date: '2020-11-01',
    id: 23_666,
    name: 'Test9',
    size: 2048,
    type: 'xlsx',
  },
  {
    children: [
      { date: '2021-06-01', id: 24_566, name: 'Test17', size: 1024, type: 'js' },
      { date: '2021-06-01', id: 24_577, name: 'Test18', size: 1024, type: 'js' },
    ],
    date: '2020-10-01',
    id: 24_555,
    name: 'Test16',
    size: 224,
    type: 'avi',
  },
]

function getTreeKeys(rows: TreeRow[]): number[] {
  return rows.flatMap((row) => [row.id, ...(row.children ? getTreeKeys(row.children) : [])])
}

const allTreeKeys = getTreeKeys(treeRows)

export function TreeTableExample() {
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([])
  return (
    <PageContainer title={undefined}>
      <ProTable<TreeRow>
        columns={[
          { dataIndex: 'name', title: 'Name' },
          { dataIndex: 'size', title: 'Size' },
          { dataIndex: 'type', title: 'Type' },
          { dataIndex: 'date', title: 'Date' },
        ]}
        dataSource={treeRows}
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: setExpandedRowKeys,
        }}
        headerTitle="数据列表"
        pagination={false}
        stableRowKey="id"
        toolbarActionList={[
          {
            key: 'expand',
            label: '展开全部',
            onClick: () => setExpandedRowKeys(allTreeKeys),
            type: 'primary',
          },
          {
            key: 'collapse',
            label: '折叠全部',
            onClick: () => setExpandedRowKeys([]),
            type: 'primary',
          },
        ]}
      />
    </PageContainer>
  )
}

export function FixedTableExample() {
  const columns: TableProps<ProductRow>['columns'] = [
    { fixed: 'left', render: (_, __, index) => index + 1, title: '序号', width: 60 },
    { dataIndex: 'category', title: 'Category', width: 300 },
    { dataIndex: 'color', title: 'Color', width: 300 },
    { dataIndex: 'productName', title: 'Product Name', width: 300 },
    { dataIndex: 'price', title: 'Price', width: 300 },
    { dataIndex: 'releaseDate', title: 'DateTime', width: 500 },
    {
      fixed: 'right',
      render: () => <Button type="link">编辑</Button>,
      title: '操作',
      width: 120,
    },
  ]
  return (
    <PageContainer title={undefined}>
      <ProductTable columns={columns} scroll={{ x: 1920 }} />
    </PageContainer>
  )
}

export function CustomCellTableExample() {
  const [data, setData] = useState(productRows)
  const columns: TableProps<ProductRow>['columns'] = [
    { render: (_, __, index) => index + 1, title: '序号', width: 60 },
    { dataIndex: 'category', title: 'Category', width: 100 },
    {
      dataIndex: 'imageUrl',
      render: (source: string, row) => (
        <Image alt={row.productName} height={30} src={source} width={30} />
      ),
      title: 'Image',
      width: 100,
    },
    {
      dataIndex: 'imageUrl',
      render: (source: string, row) => (
        <Image alt={row.productName} height={30} src={source} width={30} />
      ),
      title: 'Render Image',
      width: 130,
    },
    {
      dataIndex: 'open',
      render: (open: boolean, row) => (
        <Switch
          checked={open}
          onChange={(checked) =>
            setData((items) =>
              items.map((item) => (item.id === row.id ? { ...item, open: checked } : item)),
            )
          }
        />
      ),
      title: 'Open',
      width: 100,
    },
    {
      dataIndex: 'status',
      render: (status: ProductRow['status'], row) => <Tag color={row.color}>{status}</Tag>,
      title: 'Status',
      width: 100,
    },
    { dataIndex: 'color', title: 'Color', width: 100 },
    { dataIndex: 'productName', title: 'Product Name', width: 200 },
    { dataIndex: 'price', title: 'Price', width: 100 },
    { dataIndex: 'releaseDate', title: 'Date', width: 200 },
    { fixed: 'right', render: () => <Button type="link">编辑</Button>, title: '操作', width: 120 },
  ]
  return (
    <PageContainer title={undefined}>
      <ProductTable columns={columns} data={data} scroll={{ x: 1240 }} />
    </PageContainer>
  )
}

export function TableFormExample() {
  interface SearchFormValues {
    category?: string
    color?: string
    date?: [Dayjs, Dayjs]
    price?: string
    productName?: string
  }

  const { message } = App.useApp()
  const [query, setQuery] = useState<SearchFormValues>({})

  function submit(values: SearchFormValues) {
    setQuery(values)
    const { date, ...fields } = values
    const encoded = {
      ...fields,
      end: date?.[1].format('YYYY-MM-DD'),
      start: date?.[0].format('YYYY-MM-DD'),
    }
    void message.success(`Query params: ${JSON.stringify(encoded)}`)
  }

  const filteredRows = productRows.filter((row) => {
    const price = query.price ? Number(query.price) : undefined
    return (
      (!query.category || row.category.toLowerCase().includes(query.category.toLowerCase())) &&
      (!query.color || row.color === query.color) &&
      (!query.productName ||
        row.productName.toLowerCase().includes(query.productName.toLowerCase())) &&
      (price === undefined || Number.isNaN(price) || row.price === price)
    )
  })

  return (
    <PageContainer title={undefined}>
      <Card className="query-form-card" size="small">
        <QueryForm<SearchFormValues>
          items={[
            { field: 'category', label: 'Category', render: () => <Input allowClear /> },
            { field: 'productName', label: 'Product Name', render: () => <Input allowClear /> },
            { field: 'price', label: 'Price', render: () => <Input allowClear /> },
            {
              field: 'color',
              label: 'Color',
              render: () => (
                <Select
                  allowClear
                  options={[
                    { label: 'Red', value: 'red' },
                    { label: 'Green', value: 'green' },
                    { label: 'Blue', value: 'blue' },
                    { label: 'Orange', value: 'orange' },
                  ]}
                  placeholder="请选择"
                />
              ),
            },
            {
              field: 'date',
              initialValue: [dayjs().subtract(7, 'days'), dayjs()],
              label: 'Date',
              render: () => <DatePicker.RangePicker />,
            },
          ]}
          onQuery={submit}
          onReset={setQuery}
          urlSync={{ namespace: 'pro-table-form' }}
        />
      </Card>
      <ProductTable data={filteredRows} headerTitle="数据列表" rowSelection={{}} />
    </PageContainer>
  )
}

function EditableProductTable({ rowMode }: { rowMode: boolean }) {
  type EditableKey = 'category' | 'color' | 'productName'

  const { message } = App.useApp()
  const [data, setData] = useState(productRows.slice(0, 12))
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingCell, setEditingCell] = useState<{ id: number; key: EditableKey } | null>(null)
  const [originalRow, setOriginalRow] = useState<ProductRow | null>(null)
  const [saving, setSaving] = useState(false)
  const update = (id: number, key: keyof ProductRow, value: string | number) =>
    setData((items) => items.map((item) => (item.id === id ? { ...item, [key]: value } : item)))

  function startRowEdit(row: ProductRow) {
    if (!rowMode || editingId === row.id) return
    setOriginalRow({ ...row })
    setEditingId(row.id)
  }

  function saveRow(row: ProductRow) {
    setSaving(true)
    window.setTimeout(() => {
      setSaving(false)
      setEditingId(null)
      setOriginalRow(null)
      void message.success(`保存成功！category=${row.category}`)
    }, 600)
  }

  function cancelRow() {
    if (originalRow) {
      setData((items) => items.map((item) => (item.id === originalRow.id ? originalRow : item)))
    }
    setEditingId(null)
    setOriginalRow(null)
  }

  const editColumn = (key: EditableKey, title: string) =>
    ({
      dataIndex: key,
      render: (value: string, row) =>
        (rowMode && editingId === row.id) ||
        (!rowMode && editingCell?.id === row.id && editingCell.key === key) ? (
          <Input
            autoFocus
            onBlur={() => {
              if (!rowMode) setEditingCell(null)
            }}
            onChange={(event) => update(row.id, key, event.target.value)}
            onClick={(event) => event.stopPropagation()}
            onPressEnter={() => {
              if (!rowMode) setEditingCell(null)
            }}
            value={value}
          />
        ) : (
          <button
            className="app-table-edit-cell"
            onClick={(event) => {
              event.stopPropagation()
              if (rowMode) startRowEdit(row)
              else setEditingCell({ id: row.id, key })
            }}
            type="button"
          >
            {value}
          </button>
        ),
      title,
    }) satisfies NonNullable<TableProps<ProductRow>['columns']>[number]
  const columns: TableProps<ProductRow>['columns'] = [
    { render: (_, __, index) => index + 1, title: '序号', width: 60 },
    editColumn('category', 'Category'),
    editColumn('color', 'Color'),
    editColumn('productName', 'Product Name'),
    { dataIndex: 'price', title: 'Price' },
    { dataIndex: 'releaseDate', title: 'Date' },
    ...(rowMode
      ? [
          {
            render: (_: unknown, row: ProductRow) => (
              <ButtonList
                list={
                  editingId === row.id
                    ? [
                        {
                          icon: <CheckOutlined />,
                          key: 'save',
                          label: '保存',
                          loading: saving,
                          onClick: () => saveRow(row),
                          type: 'link',
                        },
                        {
                          disabled: saving,
                          key: 'cancel',
                          label: '取消',
                          onClick: cancelRow,
                          type: 'link',
                        },
                      ]
                    : [
                        {
                          icon: <EditOutlined />,
                          key: 'edit',
                          label: '编辑',
                          onClick: () => startRowEdit(row),
                          type: 'link',
                        },
                      ]
                }
              />
            ),
            title: '操作',
          },
        ]
      : []),
  ]
  return (
    <ProductTable
      columns={columns}
      data={data}
      onRow={(row) => ({ onClick: () => startRowEdit(row) })}
      pagination={false}
    />
  )
}

export function EditCellTableExample() {
  return (
    <PageContainer title={undefined}>
      <EditableProductTable rowMode={false} />
    </PageContainer>
  )
}

export function EditRowTableExample() {
  return (
    <PageContainer title={undefined}>
      <EditableProductTable rowMode />
    </PageContainer>
  )
}

export { VirtualTableExample } from '../../../react-compiler-excluded/virtual-table-example'

const viewedKey = 'viewed-rows'
const viewedRowsSchema = z.array(z.number())

export function ViewedTableExample() {
  const { message } = App.useApp()
  const [viewed, setViewed] = useState<number[]>(() =>
    readPersisted(window.localStorage, viewedKey, viewedRowsSchema, []),
  )
  const [editing, setEditing] = useState<ProductRow | null>(null)
  const [customStyle, setCustomStyle] = useState(false)
  const [customClassName, setCustomClassName] = useState(false)

  function mark(...ids: number[]) {
    const next = [...new Set([...viewed, ...ids])]
    setViewed(next)
    writePersisted(window.localStorage, viewedKey, next)
  }

  function clearViewed() {
    setViewed([])
    removePersisted(window.localStorage, viewedKey)
  }

  const columns: TableProps<ProductRow>['columns'] = [
    ...(productColumns ?? []),
    {
      fixed: 'right',
      render: (_, row) => (
        <ButtonList
          list={[
            {
              icon: <EyeOutlined />,
              key: 'view',
              label: '查看',
              onClick: () => {
                mark(row.id)
                void message.success(`查看${row.category}`)
              },
              type: 'link',
            },
            {
              key: 'edit',
              label: '编辑',
              onClick: () => setEditing(row),
              type: 'link',
            },
            ...(viewed.includes(row.id)
              ? [{ key: 'viewed', render: <Tag color="success">已查看</Tag> }]
              : []),
          ]}
        />
      ),
      title: '操作',
      width: 220,
    },
  ]

  return (
    <PageContainer
      description="行标记状态通过独立持久化适配器维护，表格只消费受控数据与样式回调，不耦合具体存储实现。"
      title="表格行标记示例"
    >
      <ProductTable
        columns={columns}
        headerTitle="已查看行标记"
        onRow={(row) => ({
          style: customStyle && viewed.includes(row.id) ? { backgroundColor: 'gray' } : undefined,
        })}
        rowClassName={(row) => {
          if (!viewed.includes(row.id)) return ''
          return customClassName ? 'app-table-viewed-custom' : 'app-table-viewed'
        }}
        scroll={{ x: 1100 }}
        toolbarActionList={[
          {
            key: 'mark',
            label: '手动标记',
            onClick: () => mark(...productRows.slice(0, 2).map((row) => row.id)),
            type: 'primary',
          },
          {
            key: 'style',
            label: '设置Style',
            onClick: () => setCustomStyle((value) => !value),
            type: 'primary',
          },
          {
            key: 'class',
            label: '设置ClassName',
            onClick: () => setCustomClassName((value) => !value),
            type: 'primary',
          },
          { key: 'clear', label: '清空缓存', onClick: clearViewed, type: 'primary' },
        ]}
      />
      <Modal
        onCancel={() => setEditing(null)}
        onOk={() => {
          if (editing) mark(editing.id)
          setEditing(null)
        }}
        open={Boolean(editing)}
        title="数据修改"
      >
        数据修改完成后设置行标记
      </Modal>
    </PageContainer>
  )
}
