import { SearchOutlined } from '@ant-design/icons'
import { Button, Empty, Input, Modal } from 'antd'
import { useState } from 'react'

import { useAppSelector } from '~/core/app-store'
import { adminPages, canAccessPage, getPageTitle } from '~/core/page-registry'
import type { AppUser } from '~/core/types'
import { useTranslation } from '~/core/use-translation'

interface GlobalSearchProps {
  onNavigate: (path: string) => void
  onOpenChange: (open: boolean) => void
  open: boolean
  user: AppUser
}

export function GlobalSearch({ onNavigate, onOpenChange, open, user }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const locale = useAppSelector((state) => state.preferences.locale)
  const t = useTranslation()
  const results = adminPages.filter((page) => {
    if (!canAccessPage(page, user.roles)) return false
    const title = getPageTitle(page, locale) ?? t(page.titleKey)
    const value = `${title} ${page.path}`.toLocaleLowerCase()
    return value.includes(query.trim().toLocaleLowerCase())
  })

  function close() {
    setQuery('')
    onOpenChange(false)
  }

  return (
    <Modal
      className="global-search-modal"
      closable={false}
      footer={null}
      onCancel={close}
      open={open}
    >
      <Input
        allowClear
        autoFocus
        className="global-search-input"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="搜索页面、菜单和路径…"
        prefix={<SearchOutlined />}
        size="large"
        variant="borderless"
        value={query}
      />
      <div className="global-search-results">
        {results.length ? (
          results.slice(0, 8).map((page) => {
            const Icon = page.icon
            const title = getPageTitle(page, locale) ?? t(page.titleKey)
            return (
              <Button
                className="global-search-result"
                {...(Icon ? { icon: <Icon /> } : {})}
                key={page.path}
                onClick={() => {
                  close()
                  onNavigate(page.path)
                }}
                type="text"
              >
                <span>{title}</span>
                <small>{page.path}</small>
              </Button>
            )
          })
        ) : (
          <Empty description="没有匹配的页面" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
      <footer className="global-search-footer">
        <span>↵ 打开</span>
        <span>Esc 关闭</span>
      </footer>
    </Modal>
  )
}
