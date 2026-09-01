import { redirect } from '@tanstack/react-router'

import { canAccessPage, getAdminPage } from './page-registry'
import type { AppUser } from './types'

export function beforeLoadAdminPage(definitionPath: string, user: AppUser | null) {
  const page = getAdminPage(definitionPath)
  if (!page) throw redirect({ href: '/demos/fallback/404' })
  if (!user || !canAccessPage(page, user.roles)) {
    throw redirect({ href: '/demos/fallback/403' })
  }
}
