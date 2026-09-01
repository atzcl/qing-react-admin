import { createFileRoute } from '@tanstack/react-router'

import { CodeLoginPage } from '~/pages/auth-pages'

export const Route = createFileRoute('/auth/code-login')({ component: CodeLoginPage })
