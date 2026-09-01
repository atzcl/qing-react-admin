import { App, Avatar, Button, Card, Form, Input, Select, Switch } from 'antd'
import { useState } from 'react'

import { getCurrentUser } from '~/core/auth'

type ProfileTab = 'basic' | 'notice' | 'password' | 'security'

const profileTabs: Array<{ label: string; value: ProfileTab }> = [
  { label: '基本设置', value: 'basic' },
  { label: '安全设置', value: 'security' },
  { label: '修改密码', value: 'password' },
  { label: '新消息提醒', value: 'notice' },
]

const securitySettings = [
  {
    description: '当前密码强度：强',
    fieldName: 'accountPassword',
    label: '账户密码',
    value: true,
  },
  {
    description: '已绑定手机：138****8293',
    fieldName: 'securityPhone',
    label: '密保手机',
    value: true,
  },
  {
    description: '未设置密保问题，密保问题可有效保护账户安全',
    fieldName: 'securityQuestion',
    label: '密保问题',
    value: true,
  },
  {
    description: '已绑定邮箱：ant***sign.com',
    fieldName: 'securityEmail',
    label: '备用邮箱',
    value: true,
  },
  {
    description: '未绑定 MFA 设备，绑定后，可以进行二次确认',
    fieldName: 'securityMfa',
    label: 'MFA 设备',
    value: false,
  },
]

const notificationSettings = [
  {
    description: '其他用户的消息将以站内信的形式通知',
    fieldName: 'accountPassword',
    label: '账户密码',
    value: true,
  },
  {
    description: '系统消息将以站内信的形式通知',
    fieldName: 'systemMessage',
    label: '系统消息',
    value: true,
  },
  {
    description: '待办任务将以站内信的形式通知',
    fieldName: 'todoTask',
    label: '待办任务',
    value: true,
  },
]

function BaseSettings() {
  const { message } = App.useApp()
  const user = getCurrentUser()

  return (
    <Form
      className="profile-form profile-form--base"
      initialValues={{
        introduction: '人生就像一盒巧克力，你永远不知道下一块是什么味道。',
        realName: user?.realName ?? 'Super Admin',
        roles: user?.roles ?? ['super'],
        username: user?.username ?? 'super',
      }}
      labelCol={{ flex: '88px' }}
      onFinish={() => void message.success('基本信息更新成功')}
      wrapperCol={{ flex: 1 }}
    >
      <Form.Item label="姓名" name="realName">
        <Input />
      </Form.Item>
      <Form.Item label="用户名" name="username">
        <Input />
      </Form.Item>
      <Form.Item label="角色" name="roles">
        <Select
          mode="tags"
          options={[
            { label: '管理员', value: 'super' },
            { label: '用户', value: 'user' },
            { label: '测试', value: 'test' },
          ]}
        />
      </Form.Item>
      <Form.Item label="个人简介" name="introduction">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item label={null}>
        <Button htmlType="submit" type="primary">
          更新基本信息
        </Button>
      </Form.Item>
    </Form>
  )
}

function SettingList({
  items,
}: {
  items: Array<{ description: string; fieldName: string; label: string; value: boolean }>
}) {
  const [values, setValues] = useState(() =>
    Object.fromEntries(items.map((item) => [item.fieldName, item.value])),
  )

  return (
    <div className="profile-setting-list">
      {items.map((item) => (
        <label className="profile-setting-row" key={item.fieldName}>
          <span>
            <strong>{item.label}</strong>
            <small>{item.description}</small>
          </span>
          <Switch
            checked={values[item.fieldName] ?? false}
            onChange={(checked) =>
              setValues((current) => ({ ...current, [item.fieldName]: checked }))
            }
          />
        </label>
      ))}
    </div>
  )
}

function PasswordSettings() {
  const { message } = App.useApp()

  return (
    <Form
      className="profile-form profile-form--password"
      labelCol={{ flex: '130px' }}
      onFinish={() => void message.success('密码修改成功')}
      wrapperCol={{ flex: 1 }}
    >
      <Form.Item
        label="旧密码"
        name="oldPassword"
        rules={[{ message: '请输入旧密码', required: true }]}
      >
        <Input.Password placeholder="请输入旧密码" />
      </Form.Item>
      <Form.Item
        extra="使用 8 个或更多字符，混合字母、数字和符号"
        label="新密码"
        name="newPassword"
        rules={[{ message: '请输入新密码', min: 1, required: true }]}
      >
        <Input.Password placeholder="请输入新密码" />
      </Form.Item>
      <Form.Item
        dependencies={['newPassword']}
        extra="使用 8 个或更多字符，混合字母、数字和符号"
        label="确认密码"
        name="confirmPassword"
        rules={[
          { message: '请再次输入新密码', required: true },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) return Promise.resolve()
              return Promise.reject(new Error('两次输入的密码不一致'))
            },
          }),
        ]}
      >
        <Input.Password placeholder="请再次输入新密码" />
      </Form.Item>
      <Form.Item label={null}>
        <Button htmlType="submit" type="primary">
          更新密码
        </Button>
      </Form.Item>
    </Form>
  )
}

function ProfileContent({ activeTab }: { activeTab: ProfileTab }) {
  if (activeTab === 'security') return <SettingList items={securitySettings} />
  if (activeTab === 'password') return <PasswordSettings />
  if (activeTab === 'notice') return <SettingList items={notificationSettings} />
  return <BaseSettings />
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('basic')
  const user = getCurrentUser()

  return (
    <main className="page profile-page">
      <Card className="profile-sidebar" variant="borderless">
        <div className="profile-identity">
          <Avatar size={80} src={user?.avatar ?? '/favicon.svg'} />
          <strong>{user?.realName ?? 'Super Admin'}</strong>
          <span>{user?.username ?? 'super'}</span>
        </div>
        <div className="profile-separator" />
        <nav aria-label="个人中心设置" className="profile-navigation">
          {profileTabs.map((tab) => (
            <button
              className={activeTab === tab.value ? 'is-active' : ''}
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </Card>
      <Card className="profile-content" variant="borderless">
        <ProfileContent activeTab={activeTab} />
      </Card>
    </main>
  )
}
