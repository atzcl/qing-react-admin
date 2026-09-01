import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  WifiOutlined,
} from '@ant-design/icons'
import { useRouter, useRouterState } from '@tanstack/react-router'
import { Badge, Breadcrumb, Button, Drawer, Layout, Menu, Watermark } from 'antd'
import type { MenuProps } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import { updatePreferences, useAppSelector, useAppStore } from '~/core/app-store'
import { canAccessPage, getAdminPage, getPageTitle, navigationGroups } from '~/core/page-registry'
import type { AdminPageDefinition, NavigationFolder, NavigationNode } from '~/core/page-registry'
import type { AppLocale, AppUser } from '~/core/types'
import { useTranslation } from '~/core/use-translation'

import { ActivityPageHost } from './activity-page-host'
import { GlobalSearch } from './global-search'
import { HeaderTools } from './header-tools'
import { PreferenceDrawer } from './preference-drawer'
import { TabBar } from './tab-bar'

const { Content, Footer, Header, Sider } = Layout
type MenuItems = NonNullable<MenuProps['items']>

interface AdminShellProps {
  user: AppUser
}

interface AccessibleNavigationGroup {
  badge?: string
  badgeType?: 'dot' | 'normal'
  badgeVariant?: string
  direct?: boolean
  icon: React.ComponentType
  key: string
  menu: NavigationNode[]
  pages: AdminPageDefinition[]
  titleKey: (typeof navigationGroups)[number]['titleKey']
}

function isFolder(node: NavigationNode): node is NavigationFolder {
  return 'children' in node
}

function filterNavigationNodes(nodes: NavigationNode[], roles: AppUser['roles']): NavigationNode[] {
  const filtered: NavigationNode[] = []
  for (const node of nodes) {
    if (!isFolder(node)) {
      if (!node.hideInMenu && (canAccessPage(node, roles) || node.menuVisibleWithForbidden)) {
        filtered.push(node)
      }
      continue
    }
    const children = filterNavigationNodes(node.children, roles)
    if (children.length > 0) filtered.push({ ...node, children })
  }
  return filtered
}

function collectPagePaths(nodes: NavigationNode[]): Set<string> {
  return new Set(
    nodes.flatMap((node): string[] =>
      isFolder(node) ? [...collectPagePaths(node.children)] : [node.path],
    ),
  )
}

function firstPagePath(nodes: NavigationNode[]): string | undefined {
  for (const node of nodes) {
    if (!isFolder(node)) return node.path
    const childPath = firstPagePath(node.children)
    if (childPath) return childPath
  }
  return undefined
}

function findAncestorKeys(nodes: NavigationNode[], path: string): string[] | undefined {
  for (const node of nodes) {
    if (!isFolder(node)) {
      if (node.path === path) return []
      continue
    }
    const childKeys = findAncestorKeys(node.children, path)
    if (childKeys) return [node.key, ...childKeys]
  }
  return undefined
}

function findFolderAncestorKeys(nodes: NavigationNode[], key: string): string[] | undefined {
  for (const node of nodes) {
    if (!isFolder(node)) continue
    if (node.key === key) return []
    const childKeys = findFolderAncestorKeys(node.children, key)
    if (childKeys) return [node.key, ...childKeys]
  }
  return undefined
}

function AppLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'app-logo is-compact' : 'app-logo'}>
      <img alt="" className="app-logo__image" height={32} src="/favicon.svg" width={32} />
      {!compact ? <strong>Qing React Admin</strong> : null}
    </div>
  )
}

export function AdminShell({ user }: AdminShellProps) {
  const appStore = useAppStore()
  const preferences = useAppSelector((state) => state.preferences)
  const menuBadges = useAppSelector((state) => state.menuBadges)
  const routeState = useRouterState({
    select: (state) => {
      // `location` advances before the committed `matches` during navigation. Pairing the new
      // pathname with stale route staticData rewrites retained-tab identities and remounts pages.
      const matchedLocation = state.resolvedLocation ?? state.location
      let routePage:
        | { definitionPath: string; params: Record<string, string>; pathname: string }
        | undefined
      for (let index = state.matches.length - 1; index >= 0; index -= 1) {
        const match = state.matches[index]
        const definitionPath = match?.staticData.adminPagePath
        if (definitionPath) {
          const params = Object.fromEntries(
            Object.entries(match.params).filter(
              (entry): entry is [string, string] => typeof entry[1] === 'string',
            ),
          )
          routePage = { definitionPath, params, pathname: match.pathname }
          break
        }
      }
      const pathname = routePage?.pathname ?? matchedLocation.pathname
      return {
        currentHref: matchedLocation.pathname === pathname ? matchedLocation.href : pathname,
        pathname,
        routePage,
        status: state.status,
      }
    },
  })
  const { currentHref, pathname, routePage, status: routerStatus } = routeState
  const router = useRouter()
  const t = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [online, setOnline] = useState(true)
  const [manualMenuState, setManualMenuState] = useState<{ keys: string[]; path: string }>({
    keys: [],
    path: '',
  })

  const accessibleGroups = useMemo<AccessibleNavigationGroup[]>(
    () =>
      navigationGroups
        .map((group) => {
          const pages = (group.pages ?? []).filter((page) => canAccessPage(page, user.roles))
          const menu = filterNavigationNodes(group.menu ?? pages, user.roles)
          const menuPaths = collectPagePaths(menu)
          const generatedOrUnlistedPages = pages.filter(
            (page) => !page.hideInMenu && !menuPaths.has(page.path),
          )
          const accessibleGroup: AccessibleNavigationGroup = {
            icon: group.icon,
            key: group.key,
            menu: [...menu, ...generatedOrUnlistedPages],
            pages,
            titleKey: group.titleKey,
          }
          if (group.badge) accessibleGroup.badge = group.badge
          if (group.badgeType) accessibleGroup.badgeType = group.badgeType
          if (group.badgeVariant) accessibleGroup.badgeVariant = group.badgeVariant
          if (group.direct) accessibleGroup.direct = true
          return accessibleGroup
        })
        .filter((group) => group.pages.length > 0),
    [user.roles],
  )

  const currentPage = routePage ? getAdminPage(routePage.definitionPath) : undefined
  const activeGroup =
    accessibleGroups.find((group) => group.pages.some((page) => currentPage === page)) ??
    accessibleGroups[0]
  const selectedMenuPath = currentPage?.activePath ?? pathname
  const mode = preferences.navigationMode
  const isFullContent = mode === 'full-content'
  const isHeaderNav = mode === 'header-nav'
  const isSidebarMixedNav = mode === 'sidebar-mixed-nav'
  const hasHeaderGroupNavigation = ['header-mixed-nav', 'header-sidebar-nav', 'mixed-nav'].includes(
    mode,
  )
  const showHeader = !isFullContent && preferences.headerEnable
  const showPrimaryRail = isSidebarMixedNav && preferences.sidebarEnable
  const siderUsesActiveGroup = mode !== 'sidebar-nav'
  const showSider =
    !isFullContent &&
    !isHeaderNav &&
    preferences.sidebarEnable &&
    !(siderUsesActiveGroup && activeGroup?.direct === true)
  const sidebarCollapsed = preferences.sidebarCollapsed
  const currentTitle = currentPage
    ? (getPageTitle(currentPage, preferences.locale) ?? t(currentPage.titleKey))
    : t('app.name')

  useEffect(() => {
    const updateOnline = () => setOnline(window.navigator.onLine)
    updateOnline()
    window.addEventListener('online', updateOnline)
    window.addEventListener('offline', updateOnline)
    return () => {
      window.removeEventListener('online', updateOnline)
      window.removeEventListener('offline', updateOnline)
    }
  }, [])

  function startSidebarResize(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    const startX = event.clientX
    const startWidth = preferences.sidebarWidth
    document.documentElement.classList.add('is-resizing-sidebar')
    const onMove = (moveEvent: PointerEvent) => {
      const width = Math.min(320, Math.max(160, startWidth + moveEvent.clientX - startX))
      updatePreferences(appStore, { sidebarWidth: width })
    }
    const onUp = () => {
      document.documentElement.classList.remove('is-resizing-sidebar')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp, { once: true })
  }

  function navigate(path: string) {
    setMobileMenuOpen(false)
    const page = getAdminPage(path)
    if (page?.externalUrl) {
      window.open(page.externalUrl, '_blank', 'noopener,noreferrer')
      return
    }
    const retainedHref = appStore.state.tabs.find((tab) => tab.path === path)?.href
    const href = page?.menuHref ?? retainedHref ?? path
    if (page?.openInNewWindow) {
      window.open(href, '_blank', 'noopener,noreferrer')
      return
    }
    void router.navigate({ href })
  }

  function pageTitle(page: AdminPageDefinition) {
    return getPageTitle(page, preferences.locale) ?? t(page.titleKey)
  }

  function navigationNodeItems(nodes: NavigationNode[], locale: AppLocale): MenuItems {
    function labelWithBadge(
      label: string,
      key: string,
      node: Pick<NavigationFolder, 'badge' | 'badgeType' | 'badgeVariant'>,
    ) {
      const dynamicBadge = menuBadges[key]
      const badge = dynamicBadge?.badge ?? node.badge
      const badgeType = dynamicBadge?.badgeType ?? node.badgeType
      const badgeVariant = dynamicBadge?.badgeVariant ?? node.badgeVariant
      const color =
        badgeVariant === 'destructive'
          ? '#ef4444'
          : badgeVariant === 'success'
            ? '#22c55e'
            : badgeVariant === 'primary'
              ? preferences.colorPrimary
              : undefined

      return (
        <span className="admin-menu-label">
          <span>{label}</span>
          {badgeType === 'dot' ? (
            <Badge {...(color ? { color } : {})} dot />
          ) : badge ? (
            <Badge {...(color ? { color } : {})} count={badge} />
          ) : null}
        </span>
      )
    }

    return nodes.map((node) => {
      if (isFolder(node)) {
        const Icon =
          node.activeIcon && collectPagePaths(node.children).has(selectedMenuPath)
            ? node.activeIcon
            : node.icon
        return {
          children: navigationNodeItems(node.children, locale),
          icon: Icon ? <Icon /> : undefined,
          key: node.key,
          label: labelWithBadge(node.label[locale], node.key, node),
        }
      }
      const Icon = node.activeIcon && selectedMenuPath === node.path ? node.activeIcon : node.icon
      return {
        icon: Icon ? <Icon /> : undefined,
        key: node.path,
        label: labelWithBadge(pageTitle(node), node.path, node),
      }
    })
  }

  function groupLabelWithBadge(group: AccessibleNavigationGroup) {
    const color =
      group.badgeVariant === 'destructive'
        ? '#ef4444'
        : group.badgeVariant === 'success'
          ? '#22c55e'
          : group.badgeVariant === 'primary'
            ? preferences.colorPrimary
            : undefined
    return (
      <span className="admin-menu-label">
        <span>{t(group.titleKey)}</span>
        {group.badgeType === 'dot' ? (
          <Badge {...(color ? { color } : {})} dot />
        ) : group.badge ? (
          <Badge {...(color ? { color } : {})} count={group.badge} />
        ) : null}
      </span>
    )
  }

  const fullMenuItems: MenuItems = accessibleGroups.map((group) => {
    const Icon = group.icon
    if (group.direct) {
      const page = group.pages[0]
      return {
        icon: <Icon />,
        key: page?.path ?? group.key,
        label: groupLabelWithBadge(group),
      }
    }
    return {
      children: navigationNodeItems(group.menu, preferences.locale),
      icon: <Icon />,
      key: group.key,
      label: groupLabelWithBadge(group),
    }
  })

  const groupMenuItems: MenuItems = accessibleGroups.map((group) => {
    const Icon = group.icon
    return { icon: <Icon />, key: group.key, label: groupLabelWithBadge(group) }
  })

  const activeGroupItems = navigationNodeItems(activeGroup?.menu ?? [], preferences.locale)
  const siderMenuItems = siderUsesActiveGroup ? activeGroupItems : fullMenuItems
  const currentIcon = currentPage?.icon
  const CurrentPageIcon = currentIcon
  const ancestorMenuKeys = findAncestorKeys(activeGroup?.menu ?? [], selectedMenuPath) ?? []
  const automaticOpenMenuKeys = siderUsesActiveGroup
    ? ancestorMenuKeys
    : [activeGroup?.key ?? '', ...ancestorMenuKeys].filter(Boolean)
  const openMenuKeys =
    manualMenuState.path === selectedMenuPath ? manualMenuState.keys : automaticOpenMenuKeys
  const mobileOpenMenuKeys = [activeGroup?.key ?? '', ...ancestorMenuKeys].filter(Boolean)
  const layoutClassName = [
    'admin-layout',
    `is-${mode}`,
    `has-header-${preferences.headerMode}`,
    preferences.headerEnable ? '' : 'has-header-disabled',
    preferences.compact ? 'is-compact' : '',
    preferences.semiDarkHeader ? 'has-semi-dark-header' : '',
    preferences.semiDarkSidebar ? 'has-semi-dark-sidebar' : '',
    preferences.semiDarkSidebarSub ? 'has-semi-dark-sidebar-sub' : '',
  ]
    .filter(Boolean)
    .join(' ')

  useEffect(() => {
    document.title = preferences.dynamicTitle
      ? `${currentTitle} - Qing React Admin`
      : 'Qing React Admin'
  }, [currentTitle, preferences.dynamicTitle])

  return (
    <Layout className={layoutClassName}>
      {routerStatus === 'pending' ? <div className="navigation-progress" /> : null}

      {showPrimaryRail ? (
        <aside className="mixed-navigation-rail">
          <button
            className="logo-button mixed-navigation-rail__logo"
            onClick={() => navigate('/dashboard/analytics')}
            type="button"
          >
            <AppLogo compact />
          </button>
          <nav aria-label="主导航">
            {accessibleGroups.map((group) => {
              const Icon = group.icon
              return (
                <button
                  className={group.key === activeGroup?.key ? 'is-active' : ''}
                  key={group.key}
                  onClick={() => {
                    const path = group.direct ? group.pages[0]?.path : firstPagePath(group.menu)
                    if (path) navigate(path)
                  }}
                  type="button"
                >
                  <Icon />
                  <span>{t(group.titleKey)}</span>
                </button>
              )
            })}
          </nav>
        </aside>
      ) : null}

      {showSider ? (
        <Sider
          className={
            preferences.sidebarCollapsedShowTitle
              ? 'admin-sider desktop-sider shows-collapsed-title'
              : 'admin-sider desktop-sider'
          }
          collapsed={sidebarCollapsed}
          collapsedWidth={isSidebarMixedNav ? 0 : 60}
          trigger={null}
          width={preferences.sidebarWidth}
        >
          {mode === 'sidebar-nav' ? (
            <button
              className="logo-button"
              onClick={() => navigate('/dashboard/analytics')}
              type="button"
            >
              <AppLogo compact={sidebarCollapsed} />
            </button>
          ) : (
            <div className="admin-sider__group-title">
              {activeGroup ? t(activeGroup.titleKey) : t('app.name')}
            </div>
          )}
          <Menu
            items={siderMenuItems}
            mode="inline"
            onClick={({ key }) => navigate(key)}
            onOpenChange={(keys) => {
              const openedKey = keys.find((key) => !openMenuKeys.includes(key))
              let nextKeys = keys
              if (preferences.navigationAccordion && openedKey) {
                if (siderUsesActiveGroup) {
                  nextKeys = [
                    ...(findFolderAncestorKeys(activeGroup?.menu ?? [], openedKey) ?? []),
                    openedKey,
                  ]
                } else {
                  const owner = accessibleGroups.find(
                    (group) =>
                      group.key === openedKey ||
                      findFolderAncestorKeys(group.menu, openedKey) !== undefined,
                  )
                  nextKeys = owner
                    ? [
                        owner.key,
                        ...(findFolderAncestorKeys(owner.menu, openedKey) ?? []),
                        ...(owner.key === openedKey ? [] : [openedKey]),
                      ]
                    : [openedKey]
                }
              }
              setManualMenuState({ keys: nextKeys, path: selectedMenuPath })
            }}
            openKeys={openMenuKeys}
            selectedKeys={[selectedMenuPath]}
          />
          {preferences.sidebarDraggable && !sidebarCollapsed ? (
            <button
              aria-label="拖拽调整侧边栏宽度"
              className="sidebar-resizer"
              onPointerDown={startSidebarResize}
              type="button"
            />
          ) : null}
          {preferences.sidebarCollapsedButton ? (
            <Button
              aria-label={preferences.sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
              className={sidebarCollapsed ? 'sider-collapse is-collapsed' : 'sider-collapse'}
              icon={preferences.sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() =>
                updatePreferences(appStore, { sidebarCollapsed: !preferences.sidebarCollapsed })
              }
              type="text"
            >
              {!sidebarCollapsed ? '收起菜单' : null}
            </Button>
          ) : null}
        </Sider>
      ) : null}

      <Layout className="admin-main-layout">
        {showHeader ? (
          <Header className="admin-header">
            <div className="admin-header__leading">
              <Button
                aria-label="打开导航菜单"
                className="mobile-menu-trigger"
                icon={<MenuUnfoldOutlined />}
                onClick={() => setMobileMenuOpen(true)}
                type="text"
              />
              {mode !== 'sidebar-nav' && !isSidebarMixedNav ? (
                <button
                  className="logo-button top-logo"
                  onClick={() => navigate('/dashboard/analytics')}
                  type="button"
                >
                  <AppLogo />
                </button>
              ) : null}
              {isHeaderNav ? (
                <Menu
                  className="header-menu"
                  items={fullMenuItems}
                  mode="horizontal"
                  onClick={({ key }) => navigate(key)}
                  selectedKeys={[selectedMenuPath]}
                  style={{
                    justifyContent:
                      preferences.headerMenuAlign === 'center'
                        ? 'center'
                        : preferences.headerMenuAlign === 'end'
                          ? 'flex-end'
                          : 'flex-start',
                  }}
                />
              ) : null}
              {hasHeaderGroupNavigation ? (
                <Menu
                  className="header-menu"
                  items={groupMenuItems}
                  mode="horizontal"
                  onClick={({ key }) => {
                    const group = accessibleGroups.find((item) => item.key === key)
                    const path = group
                      ? group.direct
                        ? group.pages[0]?.path
                        : firstPagePath(group.menu)
                      : undefined
                    if (path) navigate(path)
                  }}
                  selectedKeys={[activeGroup?.key ?? '']}
                  style={{
                    justifyContent:
                      preferences.headerMenuAlign === 'center'
                        ? 'center'
                        : preferences.headerMenuAlign === 'end'
                          ? 'flex-end'
                          : 'flex-start',
                  }}
                />
              ) : null}
            </div>
            <HeaderTools
              onNavigate={navigate}
              onOpenPreferences={() => setPreferencesOpen(true)}
              onOpenSearch={() => setSearchOpen(true)}
              user={user}
            />
          </Header>
        ) : null}

        {preferences.showTabs && !isFullContent ? (
          <TabBar onNavigate={navigate} pathname={pathname} />
        ) : null}

        <Content
          className={[
            'admin-content',
            preferences.animations ? 'has-page-motion' : '',
            preferences.animations ? `has-page-motion-${preferences.transitionName}` : '',
            preferences.contentCompact === 'compact' ? 'is-compact-width' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          id="main-scrollable-area"
        >
          {!online ? (
            <div className="offline-banner">
              <WifiOutlined /> 网络连接已断开，当前展示缓存内容
            </div>
          ) : null}
          {preferences.showBreadcrumb && currentPage && !isFullContent ? (
            <div className={`breadcrumb-row is-${preferences.breadcrumbStyle}`}>
              <Breadcrumb
                items={[
                  ...(preferences.showBreadcrumbHome
                    ? [{ href: '/dashboard/analytics', title: <HomeOutlined /> }]
                    : []),
                  {
                    title: activeGroup ? t(activeGroup.titleKey) : t('app.name'),
                  },
                  {
                    title: (
                      <span className="breadcrumb-current">
                        {preferences.showBreadcrumbIcon && CurrentPageIcon ? (
                          <CurrentPageIcon />
                        ) : null}
                        {currentTitle}
                      </span>
                    ),
                  },
                ]}
              />
            </div>
          ) : null}
          {preferences.showWatermark ? (
            <Watermark
              className="content-watermark"
              content={preferences.watermarkContent || `${user.username} - ${user.realName}`}
              font={{ color: 'rgba(127, 127, 127, 0.08)', fontSize: 14 }}
              gap={[180, 180]}
              zIndex={2}
            >
              {routePage ? (
                <ActivityPageHost
                  definitionPath={routePage.definitionPath}
                  href={currentHref}
                  params={routePage.params}
                  pathname={pathname}
                />
              ) : null}
            </Watermark>
          ) : routePage ? (
            <ActivityPageHost
              definitionPath={routePage.definitionPath}
              href={currentHref}
              params={routePage.params}
              pathname={pathname}
            />
          ) : null}
        </Content>

        {preferences.showFooter && !isFullContent ? (
          <Footer className={preferences.footerFixed ? 'admin-footer is-fixed' : 'admin-footer'}>
            {preferences.copyrightEnable ? (
              <>
                Copyright © {preferences.copyrightDate}{' '}
                <a href={preferences.copyrightCompanySiteLink} rel="noreferrer" target="_blank">
                  {preferences.copyrightCompanyName}
                </a>
                {preferences.copyrightIcp ? (
                  <a href={preferences.copyrightIcpLink} rel="noreferrer" target="_blank">
                    {preferences.copyrightIcp}
                  </a>
                ) : null}
              </>
            ) : null}
          </Footer>
        ) : null}
      </Layout>

      {preferences.preferencesButtonPosition === 'fixed' ||
      (preferences.preferencesButtonPosition === 'auto' && isFullContent) ? (
        <Button
          aria-label="打开偏好设置"
          className="full-content-preferences"
          icon={<SettingOutlined />}
          onClick={() => setPreferencesOpen(true)}
          shape="circle"
          type="primary"
        />
      ) : null}

      <Drawer
        className="mobile-navigation-drawer"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        placement="left"
        size={288}
        styles={{ body: { padding: 0 } }}
        title={<AppLogo />}
      >
        <Menu
          defaultOpenKeys={mobileOpenMenuKeys}
          items={fullMenuItems}
          mode="inline"
          onClick={({ key }) => navigate(key)}
          selectedKeys={[selectedMenuPath]}
        />
      </Drawer>
      <PreferenceDrawer onClose={() => setPreferencesOpen(false)} open={preferencesOpen} />
      <GlobalSearch
        onNavigate={navigate}
        onOpenChange={setSearchOpen}
        open={searchOpen}
        user={user}
      />
    </Layout>
  )
}
