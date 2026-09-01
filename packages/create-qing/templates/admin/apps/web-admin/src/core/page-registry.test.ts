import { describe, expect, it } from 'vitest'

import { pageCountByGroup, pageManifest } from './page-manifest'
import {
  adminPages,
  canAccessPage,
  dashboardPages,
  demoPages,
  examplePages,
  featurePages,
  getAdminPage,
  navigationGroups,
  systemPages,
  utilityPages,
} from './page-registry'
import { localizedPagePaths } from './route-labels'
import { showcaseStats } from './showcase-catalog'

describe('page registry', () => {
  it('keeps every navigation page in the Activity registry', () => {
    const visiblePaths = navigationGroups.flatMap(
      (group) => group.pages?.map((page) => page.path) ?? [],
    )
    expect(visiblePaths.every((path) => adminPages.some((page) => page.path === path))).toBe(true)
  })

  it('exposes the four application menu groups and all built-in features', () => {
    expect(navigationGroups.map((group) => group.key)).toEqual([
      'dashboard',
      'demos',
      'examples',
      'system',
    ])
    expect(showcaseStats).toEqual({ demoPages: 41, examplePages: 41, totalPages: 82 })
    expect(featurePages.map((page) => page.path)).toEqual(
      expect.arrayContaining([
        '/dashboard/analytics',
        '/dashboard/workspace',
        '/profile',
        '/system/dept',
        '/system/menu',
        '/system/role',
        '/system/user',
      ]),
    )
  })

  it('registers the complete standalone route contract', () => {
    const standalonePages = [
      ...dashboardPages,
      ...demoPages,
      ...examplePages,
      ...systemPages,
      ...utilityPages.filter((page) => page.path === '/profile'),
    ]

    expect(new Set(standalonePages.map((page) => page.path)).size).toBe(standalonePages.length)
    expect(standalonePages.every((page) => getAdminPage(page.path) === page)).toBe(true)
    expect(new Set(adminPages.map((page) => page.path)).size).toBe(adminPages.length)
    expect(adminPages.some((page) => /about|project/.test(page.path))).toBe(false)
    expect(getAdminPage('/system/user')?.page).not.toBe(getAdminPage('/system/role')?.page)
  })

  it('maps every manifest entry to one reachable React page', () => {
    const manifestCounts = Object.fromEntries(
      Object.keys(pageCountByGroup).map((group) => [
        group,
        pageManifest.filter((entry) => entry.group === group).length,
      ]),
    )

    expect(pageCountByGroup).toEqual(manifestCounts)
    expect(pageManifest).toHaveLength(
      Object.values(pageCountByGroup).reduce((total, count) => total + count, 0),
    )
    expect(new Set(pageManifest.map((entry) => entry.path)).size).toBe(pageManifest.length)
    expect(pageManifest.every((entry) => getAdminPage(entry.path))).toBe(true)
  })

  it('uses localized titles for every demo and example route', () => {
    expect(localizedPagePaths).toHaveLength(82)
    expect(new Set(localizedPagePaths)).toEqual(
      new Set([...demoPages, ...examplePages].map((page) => page.path)),
    )
    expect(getAdminPage('/examples/pro-table/basic')?.label).toEqual({
      'en-US': 'Basic Table',
      'zh-CN': '基础表格',
      'zh-TW': '基礎表格',
    })
  })

  it('honors explicit role metadata while leaving system routes unscoped', () => {
    const usersPage = getAdminPage('/system/user')
    expect(usersPage).toBeDefined()
    expect(canAccessPage(usersPage!, ['admin'])).toBe(true)
    expect(canAccessPage(usersPage!, ['user'])).toBe(true)
    expect(canAccessPage(usersPage!, ['super'])).toBe(true)

    const superPage = getAdminPage('/demos/access/super-visible')
    expect(canAccessPage(superPage!, ['admin'])).toBe(false)
    expect(canAccessPage(superPage!, ['super'])).toBe(true)
  })
})
