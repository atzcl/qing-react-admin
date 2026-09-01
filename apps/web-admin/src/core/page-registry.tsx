import {
  AppstoreOutlined,
  DatabaseOutlined,
  ExperimentOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { lazy } from 'react'
import type { ComponentType } from 'react'

import type {
  AdminFeatureDefinition,
  AdminNavigationGroupKey,
  AdminPageDefinition,
} from './admin-feature'
import {
  showcaseDemoMenu,
  showcaseDemoPages,
  showcaseExampleMenu,
  showcaseExamplePages,
} from './showcase-catalog'
import type { AppLocale, LocalizedPageLabel, TranslationKey, UserRole } from './types'

export type { AdminPageDefinition } from './admin-feature'

export interface NavigationFolder {
  activeIcon?: ComponentType
  badge?: string
  badgeType?: 'dot' | 'normal'
  badgeVariant?: string
  children: NavigationNode[]
  icon?: ComponentType
  key: string
  label: LocalizedPageLabel
}

export type NavigationNode = AdminPageDefinition | NavigationFolder

export interface NavigationGroup {
  badge?: string
  badgeType?: 'dot' | 'normal'
  badgeVariant?: string
  direct?: boolean
  icon: ComponentType
  key: string
  menu?: NavigationNode[]
  pages?: AdminPageDefinition[]
  titleKey: TranslationKey
}

const forbiddenPage = lazy(() =>
  import('../pages/fallback-pages').then((module) => ({ default: module.ForbiddenPage })),
)
const internalErrorPage = lazy(() =>
  import('../pages/fallback-pages').then((module) => ({ default: module.InternalErrorPage })),
)
const comingSoonPage = lazy(() =>
  import('../pages/fallback-pages').then((module) => ({ default: module.ComingSoonPage })),
)
const offlinePage = lazy(() =>
  import('../pages/fallback-pages').then((module) => ({ default: module.OfflinePage })),
)

interface AdminFeatureModule {
  default: AdminFeatureDefinition
}

const featureModules = import.meta.glob<AdminFeatureModule>('../features/**/feature.ts', {
  eager: true,
})

/** Feature manifests are the only registration seam for application pages. */
export const featurePages = Object.entries(featureModules)
  .map(([modulePath, module]) => {
    if (!module.default) throw new Error(`Admin feature ${modulePath} has no default definition`)
    return module.default
  })
  .sort((left, right) => left.order - right.order || left.path.localeCompare(right.path))

const featurePaths = new Set<string>()
for (const feature of featurePages) {
  if (featurePaths.has(feature.path)) {
    throw new Error(`Duplicate admin feature path: ${feature.path}`)
  }
  featurePaths.add(feature.path)
}

function featurePagesFor(group: AdminNavigationGroupKey) {
  return featurePages.filter((page) => page.group === group)
}

export const dashboardPages: AdminPageDefinition[] = featurePagesFor('dashboard')
export const systemPages: AdminPageDefinition[] = featurePagesFor('system')

export const demoPages: AdminPageDefinition[] = showcaseDemoPages
export const examplePages: AdminPageDefinition[] = showcaseExamplePages

export const utilityPages: AdminPageDefinition[] = [
  ...featurePages.filter((page) => page.group === 'utility'),
  {
    icon: SafetyCertificateOutlined,
    page: forbiddenPage,
    path: '/fallback/403',
    titleKey: 'menu.roles',
  },
  {
    icon: ExperimentOutlined,
    page: internalErrorPage,
    path: '/fallback/500',
    titleKey: 'menu.demos',
  },
  {
    icon: ExperimentOutlined,
    page: comingSoonPage,
    path: '/fallback/coming-soon',
    titleKey: 'menu.demos',
  },
  {
    icon: ExperimentOutlined,
    page: offlinePage,
    path: '/fallback/offline',
    titleKey: 'menu.demos',
  },
]

export const navigationGroups: NavigationGroup[] = [
  {
    icon: AppstoreOutlined,
    key: 'dashboard',
    pages: dashboardPages,
    titleKey: 'menu.dashboard',
  },
  {
    icon: ExperimentOutlined,
    key: 'demos',
    menu: showcaseDemoMenu,
    pages: [...demoPages, ...featurePagesFor('demos')],
    titleKey: 'menu.demos',
  },
  {
    icon: DatabaseOutlined,
    key: 'examples',
    menu: showcaseExampleMenu,
    pages: [...examplePages, ...featurePagesFor('examples')],
    titleKey: 'menu.examples',
  },
  {
    icon: SettingOutlined,
    key: 'system',
    pages: systemPages,
    titleKey: 'menu.system',
  },
]

export const adminPages = [
  ...dashboardPages,
  ...systemPages,
  ...demoPages,
  ...examplePages,
  ...utilityPages,
  ...featurePages.filter((page) => page.group === 'demos' || page.group === 'examples'),
]

const adminPageByPath = new Map(adminPages.map((page) => [page.path, page]))

export function getAdminPage(definitionPath: string) {
  return adminPageByPath.get(definitionPath)
}

export function getPageTitle(page: AdminPageDefinition, locale: AppLocale) {
  if (page.label) return page.label[locale]
  return undefined
}

export function canAccessPage(page: AdminPageDefinition, roles: UserRole[]) {
  if (page.forbidden) return false
  return roles.includes('super') || !page.roles || page.roles.some((role) => roles.includes(role))
}
