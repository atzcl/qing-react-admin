import {
  BellOutlined,
  ClockCircleOutlined,
  ExpandOutlined,
  LockOutlined,
  LogoutOutlined,
  MoonOutlined,
  SearchOutlined,
  SettingOutlined,
  SunOutlined,
  TranslationOutlined,
} from '@ant-design/icons'
import type { Store } from '@tanstack/react-store'
import { Button, Dropdown, Tooltip } from 'antd'
import type { ReactNode } from 'react'

import { updatePreferences } from '~/core/app-store'
import {
  preferencesButtonPositionSchema,
  widgetKeySchema,
  widgetPositionSchema,
} from '~/core/preferences'
import type { AppPreferences, AppState, PreferencesButtonPosition, WidgetKey } from '~/core/types'

import { LanguageToggle } from './language-toggle'
import { NotificationPopup } from './notification-popup'

type WidgetPositionField =
  | 'widgetFullscreenPosition'
  | 'widgetGlobalSearchPosition'
  | 'widgetLanguagePosition'
  | 'widgetLockScreenPosition'
  | 'widgetLogoutPosition'
  | 'widgetNotificationPosition'
  | 'widgetThemePosition'
  | 'widgetTimezonePosition'

type WidgetEnabledField =
  | 'showFullscreen'
  | 'showGlobalSearch'
  | 'showLanguageToggle'
  | 'showLockScreen'
  | 'showNotification'
  | 'showThemeToggle'
  | 'showTimezone'

export interface HeaderWidgetContext {
  appStore: Store<AppState>
  onLock: () => void
  onLogout: () => void
  onNavigate: (path: string) => void
  onOpenPreferences: () => void
  onOpenSearch: () => void
  preferences: AppPreferences
  toggleFullscreen: () => Promise<void>
}

export interface HeaderWidgetDefinition {
  enabledField?: WidgetEnabledField
  icon: (context: HeaderWidgetContext) => ReactNode
  key: WidgetKey
  label: string
  positionField?: WidgetPositionField
  renderHeader: (context: HeaderWidgetContext) => ReactNode
  run?: (context: HeaderWidgetContext) => void
}

function iconButton(label: string, icon: ReactNode, onClick: () => void) {
  return (
    <Tooltip title={label}>
      <Button aria-label={label} icon={icon} onClick={onClick} type="text" />
    </Tooltip>
  )
}

function searchButton(onClick: () => void) {
  return (
    <Tooltip title="搜索">
      <Button
        aria-label="搜索"
        className="header-search-trigger"
        icon={<SearchOutlined />}
        onClick={onClick}
        type="text"
      >
        <span className="header-search-trigger__label">搜索</span>
        <kbd>⌘ K</kbd>
      </Button>
    </Tooltip>
  )
}

export const headerWidgetDefinitions: readonly HeaderWidgetDefinition[] = [
  {
    enabledField: 'showGlobalSearch',
    icon: () => <SearchOutlined />,
    key: 'globalSearch',
    label: '搜索',
    positionField: 'widgetGlobalSearchPosition',
    renderHeader: (context) => searchButton(context.onOpenSearch),
    run: (context) => context.onOpenSearch(),
  },
  {
    icon: () => <SettingOutlined />,
    key: 'preferences',
    label: '偏好设置',
    renderHeader: (context) =>
      iconButton('打开偏好设置', <SettingOutlined />, context.onOpenPreferences),
    run: (context) => context.onOpenPreferences(),
  },
  {
    enabledField: 'showThemeToggle',
    icon: (context) =>
      context.preferences.colorMode === 'dark' ? <SunOutlined /> : <MoonOutlined />,
    key: 'themeToggle',
    label: '主题切换',
    positionField: 'widgetThemePosition',
    renderHeader: (context) =>
      iconButton(
        '切换明暗主题',
        context.preferences.colorMode === 'dark' ? <SunOutlined /> : <MoonOutlined />,
        () =>
          updatePreferences(context.appStore, {
            colorMode: context.preferences.colorMode === 'dark' ? 'light' : 'dark',
          }),
      ),
    run: (context) =>
      updatePreferences(context.appStore, {
        colorMode: context.preferences.colorMode === 'dark' ? 'light' : 'dark',
      }),
  },
  {
    enabledField: 'showLanguageToggle',
    icon: () => <TranslationOutlined />,
    key: 'languageToggle',
    label: '语言切换',
    positionField: 'widgetLanguagePosition',
    renderHeader: () => <LanguageToggle />,
    run: (context) => {
      const locales = ['zh-CN', 'zh-TW', 'en-US'] as const
      const index = locales.indexOf(context.preferences.locale)
      updatePreferences(context.appStore, { locale: locales[(index + 1) % locales.length]! })
    },
  },
  {
    enabledField: 'showTimezone',
    icon: () => <ClockCircleOutlined />,
    key: 'timezone',
    label: '时区',
    positionField: 'widgetTimezonePosition',
    renderHeader: (context) => (
      <Dropdown
        menu={{
          items: [
            { key: 'Asia/Shanghai', label: 'Asia/Shanghai (UTC+8)' },
            { key: 'UTC', label: 'UTC' },
            { key: 'America/New_York', label: 'America/New_York' },
          ],
          onClick: ({ key }) => updatePreferences(context.appStore, { timezone: key }),
          selectedKeys: [context.preferences.timezone],
        }}
        placement="bottomRight"
      >
        <Button aria-label="设置时区" icon={<ClockCircleOutlined />} type="text" />
      </Dropdown>
    ),
    run: (context) =>
      updatePreferences(context.appStore, {
        timezone: context.preferences.timezone === 'Asia/Shanghai' ? 'UTC' : 'Asia/Shanghai',
      }),
  },
  {
    enabledField: 'showFullscreen',
    icon: () => <ExpandOutlined />,
    key: 'fullscreen',
    label: '全屏',
    positionField: 'widgetFullscreenPosition',
    renderHeader: (context) =>
      iconButton('切换全屏', <ExpandOutlined />, () => void context.toggleFullscreen()),
    run: (context) => void context.toggleFullscreen(),
  },
  {
    enabledField: 'showNotification',
    icon: () => <BellOutlined />,
    key: 'notification',
    label: '通知',
    positionField: 'widgetNotificationPosition',
    renderHeader: (context) => <NotificationPopup onNavigate={context.onNavigate} />,
  },
  {
    enabledField: 'showLockScreen',
    icon: () => <LockOutlined />,
    key: 'lockScreenBtn',
    label: '锁屏',
    positionField: 'widgetLockScreenPosition',
    renderHeader: (context) => iconButton('锁屏', <LockOutlined />, context.onLock),
    run: (context) => context.onLock(),
  },
  {
    icon: () => <LogoutOutlined />,
    key: 'logoutBtn',
    label: '退出登录',
    positionField: 'widgetLogoutPosition',
    renderHeader: (context) => iconButton('退出登录', <LogoutOutlined />, context.onLogout),
    run: (context) => context.onLogout(),
  },
]

export const headerWidgetByKey = new Map(
  headerWidgetDefinitions.map((definition) => [definition.key, definition]),
)

export function getHeaderWidget(key: string) {
  const result = widgetKeySchema.safeParse(key)
  return result.success ? headerWidgetByKey.get(result.data) : undefined
}

export function isWidgetEnabled(definition: HeaderWidgetDefinition, preferences: AppPreferences) {
  return definition.enabledField ? preferences[definition.enabledField] : true
}

export function getWidgetPreferencePosition(
  definition: HeaderWidgetDefinition,
  preferences: AppPreferences,
) {
  if (definition.key === 'preferences') return preferences.preferencesButtonPosition
  return definition.positionField ? preferences[definition.positionField] : 'none'
}

export function getWidgetRenderPosition(
  definition: HeaderWidgetDefinition,
  preferences: AppPreferences,
) {
  const position = getWidgetPreferencePosition(definition, preferences)
  return position === 'auto' ? 'header' : position
}

export function setWidgetPosition(
  store: Store<AppState>,
  definition: HeaderWidgetDefinition,
  position: string,
) {
  if (definition.key === 'preferences') {
    const result = preferencesButtonPositionSchema.safeParse(position)
    if (result.success) updatePreferences(store, { preferencesButtonPosition: result.data })
    return
  }

  const result = widgetPositionSchema.safeParse(position)
  if (result.success && definition.positionField) {
    updatePreferences(store, { [definition.positionField]: result.data })
  }
}

export function preferencePositionOptions(definition: HeaderWidgetDefinition) {
  const common: Array<{ label: string; value: 'header' | 'none' | 'user-dropdown' }> = [
    { label: '顶栏', value: 'header' },
    { label: '用户下拉菜单', value: 'user-dropdown' },
    { label: '不显示', value: 'none' },
  ]
  if (definition.key !== 'preferences') return common
  return [
    { label: '自动', value: 'auto' },
    { label: '固定', value: 'fixed' },
    ...common,
  ] satisfies Array<{ label: string; value: PreferencesButtonPosition }>
}
