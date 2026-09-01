/* oxlint-disable react/no-unstable-nested-components -- popupRender is an Ant Design render callback, not a component definition. */
import {
  ColumnHeightOutlined,
  HolderOutlined,
  ReloadOutlined,
  SettingOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons'
import { Button, Card, Checkbox, Dropdown, Empty, Table, Tooltip, Typography } from 'antd'
import type { CardProps, MenuProps, TableProps } from 'antd'
import type { ColumnGroupType, ColumnsType, ColumnType } from 'antd/es/table/interface.js'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Key, MouseEvent, ReactElement, ReactNode } from 'react'

import { ButtonList } from './button-list'
import type { ButtonListItem } from './button-list'

const columnVisibilityStoragePrefix = 'qing.standard-table.columns'
const densityStorageKey = 'qing.standard-table.density'
const actionColumnIds = new Set(['action', 'actions', 'operation', 'operations'])
const defaultActionColumnWidth = 168
const maxActionColumnWidth = 220
const rowSelectionColumnWidth = 36

export type StandardTableDensity = 'large' | 'middle' | 'small'
export type StandardTableColumnFixedSide = 'left' | 'right'

export interface StandardTableColumnPreferences {
  fixedColumnIds: Readonly<Record<string, StandardTableColumnFixedSide>>
  orderedColumnIds: readonly string[]
  visibleColumnIds: ReadonlySet<string>
}

interface ColumnVisibilityOptions {
  storageKey?: string
  triggerAriaLabel?: string
}

interface DensityOptions {
  defaultValue?: StandardTableDensity
  storageKey?: string
  triggerAriaLabel?: string
}

interface ColumnVisibilityItem {
  id: string
  label: ReactNode
}

export interface ProTableLocale {
  clearSelectionLabel: string
  columnVisibilityAriaLabel: string
  columnVisibilityDragHandleLabel: string
  columnVisibilityResetLabel: string
  columnVisibilityTooltip: string
  currentPageSelectionLabel: string
  densityAriaLabel: string
  densityLargeLabel: string
  densityMiddleLabel: string
  densitySmallLabel: string
  densityTooltip: string
  pinColumnEndLabel: string
  pinColumnStartLabel: string
  refreshAriaLabel: string
  refreshTooltip: string
  selectedRowsText: (count: number) => string
  unpinColumnLabel: string
}

const defaultLocale: ProTableLocale = {
  clearSelectionLabel: 'Clear selection',
  columnVisibilityAriaLabel: 'Column display',
  columnVisibilityDragHandleLabel: 'Drag to reorder',
  columnVisibilityResetLabel: 'Reset',
  columnVisibilityTooltip: 'Column display',
  currentPageSelectionLabel: 'Current page',
  densityAriaLabel: 'Table density',
  densityLargeLabel: 'Large',
  densityMiddleLabel: 'Middle',
  densitySmallLabel: 'Compact',
  densityTooltip: 'Table density',
  pinColumnEndLabel: 'Pin to end',
  pinColumnStartLabel: 'Pin to start',
  refreshAriaLabel: 'Refresh table',
  refreshTooltip: 'Refresh',
  selectedRowsText: (count) => `${count} selected`,
  unpinColumnLabel: 'Unpin',
}

const ProTableLocaleContext = createContext<ProTableLocale>(defaultLocale)

export function ProTableLocaleProvider({
  children,
  locale,
}: {
  children?: ReactNode
  locale: ProTableLocale
}): ReactElement {
  return <ProTableLocaleContext.Provider value={locale}>{children}</ProTableLocaleContext.Provider>
}

export interface ProTableProps<RecordType extends object> extends Omit<
  TableProps<RecordType>,
  'columns' | 'locale' | 'rowKey' | 'size' | 'title'
> {
  batchSelection?: {
    onClear: () => void
    scopeLabel?: string
    selectedRowCount: number
  }
  cardProps?: Omit<CardProps, 'children' | 'extra' | 'title'>
  columns: ColumnsType<RecordType>
  columnVisibility?: boolean | ColumnVisibilityOptions
  density?: boolean | DensityOptions
  description?: ReactNode
  emptyText?: ReactNode
  headerTitle?: ReactNode
  onRefresh?: () => unknown
  refreshLoading?: boolean
  size?: StandardTableDensity
  stableRowKey: string | keyof RecordType | ((record: RecordType) => Key)
  toolbarActionList?: readonly ButtonListItem[]
  toolbarActions?: ReactNode
}

/**
 * Qing StandardTable-compatible table behaviour wrapped in this application's
 * existing title-card composition. QueryForm intentionally remains a page-level sibling.
 */
export function ProTable<RecordType extends object>({
  batchSelection,
  bordered = true,
  cardProps,
  columns,
  columnVisibility = true,
  dataSource,
  density = true,
  description,
  emptyText,
  headerTitle,
  onRefresh,
  onRow,
  pagination,
  refreshLoading = false,
  rowSelection,
  size,
  stableRowKey,
  toolbarActionList,
  toolbarActions,
  ...tableProps
}: ProTableProps<RecordType>): ReactElement {
  const locale = useContext(ProTableLocaleContext)
  const normalizedColumns = useMemo(() => normalizeStandardTableColumns(columns), [columns])
  const visibilityItems = useMemo(
    () => createColumnVisibilityItems(normalizedColumns),
    [normalizedColumns],
  )
  const columnIds = useMemo(() => visibilityItems.map((item) => item.id), [visibilityItems])
  const columnIdsSignature = columnIds.join('|')
  const columnOptions = typeof columnVisibility === 'object' ? columnVisibility : undefined
  const densityOptions = typeof density === 'object' ? density : undefined
  const densityEnabled = density !== false
  const visibilityEnabled =
    columnVisibility !== false && normalizedColumns.length > 0 && visibilityItems.length > 1
  const resolvedDensityStorageKey = densityOptions?.storageKey ?? densityStorageKey
  const resolvedColumnStorageKey =
    columnOptions?.storageKey ?? `${columnVisibilityStoragePrefix}.${hashText(columnIdsSignature)}`
  const [tableDensity, setTableDensity] = useState<StandardTableDensity>(() =>
    readDensity(resolvedDensityStorageKey, densityOptions?.defaultValue ?? size ?? 'small'),
  )
  const [columnPreferences, setColumnPreferences] = useState<StandardTableColumnPreferences>(() =>
    readColumnPreferences(resolvedColumnStorageKey, columnIds),
  )
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null)
  const [internalRefreshLoading, setInternalRefreshLoading] = useState(false)
  const [internalSelectedRowKeys, setInternalSelectedRowKeys] = useState<readonly Key[]>(
    rowSelection?.defaultSelectedRowKeys ?? [],
  )

  useEffect(() => {
    if (densityEnabled) writeDensity(resolvedDensityStorageKey, tableDensity)
  }, [densityEnabled, resolvedDensityStorageKey, tableDensity])

  const normalizedPreferences = useMemo(
    () => normalizeColumnPreferences(columnPreferences, columnIds),
    [columnIds, columnPreferences],
  )

  useEffect(() => {
    if (visibilityEnabled) writeColumnPreferences(resolvedColumnStorageKey, normalizedPreferences)
  }, [normalizedPreferences, resolvedColumnStorageKey, visibilityEnabled])

  const visibleColumns = useMemo(
    () =>
      visibilityEnabled
        ? applyColumnPreferences(normalizedColumns, normalizedPreferences)
        : normalizedColumns,
    [normalizedColumns, normalizedPreferences, visibilityEnabled],
  )
  const orderedVisibilityItems = useMemo(
    () => orderVisibilityItems(visibilityItems, normalizedPreferences.orderedColumnIds),
    [normalizedPreferences.orderedColumnIds, visibilityItems],
  )
  const selectedRowKeys = rowSelection?.selectedRowKeys ?? internalSelectedRowKeys
  const mergedRowSelection: TableProps<RecordType>['rowSelection'] = rowSelection
    ? {
        ...rowSelection,
        columnWidth: rowSelectionColumnWidth,
        selectedRowKeys: [...selectedRowKeys],
        onChange: (keys, rows, info) => {
          setInternalSelectedRowKeys(keys)
          rowSelection.onChange?.(keys, rows, info)
        },
      }
    : undefined

  const changeSelectionFromRow = useCallback(
    (record: RecordType, event: MouseEvent<HTMLElement>) => {
      if (!rowSelection || isRowSelectionClickIgnored(event.target)) return
      if (rowSelection.getCheckboxProps?.(record).disabled) return

      const recordKey = resolveRecordKey(stableRowKey, record)
      const nextKeys = resolveNextSelectedRowKeys(
        selectedRowKeys,
        recordKey,
        rowSelection.type ?? 'checkbox',
      )
      const selectedRows = resolveSelectedRows(dataSource ?? [], stableRowKey, nextKeys)
      setInternalSelectedRowKeys(nextKeys)
      rowSelection.onSelect?.(record, nextKeys.includes(recordKey), selectedRows, event.nativeEvent)
      rowSelection.onChange?.(nextKeys, selectedRows, { type: 'single' })
    },
    [dataSource, rowSelection, selectedRowKeys, stableRowKey],
  )

  const mergedOnRow = useCallback<NonNullable<TableProps<RecordType>['onRow']>>(
    (record, index) => {
      const rowProps = onRow?.(record, index) ?? {}
      if (!rowSelection) return rowProps
      const disabled = rowSelection.getCheckboxProps?.(record).disabled
      return {
        ...rowProps,
        className: [rowProps.className, disabled ? undefined : 'pro-table__selectable-row']
          .filter(Boolean)
          .join(' '),
        onClick: (event) => {
          rowProps.onClick?.(event)
          if (!event.defaultPrevented) changeSelectionFromRow(record, event)
        },
      }
    },
    [changeSelectionFromRow, onRow, rowSelection],
  )

  const visibleSelection =
    batchSelection && batchSelection.selectedRowCount > 0
      ? batchSelection
      : rowSelection && selectedRowKeys.length > 0
        ? {
            onClear: () => {
              setInternalSelectedRowKeys([])
              rowSelection.onChange?.([], [], { type: 'none' })
            },
            selectedRowCount: selectedRowKeys.length,
          }
        : undefined
  const toolbarVisible =
    Boolean(
      headerTitle || description || toolbarActionList || toolbarActions || visibleSelection,
    ) || Boolean(onRefresh || densityEnabled || visibilityEnabled)
  const allColumnsVisible =
    columnIds.length > 0 && normalizedPreferences.visibleColumnIds.size === columnIds.length
  const someColumnsVisible = normalizedPreferences.visibleColumnIds.size > 0

  async function refresh() {
    if (!onRefresh || internalRefreshLoading) return
    setInternalRefreshLoading(true)
    try {
      await onRefresh()
    } finally {
      setInternalRefreshLoading(false)
    }
  }

  const densityItems: NonNullable<MenuProps['items']> = [
    { key: 'large', label: locale.densityLargeLabel },
    { key: 'middle', label: locale.densityMiddleLabel },
    { key: 'small', label: locale.densitySmallLabel },
  ]
  const tools = (
    <div className="pro-table__tools">
      {onRefresh ? (
        <Tooltip title={locale.refreshTooltip}>
          <Button
            aria-label={locale.refreshAriaLabel}
            icon={<ReloadOutlined />}
            loading={refreshLoading || internalRefreshLoading}
            type="text"
            onClick={() => void refresh()}
          />
        </Tooltip>
      ) : null}
      {densityEnabled ? (
        <Tooltip title={locale.densityTooltip}>
          <Dropdown
            menu={{
              items: densityItems,
              selectedKeys: [tableDensity],
              onClick: ({ key }) => {
                if (isDensity(key)) setTableDensity(key)
              },
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button
              aria-label={densityOptions?.triggerAriaLabel ?? locale.densityAriaLabel}
              icon={<ColumnHeightOutlined />}
              type="text"
            />
          </Dropdown>
        </Tooltip>
      ) : null}
      {visibilityEnabled ? (
        <Tooltip title={locale.columnVisibilityTooltip}>
          <Dropdown
            menu={{ items: [] }}
            placement="bottomRight"
            popupRender={() => (
              <div className="pro-table__column-settings">
                <div className="pro-table__column-settings-header">
                  <Checkbox
                    checked={allColumnsVisible}
                    indeterminate={!allColumnsVisible && someColumnsVisible}
                    onChange={(event) =>
                      setColumnPreferences((current) =>
                        updateAllColumnPreferenceVisibility(
                          current,
                          event.target.checked,
                          columnIds,
                        ),
                      )
                    }
                  >
                    {locale.columnVisibilityTooltip}
                  </Checkbox>
                  <Button
                    htmlType="button"
                    size="small"
                    type="link"
                    onClick={() => setColumnPreferences(createDefaultColumnPreferences(columnIds))}
                  >
                    {locale.columnVisibilityResetLabel}
                  </Button>
                </div>
                <div className="pro-table__column-settings-list">
                  {orderedVisibilityItems.map((item) => {
                    const fixedSide = normalizedPreferences.fixedColumnIds[item.id]
                    const visible = normalizedPreferences.visibleColumnIds.has(item.id)
                    return (
                      <div
                        className={[
                          'pro-table__column-setting-item',
                          draggedColumnId === item.id ? 'is-dragging' : undefined,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        draggable
                        key={item.id}
                        onDragEnd={() => setDraggedColumnId(null)}
                        onDragOver={(event) => event.preventDefault()}
                        onDragStart={(event) => {
                          event.dataTransfer.effectAllowed = 'move'
                          event.dataTransfer.setData('text/plain', item.id)
                          setDraggedColumnId(item.id)
                        }}
                        onDrop={(event) => {
                          event.preventDefault()
                          const source = draggedColumnId ?? event.dataTransfer.getData('text/plain')
                          setDraggedColumnId(null)
                          if (source && source !== item.id) {
                            setColumnPreferences((current) =>
                              moveColumnPreference(current, source, item.id, columnIds),
                            )
                          }
                        }}
                      >
                        <span
                          aria-label={locale.columnVisibilityDragHandleLabel}
                          className="pro-table__column-drag-handle"
                          role="img"
                        >
                          <HolderOutlined />
                        </span>
                        <Checkbox
                          checked={visible}
                          disabled={visible && normalizedPreferences.visibleColumnIds.size <= 1}
                          onChange={(event) =>
                            setColumnPreferences((current) =>
                              updateColumnPreferenceVisibility(
                                current,
                                item.id,
                                event.target.checked,
                                columnIds,
                              ),
                            )
                          }
                        >
                          {item.label}
                        </Checkbox>
                        <div className="pro-table__column-pins">
                          <Tooltip
                            title={
                              fixedSide === 'left'
                                ? locale.unpinColumnLabel
                                : locale.pinColumnStartLabel
                            }
                          >
                            <Button
                              aria-label={
                                fixedSide === 'left'
                                  ? locale.unpinColumnLabel
                                  : locale.pinColumnStartLabel
                              }
                              {...(fixedSide === 'left' ? { className: 'is-active' } : {})}
                              icon={<VerticalAlignTopOutlined />}
                              size="small"
                              type="text"
                              onClick={() =>
                                setColumnPreferences((current) =>
                                  updateColumnPreferenceFixedSide(
                                    current,
                                    item.id,
                                    'left',
                                    columnIds,
                                  ),
                                )
                              }
                            />
                          </Tooltip>
                          <Tooltip
                            title={
                              fixedSide === 'right'
                                ? locale.unpinColumnLabel
                                : locale.pinColumnEndLabel
                            }
                          >
                            <Button
                              aria-label={
                                fixedSide === 'right'
                                  ? locale.unpinColumnLabel
                                  : locale.pinColumnEndLabel
                              }
                              {...(fixedSide === 'right' ? { className: 'is-active' } : {})}
                              icon={<VerticalAlignBottomOutlined />}
                              size="small"
                              type="text"
                              onClick={() =>
                                setColumnPreferences((current) =>
                                  updateColumnPreferenceFixedSide(
                                    current,
                                    item.id,
                                    'right',
                                    columnIds,
                                  ),
                                )
                              }
                            />
                          </Tooltip>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            trigger={['click']}
          >
            <Button
              aria-label={columnOptions?.triggerAriaLabel ?? locale.columnVisibilityAriaLabel}
              icon={<SettingOutlined />}
              type="text"
            />
          </Dropdown>
        </Tooltip>
      ) : null}
    </div>
  )

  return (
    <div className="pro-table">
      <Card
        {...cardProps}
        className={['pro-table__card', cardProps?.className].filter(Boolean).join(' ')}
        size={cardProps?.size ?? 'small'}
      >
        {toolbarVisible ? (
          <div className="pro-table__toolbar">
            <div className="pro-table__heading">
              {headerTitle ? <strong className="pro-table__title">{headerTitle}</strong> : null}
              {description ? <div className="pro-table__description">{description}</div> : null}
            </div>
            <div className="pro-table__toolbar-end">
              {toolbarActionList ? <ButtonList list={toolbarActionList} /> : toolbarActions}
              {tools}
            </div>
          </div>
        ) : null}
        {visibleSelection ? (
          <div className="pro-table__selection">
            <span>{locale.selectedRowsText(visibleSelection.selectedRowCount)}</span>
            {visibleSelection.scopeLabel ? <span>{visibleSelection.scopeLabel}</span> : null}
            <Typography.Link onClick={visibleSelection.onClear}>
              {locale.clearSelectionLabel}
            </Typography.Link>
          </div>
        ) : null}
        <Table<RecordType>
          {...tableProps}
          bordered={bordered}
          columns={visibleColumns}
          dataSource={dataSource}
          {...(emptyText !== undefined
            ? {
                locale: {
                  emptyText: <Empty description={emptyText} image={Empty.PRESENTED_IMAGE_SIMPLE} />,
                },
              }
            : {})}
          onRow={mergedOnRow}
          {...(pagination !== undefined ? { pagination } : {})}
          rowKey={stableRowKey}
          {...(mergedRowSelection ? { rowSelection: mergedRowSelection } : {})}
          size={densityEnabled ? tableDensity : (size ?? 'small')}
        />
      </Card>
    </div>
  )
}

export function normalizeStandardTableColumns<T extends object>(
  columns: ColumnsType<T>,
): ColumnsType<T> {
  return columns.map((column, index) => {
    if (isColumnGroup(column)) {
      return { ...column, children: normalizeStandardTableColumns(column.children) }
    }
    if (!isActionColumn(column, index)) return column
    const width = column.width
    return {
      ...column,
      fixed: column.fixed ?? 'right',
      width:
        width === undefined
          ? defaultActionColumnWidth
          : typeof width === 'number'
            ? Math.min(width, maxActionColumnWidth)
            : width,
    }
  })
}

export function createColumnVisibilityItems<T extends object>(
  columns: ColumnsType<T>,
): ColumnVisibilityItem[] {
  return columns.flatMap((column, index) => {
    const id = resolveColumnId(column, index)
    if (isColumnGroup(column)) {
      // oxlint-disable-next-line oxc/no-map-spread -- immutable IDs keep nested column preference keys explicit.
      return createColumnVisibilityItems(column.children).map((item) => ({
        ...item,
        id: `${id}.${item.id}`,
      }))
    }
    return [{ id, label: typeof column.title === 'function' ? `#${index + 1}` : column.title }]
  })
}

export function createDefaultColumnPreferences(
  allColumnIds: readonly string[],
): StandardTableColumnPreferences {
  return {
    fixedColumnIds: {},
    orderedColumnIds: [...allColumnIds],
    visibleColumnIds: new Set(allColumnIds),
  }
}

export function normalizeColumnPreferences(
  input: unknown,
  allColumnIds: readonly string[],
): StandardTableColumnPreferences {
  if (Array.isArray(input))
    return normalizeColumnPreferences({ visibleColumnIds: input }, allColumnIds)
  if (!isRecord(input)) return createDefaultColumnPreferences(allColumnIds)
  const allIds = new Set(allColumnIds)
  const ordered = normalizeStringList(input.orderedColumnIds).filter((id) => allIds.has(id))
  const orderedSet = new Set(ordered)
  const visible = normalizeStringList(input.visibleColumnIds).filter((id) => allIds.has(id))
  const fixed = Object.fromEntries(
    Object.entries(isRecord(input.fixedColumnIds) ? input.fixedColumnIds : {}).filter(
      (entry): entry is [string, StandardTableColumnFixedSide] =>
        allIds.has(entry[0]) && (entry[1] === 'left' || entry[1] === 'right'),
    ),
  )
  return {
    fixedColumnIds: fixed,
    orderedColumnIds: [...ordered, ...allColumnIds.filter((id) => !orderedSet.has(id))],
    visibleColumnIds: new Set(visible.length > 0 ? visible : allColumnIds),
  }
}

export function updateColumnPreferenceVisibility(
  current: StandardTableColumnPreferences,
  columnId: string,
  visible: boolean,
  allColumnIds: readonly string[],
): StandardTableColumnPreferences {
  const normalized = normalizeColumnPreferences(current, allColumnIds)
  const next = new Set(normalized.visibleColumnIds)
  if (visible) next.add(columnId)
  else if (next.size > 1) next.delete(columnId)
  return { ...normalized, visibleColumnIds: next }
}

export function updateAllColumnPreferenceVisibility(
  current: StandardTableColumnPreferences,
  visible: boolean,
  allColumnIds: readonly string[],
): StandardTableColumnPreferences {
  const normalized = normalizeColumnPreferences(current, allColumnIds)
  const first = allColumnIds[0]
  return {
    ...normalized,
    visibleColumnIds: new Set(visible ? allColumnIds : first ? [first] : []),
  }
}

export function moveColumnPreference(
  current: StandardTableColumnPreferences,
  sourceColumnId: string,
  targetColumnId: string,
  allColumnIds: readonly string[],
): StandardTableColumnPreferences {
  const normalized = normalizeColumnPreferences(current, allColumnIds)
  const order = [...normalized.orderedColumnIds]
  const sourceIndex = order.indexOf(sourceColumnId)
  const targetIndex = order.indexOf(targetColumnId)
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return normalized
  const [source] = order.splice(sourceIndex, 1)
  if (source) order.splice(targetIndex, 0, source)
  return { ...normalized, orderedColumnIds: order }
}

export function updateColumnPreferenceFixedSide(
  current: StandardTableColumnPreferences,
  columnId: string,
  side: StandardTableColumnFixedSide,
  allColumnIds: readonly string[],
): StandardTableColumnPreferences {
  const normalized = normalizeColumnPreferences(current, allColumnIds)
  if (!allColumnIds.includes(columnId)) return normalized
  const fixed = { ...normalized.fixedColumnIds }
  if (fixed[columnId] === side) {
    delete fixed[columnId]
    return { ...normalized, fixedColumnIds: fixed }
  }
  fixed[columnId] = side
  const rest = normalized.orderedColumnIds.filter((id) => id !== columnId)
  return {
    ...normalized,
    fixedColumnIds: fixed,
    orderedColumnIds: fixed[columnId] === 'left' ? [columnId, ...rest] : [...rest, columnId],
  }
}

export function resolveNextSelectedRowKeys(
  selectedRowKeys: readonly Key[],
  rowKey: Key,
  type: 'checkbox' | 'radio' = 'checkbox',
): Key[] {
  const selected = selectedRowKeys.includes(rowKey)
  if (type === 'radio') return selected ? [...selectedRowKeys] : [rowKey]
  return selected ? selectedRowKeys.filter((key) => key !== rowKey) : [...selectedRowKeys, rowKey]
}

function applyColumnPreferences<T extends object>(
  columns: ColumnsType<T>,
  preferences: StandardTableColumnPreferences,
  parentId?: string,
): ColumnsType<T> {
  const order = new Map(preferences.orderedColumnIds.map((id, index) => [id, index]))
  return columns
    .map((column, index) => {
      const ownId = resolveColumnId(column, index)
      const id = parentId ? `${parentId}.${ownId}` : ownId
      return { column, id, index, order: order.get(id) ?? order.size + index }
    })
    .sort((left, right) => left.order - right.order)
    .flatMap(({ column, id, index }) => {
      if (isColumnGroup(column)) {
        const children = applyColumnPreferences(column.children, preferences, id)
        return children.length > 0 ? [{ ...column, children }] : []
      }
      if (!preferences.visibleColumnIds.has(id)) return []
      const fixed = preferences.fixedColumnIds[id]
      if (!fixed || isActionColumn(column, index)) return [column]
      return [{ ...column, fixed }]
    })
}

function orderVisibilityItems(
  items: readonly ColumnVisibilityItem[],
  orderedIds: readonly string[],
): ColumnVisibilityItem[] {
  const byId = new Map(items.map((item) => [item.id, item]))
  const ordered = orderedIds.flatMap((id) => {
    const item = byId.get(id)
    return item ? [item] : []
  })
  const included = new Set(orderedIds)
  return [...ordered, ...items.filter((item) => !included.has(item.id))]
}

function resolveRecordKey<T extends object>(
  stableRowKey: ProTableProps<T>['stableRowKey'],
  record: T,
): Key {
  if (typeof stableRowKey === 'function') return stableRowKey(record)
  const value: unknown = Reflect.get(record, stableRowKey)
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint'
    ? value
    : String(value)
}

function resolveSelectedRows<T extends object>(
  data: readonly T[],
  stableRowKey: ProTableProps<T>['stableRowKey'],
  selectedKeys: readonly Key[],
): T[] {
  const rows = new Map(data.map((record) => [resolveRecordKey(stableRowKey, record), record]))
  return selectedKeys.flatMap((key) => {
    const row = rows.get(key)
    return row ? [row] : []
  })
}

function isRowSelectionClickIgnored(target: EventTarget | null): boolean {
  if (typeof Element === 'undefined' || !(target instanceof Element)) return false
  return Boolean(
    target.closest(
      [
        'a',
        'button',
        'input',
        'label',
        'select',
        'textarea',
        '[role="button"]',
        '[role="checkbox"]',
        '[role="radio"]',
        '[data-qing-row-click-stop="true"]',
      ].join(','),
    ),
  )
}

function readColumnPreferences(
  storageKey: string,
  allColumnIds: readonly string[],
): StandardTableColumnPreferences {
  if (typeof window === 'undefined') return createDefaultColumnPreferences(allColumnIds)
  try {
    const value = window.localStorage.getItem(storageKey)
    return normalizeColumnPreferences(value ? JSON.parse(value) : undefined, allColumnIds)
  } catch {
    return createDefaultColumnPreferences(allColumnIds)
  }
}

function writeColumnPreferences(storageKey: string, preferences: StandardTableColumnPreferences) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        fixedColumnIds: preferences.fixedColumnIds,
        orderedColumnIds: preferences.orderedColumnIds,
        visibleColumnIds: [...preferences.visibleColumnIds],
      }),
    )
  } catch {
    // Restricted browser modes can disable storage; rendering remains functional.
  }
}

function readDensity(storageKey: string, fallback: StandardTableDensity): StandardTableDensity {
  if (typeof window === 'undefined') return fallback
  try {
    const value = window.localStorage.getItem(storageKey)
    return isDensity(value) ? value : fallback
  } catch {
    return fallback
  }
}

function writeDensity(storageKey: string, density: StandardTableDensity) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(storageKey, density)
  } catch {
    // Restricted browser modes can disable storage; rendering remains functional.
  }
}

function isColumnGroup<T extends object>(
  column: ColumnGroupType<T> | ColumnType<T>,
): column is ColumnGroupType<T> {
  return 'children' in column && Array.isArray(column.children)
}

function resolveColumnId<T extends object>(
  column: ColumnGroupType<T> | ColumnType<T>,
  index: number,
): string {
  if (column.key !== undefined && column.key !== null) return String(column.key)
  if (!isColumnGroup(column) && column.dataIndex !== undefined) {
    if (Array.isArray(column.dataIndex)) {
      const path = column.dataIndex.filter(
        (segment): segment is string | number =>
          typeof segment === 'string' || typeof segment === 'number',
      )
      if (path.length === column.dataIndex.length) return path.map(String).join('.')
    }
    if (typeof column.dataIndex === 'string' || typeof column.dataIndex === 'number') {
      return String(column.dataIndex)
    }
  }
  return `#${index + 1}`
}

function isActionColumn<T extends object>(column: ColumnType<T>, index: number): boolean {
  return actionColumnIds.has(resolveColumnId(column, index).toLowerCase())
}

function normalizeStringList(input: unknown): readonly string[] {
  if (input instanceof Set)
    return [...input].filter((item): item is string => typeof item === 'string')
  if (Array.isArray(input)) return input.filter((item): item is string => typeof item === 'string')
  return []
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input)
}

function isDensity(value: unknown): value is StandardTableDensity {
  return value === 'large' || value === 'middle' || value === 'small'
}

function hashText(input: string): string {
  let hash = 0
  for (const char of input) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return hash.toString(36)
}
