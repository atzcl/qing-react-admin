import { queryOptions } from '@tanstack/react-query'

import { getAnalyticsSnapshot } from './data'

export const analyticsQueryOptions = queryOptions({
  refetchInterval: 60_000,
  queryFn: getAnalyticsSnapshot,
  queryKey: ['dashboard', 'analytics'],
  staleTime: 60_000,
})
