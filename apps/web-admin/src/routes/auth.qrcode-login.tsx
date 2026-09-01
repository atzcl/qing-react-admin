import { createFileRoute } from '@tanstack/react-router'

import { QrCodeLoginPage } from '~/pages/auth-pages'

export const Route = createFileRoute('/auth/qrcode-login')({ component: QrCodeLoginPage })
