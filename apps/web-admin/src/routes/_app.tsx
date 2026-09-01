import { createFileRoute, redirect } from '@tanstack/react-router'

import { AdminShell } from '~/components/admin-shell'
import { queryFormSearchSchema } from '~/core/query-form-search'

export const Route = createFileRoute('/_app')({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        search: { redirect: location.href },
        to: '/auth/login',
      })
    }
  },
  component: AppRoute,
  validateSearch: queryFormSearchSchema,
})

function AppRoute() {
  const { user } = Route.useRouteContext()
  return user ? <AdminShell user={user} /> : null
}
