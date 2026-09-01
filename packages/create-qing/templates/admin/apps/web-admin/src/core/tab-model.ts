import type { Store } from '@tanstack/react-store'

import type { AppState, AppTab } from './types'

export const HOME_TAB_PATH = '/dashboard/analytics'

export type TabCommand =
  | { path: string; type: 'close' }
  | { path: string; type: 'close-left' }
  | { path: string; type: 'close-others' }
  | { path: string; type: 'close-right' }
  | { type: 'close-all' }
  | { path: string; type: 'refresh' }
  | { path: string; type: 'toggle-affix' }

export interface TabCommandResult {
  nextHref?: string
  tabs: AppTab[]
}

/**
 * Keep retained React trees bounded while preserving every explicitly pinned tab.
 * The newest ordinary tabs win, which mirrors the way people use a working set.
 */
export function constrainTabs(tabs: AppTab[], maxCount: number) {
  if (maxCount <= 0 || tabs.length <= maxCount) return tabs

  const affixedPaths = new Set(tabs.filter((tab) => tab.affix).map((tab) => tab.path))
  const ordinarySlots = Math.max(1, maxCount - affixedPaths.size)
  const recentOrdinaryPaths = new Set(
    tabs
      .filter((tab) => !tab.affix)
      .slice(-ordinarySlots)
      .map((tab) => tab.path),
  )
  return tabs.filter((tab) => affixedPaths.has(tab.path) || recentOrdinaryPaths.has(tab.path))
}

function nextHrefWhenCurrentWasRemoved(
  currentPath: string,
  tabs: AppTab[],
  preferredPath?: string,
) {
  if (tabs.some((tab) => tab.path === currentPath)) return undefined
  if (preferredPath) {
    const preferredTab = tabs.find((tab) => tab.path === preferredPath)
    if (preferredTab) return preferredTab.href
  }
  return tabs.find((tab) => tab.path === HOME_TAB_PATH)?.href ?? tabs[0]?.href ?? HOME_TAB_PATH
}

export function reduceTabCommand(
  tabs: AppTab[],
  currentPath: string,
  command: TabCommand,
): TabCommandResult {
  if (command.type === 'refresh') {
    return {
      tabs: tabs.map((tab) =>
        tab.path === command.path ? { ...tab, revision: (tab.revision ?? 0) + 1 } : tab,
      ),
    }
  }

  if (command.type === 'toggle-affix') {
    return {
      tabs: tabs.map((tab) => (tab.path === command.path ? { ...tab, affix: !tab.affix } : tab)),
    }
  }

  if (command.type === 'close-all') {
    const nextTabs = tabs.filter((tab) => tab.affix)
    const nextHref = nextHrefWhenCurrentWasRemoved(currentPath, nextTabs)
    return {
      ...(nextHref ? { nextHref } : {}),
      tabs: nextTabs,
    }
  }

  const targetIndex = tabs.findIndex((tab) => tab.path === command.path)
  if (targetIndex < 0) return { tabs }

  if (command.type === 'close') {
    if (tabs[targetIndex]?.affix) return { tabs }
    const fallback = tabs[targetIndex - 1]?.path ?? tabs[targetIndex + 1]?.path ?? HOME_TAB_PATH
    const nextTabs = tabs.filter((tab) => tab.affix || tab.path !== command.path)
    const nextHref = nextHrefWhenCurrentWasRemoved(currentPath, nextTabs, fallback)
    return {
      ...(nextHref ? { nextHref } : {}),
      tabs: nextTabs,
    }
  }

  const nextTabs = tabs.filter((tab, index) => {
    if (tab.affix) return true
    if (command.type === 'close-left') return index >= targetIndex
    if (command.type === 'close-right') return index <= targetIndex
    return tab.path === command.path
  })
  const nextHref = nextHrefWhenCurrentWasRemoved(currentPath, nextTabs, command.path)
  return { ...(nextHref ? { nextHref } : {}), tabs: nextTabs }
}

export function executeTabCommand(
  store: Store<AppState>,
  currentPath: string,
  command: TabCommand,
) {
  const result = reduceTabCommand(store.state.tabs, currentPath, command)
  if (result.tabs !== store.state.tabs) {
    store.setState((state) => ({ ...state, tabs: result.tabs }))
  }
  return result
}
