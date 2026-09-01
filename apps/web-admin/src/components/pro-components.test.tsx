import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Button, Input, Select } from 'antd'
import { describe, expect, it, vi } from 'vitest'

import {
  ProTable,
  createDefaultColumnPreferences,
  moveColumnPreference,
  normalizeStandardTableColumns,
  updateColumnPreferenceFixedSide,
  updateColumnPreferenceVisibility,
} from './pro-table'
import { QueryForm, createQueryFormDefaultValues } from './query-form'

interface QueryValues {
  department?: string
  keyword?: string
  owner?: string
  status?: string
}

interface Row {
  age: number
  id: string
  name: string
}

describe('shared pro components', () => {
  it('submits, resets, and expands a schema-driven query form', async () => {
    const onQuery = vi.fn()
    const onReset = vi.fn()
    render(
      <QueryForm<QueryValues>
        items={[
          { field: 'keyword', label: '关键词', render: () => <Input /> },
          {
            field: 'status',
            label: '状态',
            render: () => <Select options={[{ label: '启用', value: 'enabled' }]} />,
          },
          { field: 'department', label: '部门', render: () => <Input /> },
          { field: 'owner', label: '负责人', render: () => <Input /> },
        ]}
        onQuery={onQuery}
        onReset={onReset}
      />,
    )

    expect(screen.queryByLabelText('负责人')).toBeNull()
    fireEvent.change(screen.getByLabelText('关键词'), { target: { value: 'Qing' } })
    fireEvent.click(screen.getByRole('button', { name: 'Search' }))
    await waitFor(() =>
      expect(onQuery).toHaveBeenCalledWith(expect.objectContaining({ keyword: 'Qing' })),
    )

    fireEvent.click(screen.getByRole('button', { name: 'Expand' }))
    expect(screen.getByLabelText('负责人')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    await waitFor(() => expect(onReset).toHaveBeenCalledOnce())
  })

  it('composes query, toolbar, reload, selection, and table content', async () => {
    const onReload = vi.fn()
    render(
      <>
        <div>组合查询区</div>
        <ProTable<Row>
          columns={[
            { dataIndex: 'name', title: '姓名' },
            { dataIndex: 'age', title: '年龄' },
          ]}
          dataSource={[
            { age: 28, id: '1', name: 'Ada' },
            { age: 36, id: '2', name: 'Linus' },
          ]}
          headerTitle="成员列表"
          onRefresh={onReload}
          stableRowKey="id"
          rowSelection={{}}
          toolbarActions={<Button>新建成员</Button>}
        />
      </>,
    )

    expect(screen.getByText('成员列表')).toBeTruthy()
    expect(screen.getByText('组合查询区')).toBeTruthy()
    expect(screen.getByRole('button', { name: '新建成员' })).toBeTruthy()
    expect(screen.getByText('Ada')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Refresh table' }))
    await waitFor(() => expect(onReload).toHaveBeenCalledOnce())

    const rowCheckboxes = screen.getAllByRole('checkbox')
    fireEvent.click(rowCheckboxes[1]!)
    expect(screen.getByText('1 selected')).toBeTruthy()
  })

  it('creates nested reset values from query items', () => {
    expect(
      createQueryFormDefaultValues<{ filters?: { owner?: string }; keyword?: string }>([
        { field: 'keyword', initialValue: 'Qing', label: 'Keyword', render: () => null },
        {
          initialValue: 'Ada',
          label: 'Owner',
          name: ['filters', 'owner'],
          render: () => null,
        },
        { render: () => null, standalone: true },
      ]),
    ).toEqual({ filters: { owner: 'Ada' }, keyword: 'Qing' })
  })

  it('normalizes action columns and preserves safe column preferences', () => {
    const columns = normalizeStandardTableColumns<Row>([
      { dataIndex: 'name', title: 'Name' },
      { key: 'operation', title: 'Actions', width: 300 },
    ])
    expect(columns[1]).toMatchObject({ fixed: 'right', width: 220 })

    const ids = ['name', 'age', 'operation']
    let preferences = createDefaultColumnPreferences(ids)
    preferences = updateColumnPreferenceVisibility(preferences, 'name', false, ids)
    preferences = updateColumnPreferenceVisibility(preferences, 'age', false, ids)
    preferences = updateColumnPreferenceVisibility(preferences, 'operation', false, ids)
    expect([...preferences.visibleColumnIds]).toEqual(['operation'])

    preferences = moveColumnPreference(preferences, 'operation', 'name', ids)
    expect(preferences.orderedColumnIds[0]).toBe('operation')
    preferences = updateColumnPreferenceFixedSide(preferences, 'age', 'left', ids)
    expect(preferences.fixedColumnIds).toEqual({ age: 'left' })
  })
})
