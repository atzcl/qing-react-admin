import { GlobalOutlined } from '@ant-design/icons'
import { Button, Dropdown } from 'antd'
import type { ReactNode } from 'react'

import { updatePreferences, useAppSelector, useAppStore } from '~/core/app-store'
import { supportedLocaleOptions } from '~/core/i18n'

export function LanguageToggle({ icon }: { icon?: ReactNode }) {
  const appStore = useAppStore()
  const locale = useAppSelector((state) => state.preferences.locale)

  return (
    <Dropdown
      menu={{
        items: supportedLocaleOptions.map((option) => ({
          key: option.value,
          label: option.label,
        })),
        onClick: ({ key }) => {
          const option = supportedLocaleOptions.find((item) => item.value === key)
          if (option) updatePreferences(appStore, { locale: option.value })
        },
        selectable: true,
        selectedKeys: [locale],
      }}
      placement="bottomRight"
      trigger={['click']}
    >
      <Button aria-label="切换语言" icon={icon ?? <GlobalOutlined />} type="text" />
    </Dropdown>
  )
}
