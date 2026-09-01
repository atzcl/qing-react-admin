/// <reference types="vite/client" />

import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { Button, Result } from 'antd'
import { Suspense, lazy } from 'react'
import type { PropsWithChildren } from 'react'

import { AppProviders } from '~/components/app-providers'
import { getCurrentUser } from '~/core/auth'
import type { RouterContext } from '~/core/router-context'

const DevelopmentTools = import.meta.env.DEV
  ? lazy(() =>
      import('~/components/development-tools').then((module) => ({
        default: module.DevelopmentTools,
      })),
    )
  : null

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: () => ({ user: getCurrentUser() }),
  component: RootComponent,
  errorComponent: ({ error, reset }) => (
    <RootProviders>
      <Result
        extra={
          <Button onClick={() => reset()} type="primary">
            重试
          </Button>
        }
        status="500"
        subTitle={error.message}
        title="页面加载失败"
      />
    </RootProviders>
  ),
  notFoundComponent: () => (
    <RootProviders>
      <Result
        extra={
          <Button href="/dashboard/analytics" type="primary">
            返回首页
          </Button>
        }
        status="404"
        subTitle="您访问的页面不存在或已经被移动。"
        title="404"
      />
    </RootProviders>
  ),
})

function RootComponent() {
  return (
    <RootProviders>
      <Outlet />
    </RootProviders>
  )
}

function RootProviders({ children }: PropsWithChildren) {
  const debugToolsEnabled =
    import.meta.env.DEV && new URLSearchParams(window.location.search).get('debug') === '1'

  return (
    <AppProviders>
      {children}
      {debugToolsEnabled && DevelopmentTools ? (
        <Suspense fallback={null}>
          <DevelopmentTools />
        </Suspense>
      ) : null}
    </AppProviders>
  )
}
