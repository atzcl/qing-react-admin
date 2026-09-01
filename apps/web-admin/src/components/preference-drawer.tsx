import {
  CopyOutlined,
  DeleteOutlined,
  PushpinFilled,
  PushpinOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { App, Button, Drawer, Segmented, Tooltip } from 'antd'
import { useState } from 'react'

import {
  defaultPreferences,
  resetPreferences,
  updatePreferences,
  useAppSelector,
  useAppStore,
} from '~/core/app-store'
import { logout as clearAuthSession } from '~/core/auth'
import { useTranslation } from '~/core/use-translation'

import { AppearancePreferences } from './preferences/appearance-preferences'
import { GeneralPreferences } from './preferences/general-preferences'
import { LayoutPreferences } from './preferences/layout-preferences'
import { ShortcutPreferences } from './preferences/shortcut-preferences'
import { ShowcasePreferences } from './preferences/showcase-preferences'

interface PreferenceDrawerProps {
  onClose: () => void
  open: boolean
}

export function PreferenceDrawer({ onClose, open }: PreferenceDrawerProps) {
  const { message } = App.useApp()
  const appStore = useAppStore()
  const preferences = useAppSelector((state) => state.preferences)
  const t = useTranslation()
  const [activeTab, setActiveTab] = useState('appearance')
  const hasChanges = JSON.stringify(preferences) !== JSON.stringify(defaultPreferences)
  const activeContent = {
    appearance: <AppearancePreferences />,
    general: <GeneralPreferences />,
    layout: <LayoutPreferences />,
    'showcase-extension': <ShowcasePreferences />,
    shortcuts: <ShortcutPreferences />,
  }[activeTab]

  return (
    <Drawer
      className="preference-drawer"
      extra={
        <div className="preference-drawer__actions">
          <Tooltip title="恢复默认设置">
            <Button
              disabled={!hasChanges}
              icon={<ReloadOutlined />}
              onClick={() => resetPreferences(appStore)}
              type="text"
            />
          </Tooltip>
          <Tooltip
            title={
              preferences.enableStickyPreferencesNavigationBar ? '取消固定导航栏' : '固定导航栏'
            }
          >
            <Button
              icon={
                preferences.enableStickyPreferencesNavigationBar ? (
                  <PushpinFilled />
                ) : (
                  <PushpinOutlined />
                )
              }
              onClick={() =>
                updatePreferences(appStore, {
                  enableStickyPreferencesNavigationBar:
                    !preferences.enableStickyPreferencesNavigationBar,
                })
              }
              type="text"
            />
          </Tooltip>
        </div>
      }
      footer={
        <div className="preference-drawer__footer">
          {preferences.enableCopyPreferences ? (
            <Button
              disabled={!hasChanges}
              icon={<CopyOutlined />}
              onClick={() => {
                void navigator.clipboard.writeText(JSON.stringify(preferences, null, 2))
                void message.success('复制偏好设置成功')
              }}
              type="primary"
            >
              复制偏好设置
            </Button>
          ) : null}
          <Button
            disabled={!hasChanges}
            icon={<DeleteOutlined />}
            onClick={() => {
              resetPreferences(appStore)
              window.localStorage.clear()
              clearAuthSession()
              window.location.assign('/auth/login')
            }}
          >
            清理缓存并退出登录
          </Button>
        </div>
      }
      onClose={onClose}
      open={open}
      placement="right"
      size={400}
      title={
        <span className="drawer-title">
          {t('preferences.title')}
          <small>自定义偏好设置</small>
        </span>
      }
    >
      <Segmented
        block
        className={
          preferences.enableStickyPreferencesNavigationBar
            ? 'preference-tabs is-sticky'
            : 'preference-tabs'
        }
        onChange={setActiveTab}
        options={[
          { label: '外观', value: 'appearance' },
          { label: '布局', value: 'layout' },
          { label: '快捷键', value: 'shortcuts' },
          { label: '通用', value: 'general' },
          { label: '拓展', value: 'showcase-extension' },
        ]}
        size="small"
        value={activeTab}
      />
      {activeContent}
    </Drawer>
  )
}
