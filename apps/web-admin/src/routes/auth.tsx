import { createFileRoute, redirect } from '@tanstack/react-router'

import { AuthLayout } from '~/components/auth-layout'

export const Route = createFileRoute('/auth')({
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ href: context.user.homePath })
  },
  component: AuthLayout,
})
