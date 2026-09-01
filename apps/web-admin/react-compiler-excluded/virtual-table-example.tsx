import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import {
  columnSizingFeature,
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Card } from 'antd'
import { useMemo, useRef } from 'react'

import { PageContainer } from '../src/components/page-container'

interface VirtualRow {
  id: number
  name: string
  role: string
  sex: string
}

const virtualTableFeatures = tableFeatures({
  columnSizingFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})
const virtualColumnHelper = createColumnHelper<typeof virtualTableFeatures, VirtualRow>()
const virtualColumns = virtualColumnHelper.columns([
  virtualColumnHelper.accessor('name', { header: 'Name', size: 220 }),
  virtualColumnHelper.accessor('role', { header: 'Role', size: 220 }),
  virtualColumnHelper.accessor('sex', { header: 'Sex', size: 180 }),
])

/**
 * TanStack Virtual intentionally sits outside the Rust React Compiler source filter.
 * Its hook returns imperative functions that the compiler documents as unsafe to memoize.
 */
export function VirtualTableExample() {
  const data = useMemo(
    () =>
      Array.from({ length: 1000 }, (_, index) => ({
        id: 10_000 + index,
        name: `Test${index}`,
        role: 'Developer',
        sex: '男',
      })),
    [],
  )
  const table = useTable({ columns: virtualColumns, data, features: virtualTableFeatures })
  const scrollRef = useRef<HTMLDivElement>(null)
  const rows = table.getRowModel().rows
  // oxlint-disable-next-line react/incompatible-library -- this file is excluded from the Rust React Compiler source filter for this documented TanStack Virtual boundary.
  const virtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 44,
    getItemKey: (index) => rows[index]?.id ?? index,
    getScrollElement: () => scrollRef.current,
    overscan: 8,
  })

  return (
    <PageContainer title={undefined}>
      <Card>
        <div className="tanstack-table">
          <div className="tanstack-table__head" role="row">
            {table.getHeaderGroups().flatMap((group) =>
              group.headers.map((header) => {
                const sorted = header.column.getIsSorted()
                return (
                  <button
                    className="tanstack-table__cell"
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ width: header.getSize() }}
                    type="button"
                  >
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                    {sorted === 'asc' ? <ArrowUpOutlined /> : null}
                    {sorted === 'desc' ? <ArrowDownOutlined /> : null}
                  </button>
                )
              }),
            )}
          </div>
          <div className="tanstack-table__viewport" ref={scrollRef}>
            <div className="tanstack-table__spacer" style={{ height: virtualizer.getTotalSize() }}>
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index]
                if (!row) return null
                return (
                  <div
                    className="tanstack-table__row"
                    data-index={virtualRow.index}
                    key={row.id}
                    ref={virtualizer.measureElement}
                    role="row"
                    style={{ transform: `translateY(${virtualRow.start}px)` }}
                  >
                    {row.getAllCells().map((cell) => (
                      <div
                        className="tanstack-table__cell"
                        key={cell.id}
                        role="cell"
                        style={{ width: cell.column.getSize() }}
                      >
                        <table.FlexRender cell={cell} />
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Card>
    </PageContainer>
  )
}
