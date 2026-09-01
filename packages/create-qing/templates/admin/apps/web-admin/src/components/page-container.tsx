import type { ReactNode } from 'react'

import { useAdminPage } from '~/core/admin-page-context'
import { useAppSelector } from '~/core/app-store'
import { getAdminPage, getPageTitle } from '~/core/page-registry'
import { useTranslation } from '~/core/use-translation'

interface PageContainerProps {
  autoHeader?: boolean
  children: ReactNode
  contentClassName?: string
  description?: ReactNode
  extra?: ReactNode
  footer?: ReactNode
  title?: ReactNode
}

export function PageContainer({
  autoHeader = true,
  children,
  contentClassName,
  description,
  extra,
  footer,
  title,
}: PageContainerProps) {
  const { definitionPath } = useAdminPage()
  const locale = useAppSelector((state) => state.preferences.locale)
  const t = useTranslation()
  const definition = getAdminPage(definitionPath)
  const metadataDescription =
    definition?.description?.[locale] ??
    (definition?.descriptionKey ? t(definition.descriptionKey) : undefined)
  const resolvedDescription = description ?? (autoHeader ? metadataDescription : undefined)
  const resolvedTitle =
    title ??
    (autoHeader && metadataDescription && definition
      ? (getPageTitle(definition, locale) ?? t(definition.titleKey))
      : undefined)
  const hasHeader =
    resolvedTitle !== undefined || resolvedDescription !== undefined || extra !== undefined

  return (
    <div className="app-page">
      {hasHeader ? (
        <header className="app-page__header">
          <div className="app-page__heading">
            {resolvedTitle !== undefined ? (
              <div className="app-page__title">{resolvedTitle}</div>
            ) : null}
            {resolvedDescription !== undefined ? (
              <div className="app-page__description">{resolvedDescription}</div>
            ) : null}
          </div>
          {extra !== undefined ? <div className="app-page__extra">{extra}</div> : null}
        </header>
      ) : null}
      <div
        className={contentClassName ? `app-page__content ${contentClassName}` : 'app-page__content'}
      >
        {children}
      </div>
      {footer !== undefined ? <footer className="app-page__footer">{footer}</footer> : null}
    </div>
  )
}
