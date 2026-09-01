import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'

import { getCurrentUser } from './core/auth'
import type { RouterContext } from './core/router-context'
import { routeTree } from './routeTree.gen'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 10 * 60_000,
      retry: 1,
      staleTime: 30_000,
    },
  },
})

const context: RouterContext = { queryClient, user: getCurrentUser() }

export const router = createRouter({
  context,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  routeTree,
  scrollRestoration: true,
  scrollToTopSelectors: ['#main-scrollable-area'],
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
  interface StaticDataRouteOption {
    adminPagePath?: string
  }
}
