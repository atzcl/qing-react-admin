import { Button, Card, Space, Typography } from 'antd'

import { PageContainer } from '~/components/page-container'
import { PageFallback } from '~/components/page-fallback'
import { updatePreferences, useAppSelector, useAppStore } from '~/core/app-store'
import { getCurrentUser, login } from '~/core/auth'
import type { UserRole } from '~/core/types'

const accountByRole: Record<UserRole, 'admin' | 'super' | 'user'> = {
  admin: 'admin',
  super: 'super',
  user: 'user',
}

function currentRole() {
  return getCurrentUser()?.roles[0] ?? 'user'
}

function changeAccount(role: UserRole) {
  if (currentRole() === role) return
  login({ password: '123456', remember: true, username: accountByRole[role] })
  window.location.reload()
}

function AccountButtons() {
  const role = currentRole()
  return (
    <Space size={16} wrap>
      {(['super', 'admin', 'user'] as const).map((item) => (
        <Button
          key={item}
          onClick={() => changeAccount(item)}
          type={role === item ? 'primary' : 'default'}
        >
          切换为 {item === 'super' ? 'Super' : item === 'admin' ? 'Admin' : 'User'} 账号
        </Button>
      ))}
    </Space>
  )
}

export function AccessPageControlDemo() {
  const appStore = useAppStore()
  const accessMode = useAppSelector((state) => state.preferences.accessMode)

  function toggleAccessMode() {
    updatePreferences(appStore, {
      accessMode: accessMode === 'frontend' ? 'backend' : 'frontend',
    })
    login({ password: '123456', remember: true, username: 'super' })
    window.location.reload()
  }

  return (
    <PageContainer
      description="切换不同的账号，观察左侧菜单变化。"
      title={`${accessMode === 'frontend' ? '前端' : '后端'}页面访问权限演示`}
    >
      <Card className="app-demo-card" title="权限模式">
        <Space size={16} wrap>
          <Typography.Text strong>当前权限模式:</Typography.Text>
          <Typography.Text type="success">
            {accessMode === 'frontend' ? '前端权限控制' : '后端权限控制'}
          </Typography.Text>
          <Button onClick={toggleAccessMode} type="primary">
            切换为{accessMode === 'frontend' ? '后端' : '前端'}权限模式
          </Button>
        </Space>
      </Card>
      <Card title="账号切换">
        <AccountButtons />
      </Card>
    </PageContainer>
  )
}

interface AccessButtonsProps {
  kind: 'code' | 'role'
}

function AccessButtons({ kind }: AccessButtonsProps) {
  const role = currentRole()
  const labels =
    kind === 'code'
      ? [
          { roles: ['super'] as UserRole[], text: 'Super 账号可见 ["AC_100100"]' },
          { roles: ['admin'] as UserRole[], text: 'Admin 账号可见 ["AC_100030"]' },
          { roles: ['user'] as UserRole[], text: 'User 账号可见 ["AC_1000001"]' },
          {
            roles: ['super', 'admin'] as UserRole[],
            text: 'Super & Admin 账号可见 ["AC_100100","AC_100030"]',
          },
        ]
      : [
          { roles: ['super'] as UserRole[], text: 'Super 角色可见' },
          { roles: ['admin'] as UserRole[], text: 'Admin 角色可见' },
          { roles: ['user'] as UserRole[], text: 'User 角色可见' },
          { roles: ['super', 'admin'] as UserRole[], text: 'Super & Admin 角色可见' },
        ]

  return (
    <Space wrap>
      {labels
        .filter((item) => item.roles.includes(role))
        .map((item) => (
          <Button key={item.text}>{item.text}</Button>
        ))}
    </Space>
  )
}

export function AccessButtonControlDemo() {
  const accessMode = useAppSelector((state) => state.preferences.accessMode)
  const role = currentRole()

  return (
    <PageContainer
      description="切换不同的账号，观察按钮变化。"
      title={`${accessMode === 'frontend' ? '前端' : '后端'}按钮访问权限演示`}
    >
      <Card
        className="app-demo-card"
        title={
          <Space>
            <span>当前角色:</span>
            <Typography.Text className="app-access-role">{role}</Typography.Text>
          </Space>
        }
      >
        <AccountButtons />
      </Card>
      <Card className="app-demo-card" title="组件形式控制 - 权限码">
        <AccessButtons kind="code" />
      </Card>
      {accessMode === 'frontend' ? (
        <Card className="app-demo-card" title="组件形式控制 - 角色">
          <AccessButtons kind="role" />
        </Card>
      ) : null}
      <Card className="app-demo-card" title="函数形式控制">
        <AccessButtons kind="code" />
      </Card>
      <Card className="app-demo-card" title="指令方式 - 权限码">
        <AccessButtons kind="code" />
      </Card>
      {accessMode === 'frontend' ? (
        <Card title="指令方式 - 角色">
          <AccessButtons kind="role" />
        </Card>
      ) : null}
    </PageContainer>
  )
}

export function AccessMenuVisible403Demo() {
  return <PageFallback description="当前页面用户不可见，会被重定向到403页面" title="页面访问测试" />
}

export function AccessSuperVisibleDemo() {
  return <PageFallback description="当前页面仅 Super 账号可见" title="页面访问测试" />
}

export function AccessAdminVisibleDemo() {
  return <PageFallback description="当前页面仅 Admin 账号可见" title="页面访问测试" />
}

export function AccessUserVisibleDemo() {
  return <PageFallback description="当前页面仅 User 账号可见" title="页面访问测试" />
}
