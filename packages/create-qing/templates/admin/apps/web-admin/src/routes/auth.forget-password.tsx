import { createFileRoute } from '@tanstack/react-router'

import { ForgetPasswordPage } from '~/pages/auth-pages'

export const Route = createFileRoute('/auth/forget-password')({ component: ForgetPasswordPage })
