import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { LoginPage } from '~/pages/auth-pages'

const loginSearchSchema = z.object({ redirect: z.string().optional() })

export const Route = createFileRoute('/auth/login')({
  component: LoginRoute,
  validateSearch: loginSearchSchema,
})

function LoginRoute() {
  const { redirect } = Route.useSearch()
  return <LoginPage {...(redirect ? { redirect } : {})} />
}
