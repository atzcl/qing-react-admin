import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/$')({
  beforeLoad: () => {
    throw redirect({ href: '/demos/fallback/404' })
  },
})
