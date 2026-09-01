import type { QueryClient } from '@tanstack/react-query'

import type { AppUser } from './types'

export interface RouterContext {
  queryClient: QueryClient
  user: AppUser | null
}
