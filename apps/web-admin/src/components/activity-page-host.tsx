import { Activity, Suspense, useEffect } from 'react'
import type { ReactNode } from 'react'

import { AdminPageProvider } from '~/core/admin-page-context'
import { useAppSelector, useAppStore, visitTab } from '~/core/app-store'
import { getAdminPage } from '~/core/page-registry'

interface ActivityPageHostProps {
  definitionPath: string
  params: Record<string, string>
  pathname: string
}

interface ActivityPageSlotProps extends ActivityPageHostProps {
  children: ReactNode
  revision: number
}

function ActivityPageSlot({
  children,
  definitionPath,
  params,
  pathname,
  revision,
}: ActivityPageSlotProps) {
  return (
    <div className="activity-page" data-page-path={pathname} data-page-revision={revision}>
      <AdminPageProvider definitionPath={definitionPath} params={params} pathname={pathname}>
        <Suspense fallback={<div className="page-loading">正在加载页面…</div>}>{children}</Suspense>
      </AdminPageProvider>
    </div>
  )
}

export function ActivityPageHost({ definitionPath, params, pathname }: ActivityPageHostProps) {
  'use no memo'

  const appStore = useAppStore()
  const tabs = useAppSelector((state) => state.tabs)
  const currentPage = getAdminPage(definitionPath)

  useEffect(() => {
    if (currentPage) visitTab(appStore, pathname, definitionPath, params, currentPage.titleKey)
  }, [appStore, currentPage, definitionPath, params, pathname])

  if (!currentPage) return null

  const visibleTabs = tabs.some((tab) => tab.path === pathname)
    ? tabs
    : [
        ...tabs,
        { definitionPath, params, path: pathname, revision: 0, titleKey: currentPage.titleKey },
      ]

  return (
    <div className="activity-page-host">
      {visibleTabs.map((tab) => {
        const definition = getAdminPage(tab.definitionPath)
        if (!definition) return null
        const Page = definition.page
        const revision = tab.revision ?? 0
        return (
          <Activity
            key={`${tab.path}:${tab.definitionPath}:${revision}`}
            mode={tab.path === pathname ? 'visible' : 'hidden'}
          >
            <ActivityPageSlot
              definitionPath={tab.definitionPath}
              params={tab.params}
              pathname={tab.path}
              revision={revision}
            >
              <Page />
            </ActivityPageSlot>
          </Activity>
        )
      })}
    </div>
  )
}
