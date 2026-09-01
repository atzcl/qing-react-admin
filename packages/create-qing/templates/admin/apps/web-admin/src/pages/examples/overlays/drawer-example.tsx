import { App, Button, Card, Drawer, Flex, Form, Input, Space, Tooltip } from 'antd'
import type { DrawerProps } from 'antd'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { PageContainer } from '~/components/page-container'

import { isTypedDemo, typedData } from './overlay-model'
import type { OverlayDemo, OverlayKey, SharedData } from './overlay-model'

const drawerDemos: OverlayDemo[] = [
  { description: '一个基础的抽屉示例', key: 'base', title: '基本使用' },
  {
    description: '指定抽屉在内容区域打开，不会覆盖顶部和左侧菜单等区域',
    key: 'content',
    title: '在内容区域打开',
  },
  { description: '可根据内容自动计算滚动高度', key: 'auto', title: '内容高度自适应滚动' },
  { description: '通过 setState 动态调整抽屉数据', key: 'dynamic', title: '动态配置示例' },
  { description: '通过共享 sharedData 来进行数据交互', key: 'shared', title: '内外数据共享示例' },
  { description: '打开抽屉并设置表单schema以及数据', key: 'form', title: '表单抽屉示例' },
  {
    description: '子组件 expose API，父组件从 connected component 推导类型',
    key: 'typed-auto',
    title: '共享数据：自动推导',
  },
  {
    description: '无法自动推导时，父子组件显式引用同一个数据类型',
    key: 'typed-explicit',
    title: '共享数据：显式泛型',
  },
  {
    description: '通过 createDrawer 预绑定类型并复用类型化组件接口',
    key: 'typed-factory',
    title: '共享数据：契约工厂',
  },
]

function drawerTitle(key: OverlayKey, dynamicTitle: string): ReactNode {
  const titles: Record<OverlayKey, string> = {
    auto: '自动计算高度',
    base: '基础抽屉示例',
    blur: '遮罩层模糊',
    content: '基础抽屉示例',
    drag: '可拖拽示例',
    dynamic: dynamicTitle,
    form: '内嵌表单示例',
    nested: '嵌套弹窗示例',
    shared: '数据共享示例',
    'typed-auto': '自动推导数据类型',
    'typed-explicit': '显式泛型数据类型',
    'typed-factory': '契约工厂数据类型',
  }
  if (key === 'base' || key === 'content') {
    return <Tooltip title="标题提示内容">{titles[key]}</Tooltip>
  }
  return titles[key]
}

function drawerActionLabel(key: OverlayKey) {
  if (key === 'shared') return '打开抽屉并传递数据'
  if (key === 'form') return '打开抽屉并设置表单schema以及数据'
  if (key === 'typed-auto') return '打开自动推导示例'
  if (key === 'typed-explicit') return '打开显式泛型示例'
  if (key === 'typed-factory') return '打开契约工厂示例'
  return '打开抽屉'
}

export function DrawerExample() {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [active, setActive] = useState<OverlayDemo | null>(null)
  const [autoItems, setAutoItems] = useState<number[]>([])
  const [autoLoading, setAutoLoading] = useState(false)
  const [blur, setBlur] = useState(false)
  const [contentComponentValue, setContentComponentValue] = useState('')
  const [contentFormValue, setContentFormValue] = useState('')
  const [full, setFull] = useState(false)
  const [locked, setLocked] = useState(false)
  const [placement, setPlacement] = useState<NonNullable<DrawerProps['placement']>>('right')
  const [sharedData] = useState<SharedData>({
    content: '外部传递的数据 content',
    payload: '外部传递的数据 payload',
  })
  const [title, setTitle] = useState('动态修改配置示例')
  const timers = useRef(new Set<number>())

  useEffect(
    () => () => {
      for (const timer of timers.current) window.clearTimeout(timer)
    },
    [],
  )

  useEffect(() => {
    if (active?.key === 'form') {
      form.setFieldsValue({ field1: 'abc', field2: '123' })
    }
  }, [active?.key, form])

  function schedule(callback: () => void, delay: number) {
    const timer = window.setTimeout(() => {
      timers.current.delete(timer)
      callback()
    }, delay)
    timers.current.add(timer)
  }

  function updateAutoItems(length: number) {
    setAutoLoading(true)
    schedule(() => {
      setAutoItems(Array.from({ length }, (_value, index) => index + 1))
      setAutoLoading(false)
    }, 2000)
  }

  function open(
    demo: OverlayDemo,
    nextPlacement: NonNullable<DrawerProps['placement']> = 'right',
    options: { blur?: boolean; full?: boolean; title?: string } = {},
  ) {
    setPlacement(nextPlacement)
    setFull(options.full ?? false)
    setBlur(options.blur ?? false)
    setLocked(false)
    setTitle(options.title ?? '动态修改配置示例')
    if (demo.key === 'auto') updateAutoItems(10)
    setActive(demo)
  }

  function closeDrawer() {
    if (!locked) setActive(null)
  }

  function lockDrawer() {
    setLocked(true)
    schedule(() => setLocked(false), 3000)
  }

  async function confirmDrawer() {
    const key = active?.key
    if (!key) return
    if (key === 'form') {
      await form.validateFields()
      setActive(null)
      return
    }
    if (isTypedDemo(key)) {
      setActive(null)
      return
    }
    await message.info('onConfirm')
  }

  const activeKey = active?.key
  const vertical = placement === 'left' || placement === 'right'
  const drawerFooter = activeKey ? (
    <div className="app-overlay-footer">
      <span>
        {activeKey === 'auto' ? (
          <Button disabled={autoLoading} onClick={() => updateAutoItems(6)} type="link">
            点击更新数据
          </Button>
        ) : null}
      </span>
      <Space>
        <Button disabled={locked} onClick={closeDrawer}>
          取消
        </Button>
        <Button disabled={locked} onClick={() => void confirmDrawer()} type="primary">
          确认
        </Button>
      </Space>
    </div>
  ) : null

  return (
    <PageContainer
      description="抽屉组件通常用于在当前页面上显示一个覆盖层，用以展示重要信息或提供用户交互界面。"
      extra={
        <Button
          onClick={() =>
            window.open('https://ant.design/components/drawer', '_blank', 'noopener,noreferrer')
          }
          type="primary"
        >
          查看文档
        </Button>
      }
      title="抽屉组件示例"
    >
      {drawerDemos.map((demo) => (
        <Card className="app-demo-card" key={demo.key} title={demo.title}>
          <p>{demo.description}</p>
          {demo.key === 'base' || demo.key === 'content' ? (
            <Space wrap>
              {(['right', 'bottom', 'left', 'top'] as const).map((item) => (
                <Button key={item} onClick={() => open(demo, item)} type="primary">
                  {item === 'right'
                    ? '右侧'
                    : item === 'bottom'
                      ? '底部'
                      : item === 'left'
                        ? '左侧'
                        : '顶部'}
                  打开
                </Button>
              ))}
              {demo.key === 'base' ? (
                <Button onClick={() => open(demo, 'right', { blur: true })} type="primary">
                  遮罩层模糊效果
                </Button>
              ) : (
                <Button onClick={() => open(demo, 'right', { full: true })} type="primary">
                  内容区域全屏打开
                </Button>
              )}
            </Space>
          ) : (
            <Space wrap>
              <Button onClick={() => open(demo)} type="primary">
                {drawerActionLabel(demo.key)}
              </Button>
              {demo.key === 'dynamic' ? (
                <Button
                  onClick={() => open(demo, 'right', { title: '外部动态标题' })}
                  type="primary"
                >
                  从外部修改标题并打开
                </Button>
              ) : null}
            </Space>
          )}
        </Card>
      ))}

      <Drawer
        afterOpenChange={(isOpen) => {
          if (!isOpen && activeKey === 'base') {
            setBlur(false)
            setPlacement('right')
          }
        }}
        closable={!locked}
        destroyOnHidden={activeKey !== 'content'}
        footer={drawerFooter}
        keyboard={!locked}
        loading={activeKey === 'auto' && autoLoading}
        mask={{ closable: !locked }}
        onClose={closeDrawer}
        open={Boolean(active)}
        placement={placement}
        size={full ? '100%' : vertical ? 480 : 360}
        styles={{ mask: { backdropFilter: blur ? 'blur(5px)' : undefined } }}
        title={activeKey ? drawerTitle(activeKey, title) : null}
        {...(activeKey === 'base' || activeKey === 'content' ? { extra: 'extra' } : {})}
        {...(activeKey === 'content'
          ? {
              getContainer: false,
              rootStyle: {
                position: 'absolute' as const,
                ...(placement === 'top' ? { zIndex: 199 } : {}),
              },
            }
          : {})}
      >
        {activeKey === 'base' ? (
          <Space>
            <span>base demo</span>
            <Button disabled={locked} onClick={lockDrawer} type="primary">
              {locked ? '已锁定' : '锁定抽屉状态'}
            </Button>
          </Space>
        ) : null}
        {activeKey === 'content' ? (
          <Space orientation="vertical" size={12} style={{ width: '100%' }}>
            <span>此弹窗指定在内容区域打开，并且在关闭之后弹窗内容不会被销毁</span>
            <Input
              onChange={(event) => setContentComponentValue(event.target.value)}
              placeholder="KeepAlive测试:connectedComponent"
              value={contentComponentValue}
            />
            <Input
              onChange={(event) => setContentFormValue(event.target.value)}
              placeholder="KeepAlive测试：内部组件"
              value={contentFormValue}
            />
          </Space>
        ) : null}
        {activeKey === 'auto'
          ? autoItems.map((item) => (
              <div className="app-auto-height-item" key={item}>
                {item}
              </div>
            ))
          : null}
        {activeKey === 'dynamic' ? (
          <Flex justify="center">
            <Button onClick={() => setTitle('内部动态标题')} type="primary">
              内部动态修改标题
            </Button>
          </Flex>
        ) : null}
        {activeKey === 'shared' ? (
          <div className="app-shared-data">外部传递数据： {JSON.stringify(sharedData)}</div>
        ) : null}
        {activeKey === 'form' ? (
          <Form form={form} layout="vertical">
            <Form.Item label="字段1" name="field1" rules={[{ required: true }]}>
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="字段2" name="field2" rules={[{ required: true }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Form>
        ) : null}
        {activeKey && isTypedDemo(activeKey) ? (
          <div>
            <p>类型来源：{typedData[activeKey].method}</p>
            <p>接收内容：{typedData[activeKey].message}</p>
          </div>
        ) : null}
      </Drawer>
    </PageContainer>
  )
}
