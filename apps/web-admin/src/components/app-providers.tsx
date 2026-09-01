import { App as AntdApp, ConfigProvider, theme } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import zhTW from 'antd/locale/zh_TW'
import { useEffect, useState } from 'react'
import type { PropsWithChildren } from 'react'

import { ProTableLocaleProvider } from '~/components/pro-table'
import { QueryFormLocaleProvider } from '~/components/query-form'
import { AppStoreProvider, useAppSelector } from '~/core/app-store'

function suppressThemeTransitions() {
  const style = document.createElement('style')
  style.textContent = '*,*::before,*::after{transition:none!important}'
  document.head.append(style)
  void document.body.offsetHeight
  window.requestAnimationFrame(() => style.remove())
}

function ThemeProvider({ children }: PropsWithChildren) {
  const preferences = useAppSelector((state) => state.preferences)
  const [systemDark, setSystemDark] = useState(false)
  const isDark =
    preferences.colorMode === 'dark' || (preferences.colorMode === 'system' && systemDark)
  const sharedLocale =
    preferences.locale === 'zh-CN'
      ? {
          queryForm: {
            collapseText: '收起',
            expandText: '展开',
            queryText: '查询',
            resetText: '重置',
          },
          table: {
            clearSelectionLabel: '清空选择',
            columnVisibilityAriaLabel: '列显示',
            columnVisibilityDragHandleLabel: '拖动排序',
            columnVisibilityResetLabel: '重置',
            columnVisibilityTooltip: '列显示',
            currentPageSelectionLabel: '当前页',
            densityAriaLabel: '表格密度',
            densityLargeLabel: '宽松',
            densityMiddleLabel: '默认',
            densitySmallLabel: '紧凑',
            densityTooltip: '表格密度',
            pinColumnEndLabel: '固定到末尾',
            pinColumnStartLabel: '固定到开头',
            refreshAriaLabel: '刷新表格',
            refreshTooltip: '刷新',
            selectedRowsText: (count: number) => `已选择 ${count} 项`,
            unpinColumnLabel: '取消固定',
          },
        }
      : preferences.locale === 'zh-TW'
        ? {
            queryForm: {
              collapseText: '收起',
              expandText: '展開',
              queryText: '查詢',
              resetText: '重設',
            },
            table: {
              clearSelectionLabel: '清空選擇',
              columnVisibilityAriaLabel: '欄位顯示',
              columnVisibilityDragHandleLabel: '拖動排序',
              columnVisibilityResetLabel: '重設',
              columnVisibilityTooltip: '欄位顯示',
              currentPageSelectionLabel: '目前頁面',
              densityAriaLabel: '表格密度',
              densityLargeLabel: '寬鬆',
              densityMiddleLabel: '預設',
              densitySmallLabel: '緊湊',
              densityTooltip: '表格密度',
              pinColumnEndLabel: '固定到末尾',
              pinColumnStartLabel: '固定到開頭',
              refreshAriaLabel: '重新整理表格',
              refreshTooltip: '重新整理',
              selectedRowsText: (count: number) => `已選擇 ${count} 項`,
              unpinColumnLabel: '取消固定',
            },
          }
        : {
            queryForm: {
              collapseText: 'Collapse',
              expandText: 'Expand',
              queryText: 'Search',
              resetText: 'Reset',
            },
            table: {
              clearSelectionLabel: 'Clear selection',
              columnVisibilityAriaLabel: 'Column display',
              columnVisibilityDragHandleLabel: 'Drag to reorder',
              columnVisibilityResetLabel: 'Reset',
              columnVisibilityTooltip: 'Column display',
              currentPageSelectionLabel: 'Current page',
              densityAriaLabel: 'Table density',
              densityLargeLabel: 'Large',
              densityMiddleLabel: 'Middle',
              densitySmallLabel: 'Compact',
              densityTooltip: 'Table density',
              pinColumnEndLabel: 'Pin to end',
              pinColumnStartLabel: 'Pin to start',
              refreshAriaLabel: 'Refresh table',
              refreshTooltip: 'Refresh',
              selectedRowsText: (count: number) => `${count} selected`,
              unpinColumnLabel: 'Unpin',
            },
          }

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setSystemDark(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    suppressThemeTransitions()
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
    document.documentElement.dataset.navigationStyle = preferences.navigationStyle
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
    document.documentElement.style.fontSize = `${preferences.fontSize}px`
    document.documentElement.style.filter = [
      preferences.colorGrayMode ? 'grayscale(1)' : '',
      preferences.colorWeakMode ? 'invert(0.8)' : '',
    ]
      .filter(Boolean)
      .join(' ')
  }, [
    isDark,
    preferences.colorGrayMode,
    preferences.colorWeakMode,
    preferences.fontSize,
    preferences.navigationStyle,
  ])

  return (
    <ConfigProvider
      componentSize={preferences.compact ? 'small' : 'medium'}
      locale={preferences.locale === 'zh-CN' ? zhCN : preferences.locale === 'zh-TW' ? zhTW : enUS}
      theme={{
        algorithm: [
          isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          ...(preferences.compact ? [theme.compactAlgorithm] : []),
        ],
        cssVar: { key: 'qing-react-admin' },
        token: {
          borderRadius: preferences.radius,
          colorPrimary: preferences.colorPrimary,
          fontSize: preferences.fontSize,
          fontWeightStrong: 600,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
          motion: preferences.animations,
        },
        components: {
          Card: {
            bodyPadding: 20,
            headerFontSize: preferences.fontSize,
            headerHeight: 48,
            headerPadding: 20,
          },
          Dropdown: {
            paddingBlock: 4,
          },
          Layout: {
            headerHeight: 50,
            headerPadding: '0 16px',
          },
          Menu: {
            collapsedIconSize: 18,
            collapsedWidth: 60,
            iconSize: 17,
            itemHeight: 40,
            itemBorderRadius:
              preferences.navigationStyle === 'rounded' ? Math.max(4, preferences.radius - 2) : 0,
            itemMarginBlock: 2,
            itemMarginInline: 8,
            itemPaddingInline: 12,
          },
          Tabs: {
            cardHeight: 40,
            titleFontSize: preferences.fontSize,
          },
        },
      }}
    >
      <QueryFormLocaleProvider locale={sharedLocale.queryForm}>
        <ProTableLocaleProvider locale={sharedLocale.table}>
          <AntdApp className="app-provider">{children}</AntdApp>
        </ProTableLocaleProvider>
      </QueryFormLocaleProvider>
    </ConfigProvider>
  )
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AppStoreProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AppStoreProvider>
  )
}
