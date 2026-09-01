import { useRouter } from '@tanstack/react-router'
import { Button, Card, Input, Space } from 'antd'
import { useEffect, useState } from 'react'

import { PageContainer } from '~/components/page-container'
import { useAdminPage } from '~/core/admin-page-context'
import {
  closeAllTabs,
  closeOtherTabs,
  closeTab,
  closeTabsToLeft,
  closeTabsToRight,
  refreshTab,
  resetTabTitle,
  setTabTitle,
  useAppSelector,
  useAppStore,
} from '~/core/app-store'

export function FeatureTabsDemo() {
  const router = useRouter()
  const appStore = useAppStore()
  const tabs = useAppSelector((state) => state.tabs)
  const [newTabTitle, setNewTabTitle] = useState('')
  const pathname = '/demos/features/tabs'

  async function closeCurrent() {
    const currentIndex = tabs.findIndex((tab) => tab.path === pathname)
    const fallback = tabs[currentIndex - 1]?.path ?? '/dashboard/analytics'
    closeTab(appStore, pathname)
    await router.navigate({ href: fallback })
  }

  async function openTabWithParams(id: number) {
    const target = `/demos/features/detail/${id}`
    const detailTabs = appStore.state.tabs.filter((tab) =>
      tab.path.startsWith('/demos/features/detail/'),
    )
    if (!detailTabs.some((tab) => tab.path === target) && detailTabs.length >= 3) {
      const oldest = detailTabs[0]
      if (oldest) closeTab(appStore, oldest.path)
    }
    await router.navigate({ href: target })
  }

  function reset() {
    setNewTabTitle('')
    resetTabTitle(appStore, pathname)
  }

  return (
    <PageContainer description="用于需要操作标签页的场景" title="标签页">
      <Card className="app-demo-card" title="打开/关闭标签页">
        <div className="app-demo-card-description">
          如果标签页存在，直接跳转切换。如果标签页不存在，则打开新的标签页。
        </div>
        <Space size={12} wrap>
          <Button onClick={() => void router.navigate({ href: '/profile' })} type="primary">
            打开 &quot;个人中心&quot; 标签页
          </Button>
          <Button onClick={() => closeTab(appStore, '/profile')} type="primary">
            关闭 &quot;个人中心&quot; 标签页
          </Button>
        </Space>
      </Card>

      <Card className="app-demo-card" title="标签页操作">
        <div className="app-demo-card-description">用于动态控制标签页的各种操作</div>
        <Space size={12} wrap>
          <Button onClick={() => void closeCurrent()} type="primary">
            关闭当前标签页
          </Button>
          <Button onClick={() => closeTabsToLeft(appStore, pathname)} type="primary">
            关闭左侧标签页
          </Button>
          <Button onClick={() => closeTabsToRight(appStore, pathname)} type="primary">
            关闭右侧标签页
          </Button>
          <Button
            onClick={() => {
              closeAllTabs(appStore)
              void router.navigate({ href: '/dashboard/analytics' })
            }}
            type="primary"
          >
            关闭所有标签页
          </Button>
          <Button onClick={() => closeOtherTabs(appStore, pathname)} type="primary">
            关闭其他标签页
          </Button>
          <Button onClick={() => refreshTab(appStore, pathname)} type="primary">
            刷新当前标签页
          </Button>
        </Space>
      </Card>

      <Card className="app-demo-card" title="动态标题">
        <div className="app-demo-card-description">该操作不会影响页面标题，仅修改Tab标题</div>
        <Space size={12} wrap>
          <Input
            onChange={(event) => setNewTabTitle(event.target.value)}
            placeholder="请输入新标题"
            value={newTabTitle}
          />
          <Button onClick={() => setTabTitle(appStore, pathname, newTabTitle)} type="primary">
            修改
          </Button>
          <Button onClick={reset}>重置</Button>
        </Space>
      </Card>

      <Card className="app-demo-card" title="最大打开数量">
        <div className="app-demo-card-description">
          限制带参数的tab打开的最大数量，由 `route.meta.maxNumOfOpenTab` 控制
        </div>
        <Space size={12} wrap>
          {Array.from({ length: 5 }, (_, index) => index + 1).map((item) => (
            <Button key={item} onClick={() => void openTabWithParams(item)} type="primary">
              打开{item}详情页
            </Button>
          ))}
        </Space>
      </Card>
    </PageContainer>
  )
}

export function FeatureTabDetailDemo() {
  const { params, pathname } = useAdminPage()
  const appStore = useAppStore()
  const index = params.id ?? '-1'

  useEffect(() => {
    setTabTitle(appStore, pathname, `No.${index} - 详情信息`)
  }, [appStore, index, pathname])

  return (
    <PageContainer description={`${index} - 详情页内容在此`} title={`标签页${index}详情页`}>
      <span />
    </PageContainer>
  )
}
