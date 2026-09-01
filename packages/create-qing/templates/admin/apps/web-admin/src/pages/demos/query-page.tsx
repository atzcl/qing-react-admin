import {
  keepPreviousData,
  queryOptions,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { Button, Card, Empty, Form, Select, Space } from 'antd'
import { useState } from 'react'
import { z } from 'zod'

import { PageContainer } from '~/components/page-container'

interface Product {
  id: number
  title: string
}

interface ProductsResponse {
  limit: number
  products: Product[]
  skip: number
  total: number
}

const productsResponseSchema = z.object({
  limit: z.number(),
  products: z.array(z.object({ id: z.number(), title: z.string() })),
  skip: z.number(),
  total: z.number(),
})

const limit = 10

async function fetchProducts(skip: number): Promise<ProductsResponse> {
  const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const body: unknown = await response.json()
  return productsResponseSchema.parse(body)
}

function PaginatedQueries() {
  const [page, setPage] = useState(1)
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => fetchProducts((page - 1) * limit),
    queryKey: ['products', 'pagination', page],
  })

  return (
    <div>
      <Space size={16}>
        <Button onClick={() => setPage((value) => Math.max(value - 1, 1))} size="small">
          上一页
        </Button>
        <p>当前页: {page}</p>
        <Button
          disabled={query.isPlaceholderData}
          onClick={() => setPage((value) => value + 1)}
          size="small"
        >
          下一页
        </Button>
      </Space>
      <div className="app-query-results">
        {query.isPending ? <div>加载中...</div> : null}
        {query.isError ? <div>出错了: {String(query.error)}</div> : null}
        {query.data ? (
          <ul>
            {query.data.products.map((product) => (
              <li key={product.id}>{product.title}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

function InfiniteQueries() {
  const query = useInfiniteQuery({
    getNextPageParam: (current: ProductsResponse, pages: ProductsResponse[]) => {
      const lastPage = current.skip + current.limit
      return lastPage >= current.total ? undefined : pages.length * limit
    },
    initialPageParam: 0,
    queryFn: ({ pageParam }: { pageParam: number }) => fetchProducts(pageParam),
    queryKey: ['products', 'infinite'],
  })

  if (query.isPending) return <span>加载...</span>
  if (query.isError) return <span>出错了: {String(query.error)}</span>
  return (
    <div className="app-query-infinite">
      {query.isFetching && !query.isFetchingNextPage ? <span>Fetching...</span> : null}
      {query.data.pages.map((group) => (
        <ul key={group.skip}>
          {group.products.map((product) => (
            <li key={product.id}>{product.title}</li>
          ))}
        </ul>
      ))}
      <Button
        disabled={!query.hasNextPage || query.isFetchingNextPage}
        onClick={() => void query.fetchNextPage()}
      >
        {query.isFetchingNextPage ? '加载中...' : query.hasNextPage ? '加载更多' : '没有更多了'}
      </Button>
    </div>
  )
}

function QueryRetries() {
  const [count, setCount] = useState(-1)
  const query = useQuery({
    enabled: false,
    queryFn: async () => {
      setCount((value) => value + 1)
      await new Promise((resolve) => window.setTimeout(resolve, 1000))
      throw new Error('something went wrong!')
    },
    queryKey: ['query-retries'],
    retry: 3,
  })

  return (
    <>
      <Button
        loading={query.isFetching}
        onClick={() => {
          setCount(-1)
          void query.refetch()
        }}
      >
        发起错误重试
      </Button>
      {count > 0 ? <p className="app-demo-result">重试次数{count}</p> : null}
      <p>{query.error ? String(query.error) : null}</p>
    </>
  )
}

const menuOptions = [
  { id: 1, name: '仪表盘' },
  { id: 2, name: '分析页' },
  { id: 3, name: '工作台' },
  { id: 4, name: '演示' },
  { id: 5, name: '系统管理' },
]

const menuQueryOptions = queryOptions({
  queryFn: async () => menuOptions,
  queryKey: ['demo', 'api', 'options'],
  staleTime: 1000 * 60 * 5,
})

function ConcurrencyCaching() {
  const queryClient = useQueryClient()
  const { dataUpdatedAt } = useQuery(menuQueryOptions)
  const [loadedOptions, setLoadedOptions] = useState(menuOptions)

  async function fetchOptions() {
    const options = await queryClient.fetchQuery(menuQueryOptions)
    setLoadedOptions(options)
  }

  return (
    <div>
      <div className="app-query-cache-heading">
        <div>以下4个组件共用一个数据源。</div>
        <div>缓存更新时间：{new Date(dataUpdatedAt).toLocaleString()}</div>
      </div>
      <Form labelCol={{ span: 5 }}>
        {Array.from({ length: 4 }, (_, index) => (
          <Form.Item key={index} label={`Select ${index}`}>
            <Select
              onOpenChange={(open) => {
                if (open) void fetchOptions()
              }}
              options={loadedOptions.map((option) => ({
                label: option.name,
                value: option.id,
              }))}
              showSearch={{ optionFilterProp: 'label' }}
            />
          </Form.Item>
        ))}
      </Form>
    </div>
  )
}

export function TanStackQueryDemo() {
  const [showCaching, setShowCaching] = useState(true)

  function reloadCaching() {
    setShowCaching(false)
    window.setTimeout(() => setShowCaching(true), 1000)
  }

  return (
    <PageContainer title="TanStack Query 示例">
      <div className="app-query-grid">
        <Card title="分页查询">
          <PaginatedQueries />
        </Card>
        <Card title="无限滚动">
          <InfiniteQueries />
        </Card>
        <Card title="错误重试">
          <QueryRetries />
        </Card>
        <Card
          extra={<Button onClick={reloadCaching}>重新加载</Button>}
          styles={{ body: { minHeight: 330 } }}
          title="并发和缓存"
        >
          {showCaching ? <ConcurrencyCaching /> : <Empty description="正在加载..." />}
        </Card>
      </div>
    </PageContainer>
  )
}
