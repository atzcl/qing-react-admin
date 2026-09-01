import { Store } from '@tanstack/react-store'
import { describe, expect, it } from 'vitest'

import {
  closeOtherTabs,
  closeTab,
  defaultPreferences,
  refreshTab,
  updatePreferences,
  visitTab,
} from './app-store'
import type { AppState } from './types'

function testStore() {
  return new Store<AppState>({
    menuBadges: {},
    preferences: defaultPreferences,
    tabs: [
      {
        affix: true,
        definitionPath: '/dashboard/analytics',
        params: {},
        path: '/dashboard/analytics',
        revision: 0,
        titleKey: 'menu.analytics',
      },
    ],
  })
}

describe('app store operations', () => {
  it('visits, refreshes, and closes retained pages', () => {
    const store = testStore()
    visitTab(store, '/demos/features/tabs', '/demos/features/tabs', {}, 'menu.demos')
    visitTab(store, '/examples/form/basic', '/examples/form/basic', {}, 'menu.examples')
    visitTab(store, '/examples/form/basic', '/examples/form/basic', {}, 'menu.examples')
    expect(store.state.tabs).toHaveLength(3)

    refreshTab(store, '/demos/features/tabs')
    expect(store.state.tabs.find((tab) => tab.path === '/demos/features/tabs')?.revision).toBe(1)

    closeOtherTabs(store, '/demos/features/tabs')
    expect(store.state.tabs.map((tab) => tab.path)).toEqual([
      '/dashboard/analytics',
      '/demos/features/tabs',
    ])

    closeTab(store, '/dashboard/analytics')
    expect(store.state.tabs[0]?.affix).toBe(true)
  })

  it('repairs stale route metadata for an existing tab path', () => {
    const store = testStore()
    visitTab(store, '/examples/tiptap', '/dashboard/workspace', {}, 'menu.workspace')
    visitTab(store, '/examples/tiptap', '/examples/tiptap', { section: 'editor' }, 'menu.examples')

    expect(store.state.tabs.find((tab) => tab.path === '/examples/tiptap')).toMatchObject({
      definitionPath: '/examples/tiptap',
      params: { section: 'editor' },
      titleKey: 'menu.examples',
    })
  })

  it('updates only the requested preference', () => {
    const store = testStore()
    updatePreferences(store, { colorMode: 'dark' })
    expect(store.state.preferences.colorMode).toBe('dark')
    expect(store.state.preferences.locale).toBe('zh-CN')
  })
})
