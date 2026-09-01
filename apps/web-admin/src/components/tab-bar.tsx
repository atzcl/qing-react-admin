import {
  CloseOutlined,
  ColumnWidthOutlined,
  CompressOutlined,
  ExportOutlined,
  FullscreenOutlined,
  MoreOutlined,
  PushpinOutlined,
  ReloadOutlined,
  SwapOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
} from '@ant-design/icons'
import { Button, Dropdown, Tabs, Tooltip } from 'antd'
import type { MenuProps, TabsProps } from 'antd'
import { useEffect, useState } from 'react'

import { refreshTab, reorderTabs, useAppSelector, useAppStore } from '~/core/app-store'
import { getAdminPage, getPageTitle } from '~/core/page-registry'
import { executeTabCommand } from '~/core/tab-model'
import type { TabCommand } from '~/core/tab-model'
import type { AppTab } from '~/core/types'
import { useTranslation } from '~/core/use-translation'

import { ButtonList } from './button-list'

interface TabBarProps {
  onNavigate: (path: string) => void
  pathname: string
}

const tabCommandByMenuKey = {
  all: { type: 'close-all' },
  close: { type: 'close' },
  left: { type: 'close-left' },
  others: { type: 'close-others' },
  pin: { type: 'toggle-affix' },
  refresh: { type: 'refresh' },
  right: { type: 'close-right' },
} as const satisfies Record<string, Omit<TabCommand, 'path'> | { type: 'close-all' }>

type TabCommandMenuKey = keyof typeof tabCommandByMenuKey

function isTabCommandMenuKey(key: string): key is TabCommandMenuKey {
  return Object.hasOwn(tabCommandByMenuKey, key)
}

export function TabBar({ onNavigate, pathname }: TabBarProps) {
  const appStore = useAppStore()
  const tabs = useAppSelector((state) => state.tabs)
  const preferences = useAppSelector((state) => state.preferences)
  const t = useTranslation()
  const [maximized, setMaximized] = useState(false)

  useEffect(() => {
    document.documentElement.toggleAttribute('data-tab-maximized', maximized)
    return () => document.documentElement.removeAttribute('data-tab-maximized')
  }, [maximized])

  function remove(path: string) {
    const result = executeTabCommand(appStore, pathname, { path, type: 'close' })
    if (result.nextHref) onNavigate(result.nextHref)
  }

  function titleFor(tab: AppTab) {
    if (tab.title) return tab.title
    const page = getAdminPage(tab.definitionPath)
    return page ? (getPageTitle(page, preferences.locale) ?? t(page.titleKey)) : t(tab.titleKey)
  }

  function runTabAction(key: string, tab: AppTab) {
    if (isTabCommandMenuKey(key)) {
      const command = tabCommandByMenuKey[key]
      const result = executeTabCommand(
        appStore,
        pathname,
        command.type === 'close-all' ? command : { ...command, path: tab.path },
      )
      if (result.nextHref) onNavigate(result.nextHref)
      return
    }
    if (key === 'open') window.open(tab.href, '_blank', 'noopener,noreferrer')
    if (key === 'maximize') setMaximized((value) => !value)
  }

  function tabMenu(tab: AppTab): MenuProps {
    const tabIndex = tabs.findIndex((item) => item.path === tab.path)
    const canCloseLeft = tabs.slice(0, tabIndex).some((item) => !item.affix)
    const canCloseRight = tabs.slice(tabIndex + 1).some((item) => !item.affix)
    const canCloseOthers = tabs.some((item) => item.path !== tab.path && !item.affix)
    const canCloseAll = tabs.some((item) => !item.affix)

    return {
      items: [
        {
          disabled: Boolean(tab.affix),
          icon: <CloseOutlined />,
          key: 'close',
          label: t('tabs.close'),
        },
        { icon: <PushpinOutlined />, key: 'pin', label: tab.affix ? '取消固定' : '固定' },
        {
          icon: maximized ? <CompressOutlined /> : <FullscreenOutlined />,
          key: 'maximize',
          label: maximized ? '还原' : '最大化',
        },
        { icon: <ReloadOutlined />, key: 'refresh', label: '重新加载' },
        { icon: <ExportOutlined />, key: 'open', label: '在新窗口打开' },
        { type: 'divider' },
        {
          disabled: !canCloseLeft,
          icon: <VerticalRightOutlined />,
          key: 'left',
          label: '关闭左侧标签页',
        },
        {
          disabled: !canCloseRight,
          icon: <VerticalLeftOutlined />,
          key: 'right',
          label: '关闭右侧标签页',
        },
        { type: 'divider' },
        {
          disabled: !canCloseOthers,
          icon: <ColumnWidthOutlined />,
          key: 'others',
          label: '关闭其他标签页',
        },
        {
          disabled: !canCloseAll,
          icon: <SwapOutlined />,
          key: 'all',
          label: '关闭全部标签页',
        },
      ],
      onClick: ({ key }) => runTabAction(key, tab),
    }
  }

  const activeTab = tabs.find((tab) => tab.path === pathname) ?? tabs[0]
  const items: TabsProps['items'] = tabs.map((tab) => {
    const page = getAdminPage(tab.definitionPath)
    const Icon = page?.icon
    const label = (
      <span
        className="app-tab-label"
        draggable={preferences.tabDraggable}
        onDragOver={(event) => event.preventDefault()}
        onDragStart={(event) => event.dataTransfer.setData('text/plain', tab.path)}
        onDrop={(event) => {
          event.preventDefault()
          reorderTabs(appStore, event.dataTransfer.getData('text/plain'), tab.path)
        }}
      >
        {preferences.showTabIcons && Icon ? <Icon /> : null}
        <span>{titleFor(tab)}</span>
      </span>
    )

    return {
      closable: !tab.affix,
      key: tab.path,
      label: preferences.showTabMore ? (
        <Dropdown
          rootClassName="tab-context-dropdown"
          menu={tabMenu(tab)}
          trigger={['contextMenu']}
        >
          {label}
        </Dropdown>
      ) : (
        label
      ),
    }
  })

  const actions = activeTab ? (
    <ButtonList
      className="tabbar__actions"
      gap={0}
      list={[
        ...(preferences.showTabMore
          ? [
              {
                key: 'more',
                render: (
                  <Dropdown
                    menu={tabMenu(activeTab)}
                    placement="bottomRight"
                    rootClassName="tab-context-dropdown"
                    trigger={['click']}
                  >
                    <Button aria-label="标签页操作" icon={<MoreOutlined />} type="text" />
                  </Dropdown>
                ),
              },
            ]
          : []),
        {
          key: 'refresh',
          render: (
            <Tooltip title="刷新当前页">
              <Button
                aria-label="刷新当前标签页"
                icon={<ReloadOutlined />}
                onClick={() => refreshTab(appStore, activeTab.path)}
                type="text"
              />
            </Tooltip>
          ),
        },
        {
          key: 'fullscreen',
          render: (
            <Tooltip title={maximized ? '还原当前页面' : '全屏当前页面'}>
              <Button
                aria-label={maximized ? '还原当前页面' : '全屏当前页面'}
                icon={maximized ? <CompressOutlined /> : <FullscreenOutlined />}
                onClick={() => setMaximized((value) => !value)}
                type="text"
              />
            </Tooltip>
          ),
        },
      ]}
    />
  ) : null

  return (
    <Tabs
      activeKey={pathname}
      animated={false}
      className={`tabbar is-${preferences.tabStyle}`}
      hideAdd
      items={items}
      more={{ trigger: 'click' }}
      onChange={(path) => onNavigate(tabs.find((tab) => tab.path === path)?.href ?? path)}
      onEdit={(targetKey, action) => {
        if (action === 'remove' && typeof targetKey === 'string') remove(targetKey)
      }}
      onMouseDown={(event) => {
        if (event.button === 1 && preferences.tabMiddleClickToClose) {
          if (!(event.target instanceof Element)) return
          const tab = event.target.closest<HTMLElement>('[data-node-key]')
          const path = tab?.dataset.nodeKey
          if (path && !tabs.find((item) => item.path === path)?.affix) remove(path)
        }
      }}
      onWheel={(event) => {
        if (!preferences.tabWheelable || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
        event.currentTarget
          .querySelector<HTMLElement>('.ant-tabs-nav-wrap')
          ?.scrollBy({ behavior: 'smooth', left: event.deltaY })
      }}
      size="small"
      tabBarExtraContent={{ right: actions }}
      type="editable-card"
    />
  )
}
