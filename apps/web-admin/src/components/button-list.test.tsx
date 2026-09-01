import { fireEvent, render, screen } from '@testing-library/react'
import { App } from 'antd'
import { describe, expect, it, vi } from 'vitest'

import { ButtonList, filterButtonListItemsByPermission, splitButtonListItems } from './button-list'

describe('ButtonList', () => {
  it('splits visible and overflow items at the configured limit', () => {
    expect(splitButtonListItems(['a', 'b', 'c'], 2)).toEqual({
      overflow: ['c'],
      visible: ['a', 'b'],
    })
  })

  it('hides denied items when permission behavior is hidden', () => {
    const result = filterButtonListItemsByPermission(
      [
        { key: 'read', label: '查看', permission: 'read' },
        { key: 'write', label: '编辑', permission: 'write' },
      ],
      new Set(['read']),
      'hidden',
    )
    expect(result.map((item) => item.key)).toEqual(['read'])
  })

  it('renders a consistent action group and invokes its handlers', () => {
    const onCreate = vi.fn()
    render(
      <App>
        <ButtonList
          list={[
            { key: 'create', label: '创建', onClick: onCreate, type: 'primary' },
            { disabled: true, key: 'delete', label: '删除' },
          ]}
        />
      </App>,
    )

    fireEvent.click(screen.getByRole('button', { name: /创\s*建/ }))
    expect(onCreate).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: /删\s*除/ }).hasAttribute('disabled')).toBe(true)
  })
})
