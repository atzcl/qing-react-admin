import { Typography } from 'antd'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  description: ReactNode
  eyebrow?: string
  extra?: ReactNode
  title: string
}

export function PageHeader({ description, eyebrow, extra, title }: PageHeaderProps) {
  return (
    <header className="page-heading">
      <div>
        {eyebrow ? <span className="page-heading__eyebrow">{eyebrow}</span> : null}
        <Typography.Title level={2}>{title}</Typography.Title>
        <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
      </div>
      {extra ? <div className="page-heading__extra">{extra}</div> : null}
    </header>
  )
}
