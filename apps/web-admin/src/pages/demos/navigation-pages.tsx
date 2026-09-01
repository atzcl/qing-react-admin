import { CloseOutlined } from '@ant-design/icons'
import { useRouter, useRouterState } from '@tanstack/react-router'
import { Button, Card, Form, Input, Radio } from 'antd'
import { useMemo, useState } from 'react'

import { PageContainer } from '~/components/page-container'
import { PageFallback } from '~/components/page-fallback'
import { closeTab, updateMenuBadge, useAppStore } from '~/core/app-store'

interface BadgeFormValues {
  badge: string
  badgeType: 'dot' | 'normal'
  badgeVariant: string
}

const badgeColors = [
  { label: '预设：默认', value: 'default' },
  { label: '预设：关键', value: 'destructive' },
  { label: '预设：主要', value: 'primary' },
  { label: '预设：成功', value: 'success' },
  { label: '自定义', value: 'custom' },
] as const

function badgeInitialValues(pathname: string): BadgeFormValues {
  if (pathname.endsWith('/dot')) return { badge: '', badgeType: 'dot', badgeVariant: 'default' }
  if (pathname.endsWith('/color')) {
    return { badge: 'Hot', badgeType: 'normal', badgeVariant: 'destructive' }
  }
  return { badge: '10', badgeType: 'normal', badgeVariant: 'default' }
}

function BadgePreview({ values }: { values: BadgeFormValues }) {
  const className = `app-menu-badge is-${values.badgeVariant} is-${values.badgeType}`
  return <span className={className}>{values.badgeType === 'normal' ? values.badge : null}</span>
}

export function BadgeDemo() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const appStore = useAppStore()
  const initialValues = useMemo(() => badgeInitialValues(pathname), [pathname])
  const [values, setValues] = useState<BadgeFormValues>(initialValues)

  return (
    <PageContainer description="菜单项上可以显示徽标，这些徽标可以主动更新" title="菜单徽标">
      <Card title="徽标更新">
        <Form
          initialValues={initialValues}
          labelCol={{ style: { width: 100 } }}
          onValuesChange={(_, allValues: BadgeFormValues) => setValues(allValues)}
        >
          <Form.Item label="类型" name="badgeType">
            <Radio.Group buttonStyle="solid" optionType="button">
              <Radio.Button value="dot">点徽标</Radio.Button>
              <Radio.Button value="normal">文字徽标</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="徽标内容" name="badge">
            <Input maxLength={4} placeholder="请输入徽标内容" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="颜色" name="badgeVariant">
            <Radio.Group>
              {badgeColors.map((color) => (
                <Radio key={color.value} value={color.value}>
                  <span className="app-badge-color-option" title={color.label}>
                    <BadgePreview values={{ ...values, badgeVariant: color.value }} />
                  </span>
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item label=" ">
            <Button
              onClick={() =>
                updateMenuBadge(appStore, pathname, {
                  badge: values.badge,
                  badgeType: values.badgeType,
                  badgeVariant: values.badgeVariant,
                })
              }
              type="primary"
            >
              更新徽标
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  )
}

export function ActiveIconDemo() {
  return <PageFallback description="用于菜单激活显示不同的图标" title="激活图标示例" />
}

export function BreadcrumbLateralDemo() {
  const router = useRouter()
  return (
    <PageFallback
      action={
        <Button
          onClick={() => void router.navigate({ href: '/demos/breadcrumb/lateral-detail' })}
          type="primary"
        >
          点击查看详情
        </Button>
      }
      description="点击查看详情，并观察面包屑导航变化"
      title="面包屑导航-平级模式"
    />
  )
}

export function BreadcrumbLateralDetailDemo() {
  const router = useRouter()
  return (
    <PageFallback
      action={<Button onClick={() => router.history.back()}>返回</Button>}
      description="面包屑导航-平级模式-详情页"
      title="注意观察面包屑导航变化"
    />
  )
}

export function BreadcrumbLevelDetailDemo() {
  return <PageFallback description="面包屑导航-层级模式-详情页" title="注意观察面包屑导航变化" />
}

export function HideMenuChildrenParentDemo() {
  const router = useRouter()
  return (
    <PageFallback
      action={
        <Button
          onClick={() =>
            void router.navigate({ href: '/demos/features/hide-menu-children/children' })
          }
          type="link"
        >
          打开子路由
        </Button>
      }
      description="当前路由：HideChildrenInMenuDemo，子菜单不可见"
      title="隐藏子菜单"
    />
  )
}

export function HideMenuChildrenChildDemo() {
  const router = useRouter()
  const appStore = useAppStore()
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <PageFallback
      action={
        <Button
          icon={<CloseOutlined />}
          onClick={() => {
            closeTab(appStore, pathname)
            void router.navigate({ href: '/demos/features/hide-menu-children' })
          }}
          size="large"
        >
          关闭当前标签页
        </Button>
      }
      description="当前路由在菜单中不可见"
      title="被隐藏的子菜单"
    />
  )
}

export function MenuQueryDemo() {
  return <PageFallback description="点击菜单，将会带上参数" title="菜单带参示例" />
}

export function NewWindowDemo() {
  return <PageFallback description="当前页面已在新窗口内打开" title="新窗口打开页面" />
}

export function NestedMenuDemo() {
  return <PageFallback />
}

export function EmbeddedSiteDemo({ src, title }: { src: string; title: string }) {
  return (
    <iframe
      className="app-iframe-page"
      sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-scripts"
      src={src}
      title={title}
    />
  )
}

export function ReactDocumentDemo() {
  return <EmbeddedSiteDemo src="https://zh-hans.react.dev/" title="React" />
}

export function TailwindDocumentDemo() {
  return <EmbeddedSiteDemo src="https://tailwindcss.com/" title="Tailwindcss" />
}
