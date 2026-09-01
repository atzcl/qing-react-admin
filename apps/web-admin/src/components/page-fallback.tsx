import { ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons'
import { useRouter } from '@tanstack/react-router'
import { Button } from 'antd'
import type { ReactNode } from 'react'

import forbiddenSvg from '~/assets/fallback/icon-403.svg?raw'
import notFoundSvg from '~/assets/fallback/icon-404.svg?raw'
import internalErrorSvg from '~/assets/fallback/icon-500.svg?raw'
import comingSoonSvg from '~/assets/fallback/icon-coming-soon.svg?raw'
import offlineSvg from '~/assets/fallback/icon-offline.svg?raw'

export type PageFallbackStatus = '403' | '404' | '500' | 'coming-soon' | 'offline'

interface PageFallbackProps {
  action?: ReactNode
  description?: ReactNode
  homePath?: string
  status?: PageFallbackStatus
  title?: ReactNode
}

const fallbackDefaults: Record<
  PageFallbackStatus,
  { description: string; image: string; title: string }
> = {
  '403': {
    description: '抱歉，你没有权限访问此页面。',
    image: forbiddenSvg,
    title: '访问受限',
  },
  '404': {
    description: '抱歉，你访问的页面不存在。',
    image: notFoundSvg,
    title: '页面不存在',
  },
  '500': {
    description: '抱歉，服务器报告错误。',
    image: internalErrorSvg,
    title: '服务器错误',
  },
  'coming-soon': {
    description: '',
    image: comingSoonSvg,
    title: '敬请期待',
  },
  offline: {
    description: '请检查您的网络连接，然后重试。',
    image: offlineSvg,
    title: '网络异常',
  },
}

export function PageFallback({
  action,
  description,
  homePath = '/dashboard/analytics',
  status = 'coming-soon',
  title,
}: PageFallbackProps) {
  const router = useRouter()
  const defaults = fallbackDefaults[status]
  let defaultAction: ReactNode = null

  if (status === '403' || status === '404') {
    defaultAction = (
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => void router.navigate({ href: homePath })}
        size="large"
      >
        返回首页
      </Button>
    )
  } else if (status === '500' || status === 'offline') {
    defaultAction = (
      <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()} size="large">
        刷新
      </Button>
    )
  }

  return (
    <div className="app-fallback">
      <div
        aria-hidden="true"
        className="app-fallback__illustration"
        dangerouslySetInnerHTML={{ __html: defaults.image }}
      />
      <div className="app-fallback__content">
        {(title ?? defaults.title) ? (
          <div className="app-fallback__title">{title ?? defaults.title}</div>
        ) : null}
        {(description ?? defaults.description) ? (
          <div className="app-fallback__description">{description ?? defaults.description}</div>
        ) : null}
        {action ?? defaultAction}
      </div>
    </div>
  )
}
