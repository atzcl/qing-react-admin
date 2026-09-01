import { PageFallback } from '~/components/page-fallback'

export function ForbiddenPage() {
  return <PageFallback status="403" />
}

export function NotFoundPage() {
  return <PageFallback status="404" />
}

export function InternalErrorPage() {
  return <PageFallback status="500" />
}

export function ComingSoonPage() {
  return <PageFallback status="coming-soon" />
}

export function OfflinePage() {
  return <PageFallback status="offline" />
}
