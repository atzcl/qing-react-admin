import type { AppPreferences } from './preferences'

export type AppLocale = 'en-US' | 'zh-CN' | 'zh-TW'
export type LocalizedPageLabel = Record<AppLocale, string>
export type ColorMode = 'dark' | 'light' | 'system'
export type AuthPageLayout = 'panel-center' | 'panel-left' | 'panel-right'
export type AccessMode = 'backend' | 'frontend'
export type ContentCompactMode = 'compact' | 'wide'
export type NavigationMode =
  | 'full-content'
  | 'header-mixed-nav'
  | 'header-nav'
  | 'header-sidebar-nav'
  | 'mixed-nav'
  | 'sidebar-mixed-nav'
  | 'sidebar-nav'
export type NavigationStyle = 'plain' | 'rounded'
export type TabStyle = 'brisk' | 'card' | 'chrome' | 'plain'
export type HeaderMode = 'auto' | 'auto-scroll' | 'fixed' | 'static'
export type HeaderMenuAlign = 'center' | 'end' | 'start'
export type BreadcrumbStyle = 'background' | 'normal'
export type WidgetPosition = 'header' | 'none' | 'user-dropdown'
export type PreferencesButtonPosition = 'auto' | 'fixed' | 'header' | 'none' | 'user-dropdown'
export type UserRole = 'admin' | 'super' | 'user'

export type { AppPreferences, WidgetKey } from './preferences'

export interface AppUser {
  avatar: string
  email: string
  homePath: string
  id: string
  realName: string
  roles: UserRole[]
  username: string
}

export interface AppTab {
  affix?: boolean
  definitionPath: string
  /** 当前标签最后一次访问的完整地址，包含查询参数与 hash。 */
  href: string
  params: Record<string, string>
  path: string
  revision?: number
  title?: string
  titleKey: TranslationKey
}

export interface MenuBadgeConfig {
  badge?: string
  badgeType?: 'dot' | 'normal'
  badgeVariant?: string
}

export interface AppState {
  menuBadges: Record<string, MenuBadgeConfig>
  preferences: AppPreferences
  tabs: AppTab[]
}

export type TranslationKey = keyof typeof import('./i18n').zhCN
