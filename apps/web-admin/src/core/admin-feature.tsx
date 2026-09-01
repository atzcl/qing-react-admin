import { AppstoreOutlined } from '@ant-design/icons'
import { lazy } from 'react'
import type { ComponentType } from 'react'

import type { LocalizedPageLabel, TranslationKey, UserRole } from './types'

export type AdminNavigationGroupKey = 'dashboard' | 'demos' | 'examples' | 'system'
export type AdminFeatureGroupKey = AdminNavigationGroupKey | 'utility'

export interface AdminPageDefinition {
  activePath?: string
  activeIcon?: ComponentType
  affix?: boolean
  badge?: string
  badgeType?: 'dot' | 'normal'
  badgeVariant?: string
  description?: LocalizedPageLabel
  descriptionKey?: TranslationKey
  forbidden?: boolean
  externalUrl?: string
  hideInMenu?: boolean
  icon?: ComponentType
  label?: LocalizedPageLabel
  menuVisibleWithForbidden?: boolean
  menuHref?: string
  openInNewWindow?: boolean
  page: ComponentType
  path: string
  roles?: UserRole[]
  titleKey: TranslationKey
}

export interface AdminFeatureDefinition extends AdminPageDefinition {
  group: AdminFeatureGroupKey
  order: number
}

export interface DefineAdminFeatureOptions extends Omit<AdminPageDefinition, 'page' | 'titleKey'> {
  group: AdminFeatureGroupKey
  loadPage: () => Promise<{ default: ComponentType }>
  order?: number
  titleKey?: TranslationKey
}

const groupTitleKeys = {
  dashboard: 'menu.dashboard',
  demos: 'menu.demos',
  examples: 'menu.examples',
  system: 'menu.system',
} as const satisfies Record<AdminNavigationGroupKey, TranslationKey>

/**
 * Defines one self-contained admin feature. The manifest stays lightweight while
 * the page module remains split into its own lazy-loaded browser chunk.
 */
export function defineAdminFeature({
  group,
  icon = AppstoreOutlined,
  loadPage,
  order = 0,
  titleKey,
  ...page
}: DefineAdminFeatureOptions): AdminFeatureDefinition {
  'use no memo'

  const resolvedTitleKey = titleKey ?? (group === 'utility' ? undefined : groupTitleKeys[group])
  if (!resolvedTitleKey) {
    throw new Error(`Utility feature ${page.path} must provide a titleKey`)
  }

  return {
    ...page,
    group,
    icon,
    order,
    page: lazy(loadPage),
    titleKey: resolvedTitleKey,
  }
}
