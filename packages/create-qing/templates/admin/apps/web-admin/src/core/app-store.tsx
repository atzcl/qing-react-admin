import { Store, createStoreContext, useSelector } from '@tanstack/react-store'
import { useEffect, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { z } from 'zod'

import { readPersisted, removePersisted, writePersisted } from './persisted-storage'
import { defaultPreferences, parsePreferences } from './preferences'
import { constrainTabs, executeTabCommand } from './tab-model'
import type { AppPreferences, AppState, AppTab, MenuBadgeConfig, TranslationKey } from './types'

const STORAGE_KEY = 'qing-react-admin:preferences:v2'
const TABS_STORAGE_KEY = 'qing-react-admin:tabs:v2'

export { defaultPreferences } from './preferences'

const tabsSchema = z.array(
  z.object({
    affix: z.boolean().optional(),
    definitionPath: z.string().startsWith('/').optional(),
    params: z.record(z.string(), z.string()).optional(),
    path: z.string().startsWith('/'),
    revision: z.number().int().nonnegative().optional(),
    title: z.string().min(1).optional(),
    titleKey: z.custom<TranslationKey>((value) => typeof value === 'string'),
  }),
)

const storedPreferencesSchema = z.record(z.string(), z.unknown())

const homeTab: AppTab = {
  affix: true,
  definitionPath: '/dashboard/analytics',
  params: {},
  path: '/dashboard/analytics',
  revision: 0,
  titleKey: 'menu.analytics',
}

function restoreTabs(preferences: AppPreferences) {
  if (!preferences.tabPersist) return [homeTab]
  const storedTabs = readPersisted(window.localStorage, TABS_STORAGE_KEY, tabsSchema, [])
  const tabs: AppTab[] = []
  for (const tab of storedTabs) {
    if (tabs.some((item) => item.path === tab.path)) continue
    tabs.push({
      ...(tab.affix === undefined ? {} : { affix: tab.affix }),
      definitionPath: tab.definitionPath ?? tab.path,
      params: tab.params ?? {},
      path: tab.path,
      ...(tab.revision === undefined ? {} : { revision: tab.revision }),
      ...(tab.title === undefined ? {} : { title: tab.title }),
      titleKey: tab.titleKey,
    })
  }
  const withHome = tabs.some((tab) => tab.path === homeTab.path) ? tabs : [homeTab, ...tabs]
  return constrainTabs(withHome, preferences.tabMaxCount)
}

function createAppStore() {
  const preferences = parsePreferences(
    readPersisted(window.localStorage, STORAGE_KEY, storedPreferencesSchema, {}),
  )
  return new Store<AppState>({
    menuBadges: {},
    preferences,
    tabs: restoreTabs(preferences),
  })
}

export function updateMenuBadge(store: Store<AppState>, path: string, badge: MenuBadgeConfig) {
  store.setState((state) => ({
    ...state,
    menuBadges: { ...state.menuBadges, [path]: badge },
  }))
}

const { StoreProvider, useStoreContext } = createStoreContext<{ appStore: Store<AppState> }>()

export function AppStoreProvider({ children }: PropsWithChildren) {
  const [appStore] = useState(createAppStore)

  useEffect(() => {
    const subscription = appStore.subscribe((state) => {
      writePersisted(window.localStorage, STORAGE_KEY, state.preferences)
      if (state.preferences.tabPersist) {
        writePersisted(window.localStorage, TABS_STORAGE_KEY, state.tabs)
      } else {
        removePersisted(window.localStorage, TABS_STORAGE_KEY)
      }
    })
    return () => subscription.unsubscribe()
  }, [appStore])

  return <StoreProvider value={{ appStore }}>{children}</StoreProvider>
}

export function useAppStore() {
  return useStoreContext().appStore
}

export function useAppSelector<T>(selector: (state: AppState) => T) {
  return useSelector(useAppStore(), selector)
}

export function updatePreferences(
  store: Store<AppState>,
  update: Partial<AppPreferences> | ((preferences: AppPreferences) => AppPreferences),
) {
  store.setState((state) => ({
    ...state,
    preferences:
      typeof update === 'function'
        ? update(state.preferences)
        : { ...state.preferences, ...update },
  }))
}

export function resetPreferences(store: Store<AppState>) {
  store.setState((state) => ({ ...state, preferences: defaultPreferences }))
}

export function visitTab(
  store: Store<AppState>,
  path: string,
  definitionPath: string,
  params: Record<string, string>,
  titleKey: TranslationKey,
) {
  store.setState((state) => {
    const existingTab = state.tabs.find((tab) => tab.path === path)
    if (existingTab) {
      const existingParamKeys = Object.keys(existingTab.params)
      const paramsMatch =
        existingParamKeys.length === Object.keys(params).length &&
        existingParamKeys.every((key) => existingTab.params[key] === params[key])
      if (
        existingTab.definitionPath === definitionPath &&
        existingTab.titleKey === titleKey &&
        paramsMatch
      ) {
        return state
      }
      return {
        ...state,
        tabs: state.tabs.map((tab) =>
          tab.path === path ? { ...tab, definitionPath, params, titleKey } : tab,
        ),
      }
    }
    return {
      ...state,
      tabs: constrainTabs(
        [...state.tabs, { definitionPath, params, path, revision: 0, titleKey }],
        state.preferences.tabMaxCount,
      ),
    }
  })
}

export function closeTab(store: Store<AppState>, path: string) {
  executeTabCommand(store, path, { path, type: 'close' })
}

export function closeOtherTabs(store: Store<AppState>, path: string) {
  executeTabCommand(store, path, { path, type: 'close-others' })
}

export function closeTabsToLeft(store: Store<AppState>, path: string) {
  executeTabCommand(store, path, { path, type: 'close-left' })
}

export function closeTabsToRight(store: Store<AppState>, path: string) {
  executeTabCommand(store, path, { path, type: 'close-right' })
}

export function closeAllTabs(store: Store<AppState>) {
  executeTabCommand(store, '/dashboard/analytics', { type: 'close-all' })
}

export function reorderTabs(store: Store<AppState>, sourcePath: string, targetPath: string) {
  if (sourcePath === targetPath) return
  store.setState((state) => {
    const sourceIndex = state.tabs.findIndex((tab) => tab.path === sourcePath)
    const targetIndex = state.tabs.findIndex((tab) => tab.path === targetPath)
    if (sourceIndex < 0 || targetIndex < 0) return state
    const tabs = [...state.tabs]
    const [source] = tabs.splice(sourceIndex, 1)
    if (!source) return state
    tabs.splice(targetIndex, 0, source)
    return { ...state, tabs }
  })
}

export function toggleTabAffix(store: Store<AppState>, path: string) {
  executeTabCommand(store, path, { path, type: 'toggle-affix' })
}

export function refreshTab(store: Store<AppState>, path: string) {
  executeTabCommand(store, path, { path, type: 'refresh' })
}

export function setTabTitle(store: Store<AppState>, path: string, title: string) {
  store.setState((state) => ({
    ...state,
    tabs: state.tabs.map((tab) => (tab.path === path ? { ...tab, title } : tab)),
  }))
}

export function resetTabTitle(store: Store<AppState>, path: string) {
  store.setState((state) => ({
    ...state,
    tabs: state.tabs.map((tab) => {
      if (tab.path !== path || tab.title === undefined) return tab
      const { title: _title, ...rest } = tab
      return rest
    }),
  }))
}
