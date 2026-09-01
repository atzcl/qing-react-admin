import { BellOutlined, CheckCircleOutlined, CloseOutlined, MailOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Empty, Popover, Tooltip } from 'antd'
import { useState } from 'react'

import { ButtonList } from './button-list'

interface NotificationItem {
  avatar: string
  date: string
  id: number
  isRead: boolean
  link?: string
  message: string
  title: string
}

interface NotificationPopupProps {
  onNavigate: (path: string) => void
}

const initialNotifications: NotificationItem[] = [
  {
    avatar: 'https://avatar.vercel.sh/vercel.svg?text=VB',
    date: '3小时前',
    id: 1,
    isRead: true,
    message: '描述信息描述信息描述信息',
    title: '收到了 14 份新周报',
  },
  {
    avatar: 'https://avatar.vercel.sh/1',
    date: '刚刚',
    id: 2,
    isRead: false,
    message: '描述信息描述信息描述信息',
    title: '朱偏右 回复了你',
  },
  {
    avatar: 'https://avatar.vercel.sh/1',
    date: '2024-01-01',
    id: 3,
    isRead: false,
    message: '描述信息描述信息描述信息',
    title: '曲丽丽 评论了你',
  },
  {
    avatar: 'https://avatar.vercel.sh/satori',
    date: '1天前',
    id: 4,
    isRead: false,
    message: '描述信息描述信息描述信息',
    title: '代办提醒',
  },
  {
    avatar: 'https://avatar.vercel.sh/satori',
    date: '1天前',
    id: 5,
    isRead: false,
    link: '/dashboard/workspace',
    message: '描述信息描述信息描述信息',
    title: '跳转Workspace示例',
  },
  {
    avatar: 'https://avatar.vercel.sh/satori',
    date: '1天前',
    id: 6,
    isRead: false,
    link: 'https://react.dev',
    message: '描述信息描述信息描述信息',
    title: '跳转外部链接示例',
  },
]

export function NotificationPopup({ onNavigate }: NotificationPopupProps) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [open, setOpen] = useState(false)
  const unreadCount = notifications.filter((item) => !item.isRead).length
  const hasUnread = unreadCount > 0

  const content = (
    <div className="notification-popup">
      <header>
        <span className="notification-popup__heading">
          <strong>消息通知</strong>
          <Badge count={unreadCount} overflowCount={99} showZero />
        </span>
        <ButtonList
          gap={0}
          list={[
            {
              key: 'read-all',
              render: (
                <Tooltip title="全部标为已读">
                  <Button
                    aria-label="全部标为已读"
                    disabled={!hasUnread}
                    icon={<MailOutlined />}
                    onClick={() =>
                      setNotifications((items) => items.map((item) => ({ ...item, isRead: true })))
                    }
                    size="small"
                    type="text"
                  />
                </Tooltip>
              ),
            },
          ]}
        />
      </header>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((item) => (
            <li
              className={item.isRead ? undefined : 'is-unread'}
              key={item.id}
              onClick={() => {
                if (!item.link) return
                if (item.link.startsWith('http')) {
                  window.open(item.link, '_blank', 'noopener,noreferrer')
                } else {
                  onNavigate(item.link)
                }
                setOpen(false)
              }}
            >
              <Avatar size={34} src={item.avatar} />
              <span className="notification-popup__content">
                <strong>{item.title}</strong>
                <small>{item.message}</small>
              </span>
              <span className="notification-popup__meta">
                <time>{item.date}</time>
                <ButtonList
                  className="notification-popup__actions"
                  gap={0}
                  list={[
                    {
                      key: item.isRead ? 'delete' : 'read',
                      render: item.isRead ? (
                        <Tooltip title="删除">
                          <Button
                            aria-label={`删除 ${item.title}`}
                            danger
                            icon={<CloseOutlined />}
                            onClick={(event) => {
                              event.stopPropagation()
                              setNotifications((items) =>
                                items.filter((entry) => entry.id !== item.id),
                              )
                            }}
                            size="small"
                            type="text"
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip title="标为已读">
                          <Button
                            aria-label={`将 ${item.title} 标为已读`}
                            icon={<CheckCircleOutlined />}
                            onClick={(event) => {
                              event.stopPropagation()
                              setNotifications((items) =>
                                items.map((entry) =>
                                  entry.id === item.id ? { ...entry, isRead: true } : entry,
                                ),
                              )
                            }}
                            size="small"
                            type="text"
                          />
                        </Tooltip>
                      ),
                    },
                  ]}
                />
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
      <footer>
        <span>{unreadCount > 0 ? `${unreadCount} 条未读` : '已全部读完'}</span>
        <ButtonList
          gap={1}
          list={[
            {
              disabled: notifications.length === 0,
              key: 'clear',
              label: '清空',
              onClick: () => setNotifications([]),
              size: 'small',
              type: 'text',
            },
            {
              key: 'all',
              label: '查看全部',
              onClick: () => setOpen(false),
              size: 'small',
              type: 'primary',
            },
          ]}
        />
      </footer>
    </div>
  )

  return (
    <Popover
      arrow={false}
      classNames={{ content: 'notification-popover-body' }}
      content={content}
      onOpenChange={setOpen}
      open={open}
      placement="bottomRight"
      styles={{ container: { overflow: 'hidden', padding: 0 } }}
      trigger="click"
    >
      <Badge dot={hasUnread} offset={[-6, 7]}>
        <Button aria-label="通知" icon={<BellOutlined />} type="text" />
      </Badge>
    </Popover>
  )
}
