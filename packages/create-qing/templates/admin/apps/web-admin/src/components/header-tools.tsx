import { DownOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { App, Avatar, Badge, Dropdown, Input, Modal, Tag } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { useAppSelector, useAppStore } from '~/core/app-store'
import { logout as clearAuthSession } from '~/core/auth'
import {
  clearLockScreenState,
  persistLockScreenState,
  readLockScreenState,
} from '~/core/lock-screen'
import type { AppUser } from '~/core/types'

import { ButtonList } from './button-list'
import {
  getHeaderWidget,
  getWidgetRenderPosition,
  headerWidgetByKey,
  isWidgetEnabled,
} from './header-widgets'
import type { HeaderWidgetContext } from './header-widgets'

interface HeaderToolsProps {
  onNavigate: (path: string) => void
  onOpenPreferences: () => void
  onOpenSearch: () => void
  user: AppUser
}

function performLogout() {
  clearLockScreenState()
  clearAuthSession()
  window.location.assign('/auth/login')
}

function LockScreen({
  lockPassword,
  onUnlock,
  user,
}: {
  lockPassword: string
  onUnlock: () => void
  user: AppUser
}) {
  const { message } = App.useApp()
  const [now, setNow] = useState(() => new Date())
  const [password, setPassword] = useState('')
  const [showUnlockForm, setShowUnlockForm] = useState(false)
  const avatar = user.avatar || '/favicon.svg'

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  function submit() {
    if (password === lockPassword) {
      onUnlock()
      return
    }
    void message.error('密码错误')
  }

  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const meridiem = now.getHours() < 12 ? '上午' : '下午'
  const date = new Intl.DateTimeFormat('zh-CN', {
    day: '2-digit',
    month: '2-digit',
    weekday: 'long',
    year: 'numeric',
  }).format(now)

  return createPortal(
    <div aria-label="锁屏" aria-modal="true" className="lock-screen" role="dialog">
      {!showUnlockForm ? (
        <>
          <button
            className="lock-screen__unlock-trigger"
            onClick={() => setShowUnlockForm(true)}
            type="button"
          >
            <LockOutlined />
            <span>解锁</span>
          </button>
          <div className="lock-screen__clock">
            <div>
              <small>{meridiem}</small>
              {hour}
            </div>
            <div>{minute}</div>
          </div>
        </>
      ) : (
        <div className="lock-screen__form">
          <Avatar size={80} src={avatar} />
          <Input.Password
            autoFocus
            onChange={(event) => setPassword(event.target.value)}
            onPressEnter={submit}
            placeholder="请输入锁屏密码"
            value={password}
          />
          <ButtonList
            className="lock-screen__actions"
            list={[
              { block: true, key: 'unlock', label: '进入系统', onClick: submit, type: 'primary' },
              {
                block: true,
                key: 'logout',
                label: '返回登录',
                onClick: performLogout,
                type: 'text',
              },
              {
                block: true,
                key: 'back',
                label: '返回',
                onClick: () => setShowUnlockForm(false),
                type: 'text',
              },
            ]}
          />
        </div>
      )}
      <div className="lock-screen__date">
        {showUnlockForm ? (
          <strong>
            {hour}:{minute} <small>{meridiem}</small>
          </strong>
        ) : null}
        <span>{date}</span>
      </div>
    </div>,
    document.body,
  )
}

export function HeaderTools({
  onNavigate,
  onOpenPreferences,
  onOpenSearch,
  user,
}: HeaderToolsProps) {
  const appStore = useAppStore()
  const preferences = useAppSelector((state) => state.preferences)
  const { message } = App.useApp()
  const [lockSetupOpen, setLockSetupOpen] = useState(false)
  const [lockState, setLockState] = useState(() => readLockScreenState(user.username))
  const [lockPassword, setLockPassword] = useState('')
  const [logoutOpen, setLogoutOpen] = useState(false)
  const avatar = user.avatar || '/favicon.svg'
  const locked = lockState !== null

  const openLockSetup = useCallback(() => {
    setLockPassword('')
    setLockSetupOpen(true)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!preferences.shortcutKeysEnable) return
      if (
        preferences.shortcutKeysSearch &&
        (event.metaKey || event.ctrlKey) &&
        event.key.toLocaleLowerCase() === 'k'
      ) {
        event.preventDefault()
        onOpenSearch()
      }
      if (
        preferences.shortcutKeysLockScreen &&
        event.altKey &&
        event.key.toLocaleLowerCase() === 'l' &&
        preferences.showLockScreen
      ) {
        event.preventDefault()
        openLockSetup()
      }
      if (preferences.shortcutKeysLogout && event.altKey && event.key.toLocaleLowerCase() === 'q') {
        event.preventDefault()
        setLogoutOpen(true)
      }
      if (preferences.shortcutKeysEscape && event.key === 'Escape') {
        setLockSetupOpen(false)
        setLogoutOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onOpenSearch, openLockSetup, preferences])

  async function toggleFullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await document.documentElement.requestFullscreen()
  }

  const widgetContext: HeaderWidgetContext = {
    appStore,
    onLock: openLockSetup,
    onLogout: () => setLogoutOpen(true),
    onNavigate,
    onOpenPreferences,
    onOpenSearch,
    preferences,
    toggleFullscreen,
  }
  const orderedWidgets = preferences.widgetOrder.flatMap((key) => {
    const definition = headerWidgetByKey.get(key)
    return definition ? [definition] : []
  })
  const userDropdownWidgets = orderedWidgets
    .filter(
      (definition) =>
        isWidgetEnabled(definition, preferences) &&
        getWidgetRenderPosition(definition, preferences) === 'user-dropdown',
    )
    .map((definition) => ({
      danger: definition.key === 'logoutBtn',
      disabled: !definition.run,
      icon: definition.icon(widgetContext),
      key: `widget:${definition.key}`,
      label: definition.label,
    }))

  const headerItems = orderedWidgets.flatMap((definition) =>
    isWidgetEnabled(definition, preferences) &&
    getWidgetRenderPosition(definition, preferences) === 'header'
      ? [
          {
            key: definition.key,
            render: (
              <span className={`header-tool header-tool--${definition.key}`}>
                {definition.renderHeader(widgetContext)}
              </span>
            ),
          },
        ]
      : [],
  )

  return (
    <>
      <ButtonList
        className="header-tools"
        gap={0}
        list={[
          ...headerItems,
          {
            key: 'user-menu',
            render: (
              <Dropdown
                destroyOnHidden
                menu={{
                  items: [
                    {
                      disabled: true,
                      key: 'account',
                      label: (
                        <div className="user-dropdown-summary">
                          <Badge color="green" dot offset={[-3, 38]}>
                            <Avatar size={44} src={avatar} />
                          </Badge>
                          <span>
                            <strong>
                              {user.realName}
                              <Tag color="blue" variant="filled">
                                Super
                              </Tag>
                            </strong>
                            <small>在线 · {user.email}</small>
                          </span>
                        </div>
                      ),
                    },
                    { type: 'divider' },
                    { icon: <UserOutlined />, key: 'profile', label: '个人中心' },
                    ...(userDropdownWidgets.length > 0 ? [{ type: 'divider' as const }] : []),
                    ...userDropdownWidgets,
                  ],
                  onClick: ({ key }) => {
                    if (key.startsWith('widget:')) {
                      const definition = getHeaderWidget(key.slice('widget:'.length))
                      definition?.run?.(widgetContext)
                    }
                    if (key === 'profile') onNavigate('/profile')
                  },
                }}
                placement="bottomRight"
                trigger={['click']}
              >
                <button aria-label="用户菜单" className="user-trigger" type="button">
                  <Avatar size={30} src={avatar}>
                    {user.realName.slice(0, 1)}
                  </Avatar>
                  <span className="user-trigger__meta">
                    <strong>{user.realName}</strong>
                    <small>{user.roles.includes('super') ? '超级管理员' : '管理员'}</small>
                  </span>
                  <DownOutlined className="user-trigger__chevron" />
                </button>
              </Dropdown>
            ),
          },
        ]}
      />

      <Modal
        cancelText="取消"
        centered
        okButtonProps={{ disabled: lockPassword.length === 0 }}
        okText="锁定屏幕"
        onCancel={() => setLockSetupOpen(false)}
        onOk={() => {
          if (!persistLockScreenState(user.username, lockPassword)) {
            void message.error('锁屏状态保存失败，请检查浏览器存储权限')
            return
          }
          setLockSetupOpen(false)
          setLockState({ password: lockPassword, username: user.username })
          setLockPassword('')
        }}
        open={lockSetupOpen}
        title="锁屏"
      >
        <div className="lock-screen-setup">
          <Avatar size={80} src={avatar} />
          <strong>{user.realName}</strong>
          <Input.Password
            maxLength={72}
            onChange={(event) => setLockPassword(event.target.value)}
            placeholder="请输入锁屏密码"
            value={lockPassword}
          />
        </div>
      </Modal>

      <Modal
        cancelText="取消"
        centered
        okButtonProps={{ danger: true }}
        okText="确认"
        onCancel={() => setLogoutOpen(false)}
        onOk={performLogout}
        open={logoutOpen}
        title="提示"
      >
        确定要退出登录吗？
      </Modal>

      {locked ? (
        <LockScreen
          lockPassword={lockState?.password ?? ''}
          onUnlock={() => {
            clearLockScreenState()
            setLockState(null)
          }}
          user={user}
        />
      ) : null}
    </>
  )
}
