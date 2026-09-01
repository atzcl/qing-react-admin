import { describe, expect, it } from 'vitest'

import { constrainTabs, reduceTabCommand } from './tab-model'
import type { AppTab } from './types'

const tabs: AppTab[] = [
  {
    affix: true,
    definitionPath: '/dashboard/analytics',
    href: '/dashboard/analytics',
    params: {},
    path: '/dashboard/analytics',
    titleKey: 'menu.analytics',
  },
  {
    definitionPath: '/examples/form/basic',
    href: '/examples/form/basic?qf=basic',
    params: {},
    path: '/examples/form/basic',
    titleKey: 'menu.examples',
  },
  {
    definitionPath: '/examples/modal',
    href: '/examples/modal',
    params: {},
    path: '/examples/modal',
    titleKey: 'menu.examples',
  },
  {
    definitionPath: '/system/user',
    href: '/system/user?status=1',
    params: {},
    path: '/system/user',
    titleKey: 'menu.users',
  },
]

describe('tab command model', () => {
  it('bounds retained pages while preserving pinned tabs and the newest working set', () => {
    const result = constrainTabs(tabs, 3)

    expect(result.map((tab) => tab.path)).toEqual([
      '/dashboard/analytics',
      '/examples/modal',
      '/system/user',
    ])
    expect(constrainTabs(tabs, 0)).toBe(tabs)
  })

  it('navigates to an inactive target when close-others removes the current route', () => {
    const result = reduceTabCommand(tabs, '/examples/form/basic', {
      path: '/system/user',
      type: 'close-others',
    })

    expect(result.tabs.map((tab) => tab.path)).toEqual(['/dashboard/analytics', '/system/user'])
    expect(result.nextHref).toBe('/system/user?status=1')
  })

  it('keeps the URL when a bulk action does not remove the current route', () => {
    const result = reduceTabCommand(tabs, '/examples/modal', {
      path: '/examples/modal',
      type: 'close-left',
    })

    expect(result.tabs.map((tab) => tab.path)).toEqual([
      '/dashboard/analytics',
      '/examples/modal',
      '/system/user',
    ])
    expect(result.nextHref).toBeUndefined()
  })

  it('refreshes through the same typed command interface', () => {
    const result = reduceTabCommand(tabs, '/examples/modal', {
      path: '/examples/modal',
      type: 'refresh',
    })

    expect(result.tabs.find((tab) => tab.path === '/examples/modal')?.revision).toBe(1)
  })

  it('toggles pinning without changing navigation', () => {
    const result = reduceTabCommand(tabs, '/examples/modal', {
      path: '/examples/modal',
      type: 'toggle-affix',
    })

    expect(result.tabs.find((tab) => tab.path === '/examples/modal')?.affix).toBe(true)
    expect(result.nextHref).toBeUndefined()
  })

  it('refuses to close an affixed tab or an unknown tab', () => {
    expect(
      reduceTabCommand(tabs, '/dashboard/analytics', {
        path: '/dashboard/analytics',
        type: 'close',
      }).tabs,
    ).toBe(tabs)
    expect(
      reduceTabCommand(tabs, '/examples/modal', { path: '/missing', type: 'close' }).tabs,
    ).toBe(tabs)
  })

  it('moves to the adjacent tab when closing the current tab', () => {
    const result = reduceTabCommand(tabs, '/examples/modal', {
      path: '/examples/modal',
      type: 'close',
    })

    expect(result.nextHref).toBe('/examples/form/basic?qf=basic')
    expect(result.tabs.some((tab) => tab.path === '/examples/modal')).toBe(false)
  })

  it('does not navigate when closing a background tab', () => {
    const result = reduceTabCommand(tabs, '/system/user', {
      path: '/examples/form/basic',
      type: 'close',
    })

    expect(result.nextHref).toBeUndefined()
    expect(result.tabs.some((tab) => tab.path === '/system/user')).toBe(true)
  })

  it('keeps affixed tabs and selects home when closing all tabs', () => {
    const result = reduceTabCommand(tabs, '/system/user', { type: 'close-all' })

    expect(result.tabs.map((tab) => tab.path)).toEqual(['/dashboard/analytics'])
    expect(result.nextHref).toBe('/dashboard/analytics')
  })

  it('handles right-side bulk removal and an empty tab set', () => {
    const right = reduceTabCommand(tabs, '/system/user', {
      path: '/examples/form/basic',
      type: 'close-right',
    })
    expect(right.tabs.map((tab) => tab.path)).toEqual([
      '/dashboard/analytics',
      '/examples/form/basic',
    ])
    expect(right.nextHref).toBe('/examples/form/basic?qf=basic')

    const empty = reduceTabCommand([], '/missing', { type: 'close-all' })
    expect(empty).toEqual({ nextHref: '/dashboard/analytics', tabs: [] })
  })
})
