import { App, Button, Card, Flex, Form, Input, Modal, Select, Slider, Space, Tooltip } from 'antd'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { PageContainer } from '~/components/page-container'

import { isTypedDemo, typedData } from './overlay-model'
import type { OverlayDemo, OverlayKey, SharedData } from './overlay-model'

const modalDemos: OverlayDemo[] = [
  { description: '一个基础的弹窗示例', key: 'base', title: '基本使用' },
  { description: '在内容区域打开弹窗的示例', key: 'content', title: '指定容器+关闭后不销毁' },
  { description: '可根据内容并自动调整高度', key: 'auto', title: '内容高度自适应' },
  { description: '配置 draggable 可开启拖拽功能', key: 'drag', title: '可拖拽示例' },
  { description: '通过 setState 动态调整弹窗数据', key: 'dynamic', title: '动态配置示例' },
  { description: '通过共享 sharedData 来进行数据交互', key: 'shared', title: '内外数据共享示例' },
  { description: '弹窗与表单结合', key: 'form', title: '表单弹窗示例' },
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
    description: '通过 createModal 预绑定类型并复用类型化组件接口',
    key: 'typed-factory',
    title: '共享数据：契约工厂',
  },
  { description: '在已经打开的弹窗中再次打开弹窗', key: 'nested', title: '嵌套弹窗示例' },
  { description: '遮罩层应用类似毛玻璃的模糊效果', key: 'blur', title: '遮罩模糊示例' },
]

function modalTitle(key: OverlayKey, dynamicTitle: string): ReactNode {
  const titles: Record<OverlayKey, string> = {
    auto: '自动计算高度',
    base: '基础弹窗示例',
    blur: '遮罩层模糊',
    content: '基础弹窗示例',
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

function modalCardActionLabel(key: OverlayKey) {
  if (key === 'shared') return '打开弹窗并传递数据'
  if (key === 'form') return '打开表单弹窗'
  if (key === 'typed-auto') return '打开自动推导示例'
  if (key === 'typed-explicit') return '打开显式泛型示例'
  if (key === 'typed-factory') return '打开契约工厂示例'
  if (key === 'nested') return '打开嵌套弹窗'
  return '打开弹窗'
}

export function ModalExample() {
  const { message, modal } = App.useApp()
  const [form] = Form.useForm()
  const [active, setActive] = useState<OverlayDemo | null>(null)
  const [autoItems, setAutoItems] = useState<number[]>([])
  const [autoLoading, setAutoLoading] = useState(false)
  const [blur, setBlur] = useState(5)
  const [contentValue, setContentValue] = useState('')
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [dynamicFullscreen, setDynamicFullscreen] = useState(false)
  const [dynamicTitle, setDynamicTitle] = useState('动态修改配置示例')
  const [locked, setLocked] = useState(false)
  const [nestedOpen, setNestedOpen] = useState(false)
  const [sharedData] = useState<SharedData>({
    content: '外部传递的数据 content',
    payload: '外部传递的数据 payload',
  })
  const [submitting, setSubmitting] = useState(false)
  const closingKey = useRef<OverlayKey | null>(null)
  const dragGesture = useRef<
    { originX: number; originY: number; pointerX: number; pointerY: number } | undefined
  >(undefined)
  const timers = useRef(new Set<number>())

  useEffect(
    () => () => {
      for (const timer of timers.current) window.clearTimeout(timer)
    },
    [],
  )

  useEffect(() => {
    if (active?.key === 'form') {
      form.setFieldsValue({ field1: 'abc', field2: '123', field3: '1' })
    }
  }, [active?.key, form])

  function schedule(callback: () => void, delay: number) {
    const timer = window.setTimeout(() => {
      timers.current.delete(timer)
      callback()
    }, delay)
    timers.current.add(timer)
  }

  function updateAutoItems(length?: number) {
    setAutoLoading(true)
    schedule(() => {
      const itemCount = length ?? Math.floor(Math.random() * 10) + 1
      setAutoItems(Array.from({ length: itemCount }, (_value, index) => index + 1))
      setAutoLoading(false)
    }, 2000)
  }

  function openDemo(demo: OverlayDemo, title?: string) {
    setDragOffset({ x: 0, y: 0 })
    setDynamicFullscreen(false)
    setLocked(false)
    if (demo.key === 'dynamic') setDynamicTitle(title ?? '动态修改配置示例')
    if (demo.key === 'auto') updateAutoItems()
    setActive(demo)
  }

  function closeModal() {
    if (locked) return
    closingKey.current = active?.key ?? null
    setActive(null)
  }

  function lockModal() {
    setLocked(true)
    schedule(() => setLocked(false), 3000)
  }

  function startDragging(event: ReactPointerEvent<HTMLDivElement>) {
    if (active?.key !== 'drag') return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragGesture.current = {
      originX: dragOffset.x,
      originY: dragOffset.y,
      pointerX: event.clientX,
      pointerY: event.clientY,
    }
  }

  function dragModal(event: ReactPointerEvent<HTMLDivElement>) {
    const gesture = dragGesture.current
    if (!gesture) return
    setDragOffset({
      x: gesture.originX + event.clientX - gesture.pointerX,
      y: gesture.originY + event.clientY - gesture.pointerY,
    })
  }

  async function submitModalForm() {
    const values = await form.validateFields()
    setLocked(true)
    setSubmitting(true)
    message.open({
      content: '正在提交中...',
      duration: 0,
      key: 'is-form-submitting',
      type: 'loading',
    })
    schedule(() => {
      closingKey.current = 'form'
      setActive(null)
      setLocked(false)
      setSubmitting(false)
      message.success({
        content: `提交成功：${JSON.stringify(values)}`,
        duration: 2,
        key: 'is-form-submitting',
      })
    }, 3000)
  }

  async function handleModalConfirm() {
    const key = active?.key
    if (!key) return
    if (key === 'form') {
      await submitModalForm()
      return
    }
    if (key === 'nested' || key === 'blur' || isTypedDemo(key)) {
      closeModal()
      return
    }
    await message.info('onConfirm')
  }

  function openAlert() {
    modal.success({
      content: '这是一个弹窗',
      onOk: () => {
        void message.info('用户关闭了弹窗')
      },
    })
  }

  function openConfirm() {
    modal.confirm({
      centered: false,
      content: '这是一个确认弹窗',
      icon: null,
      onCancel: () => {
        void message.error('用户取消了操作')
      },
      onOk: async () => {
        await new Promise<void>((resolve) => window.setTimeout(resolve, 1000))
        await message.success('用户确认了操作')
      },
    })
  }

  function openPrompt() {
    let value = ''
    modal.confirm({
      content: (
        <>
          <p>中午吃了什么？</p>
          <Input
            onChange={(event) => {
              value = event.target.value
            }}
            placeholder="不能吃芝士..."
          />
        </>
      ),
      icon: null,
      onCancel: () => {
        void message.error('用户取消了输入')
      },
      onOk: async () => {
        if (value === '芝士') {
          await message.error('不能吃芝士')
          throw new Error('Prompt input rejected')
        }
        await message.success(`用户输入了：${value}`)
      },
      styles: { mask: { backdropFilter: 'blur(3px)' } },
    })
  }

  const activeKey = active?.key
  const modalFooter = activeKey ? (
    <div className="app-overlay-footer">
      <span>
        {activeKey === 'auto' ? (
          <Button disabled={autoLoading} onClick={() => updateAutoItems()} type="link">
            点击更新数据
          </Button>
        ) : null}
      </span>
      <Space>
        <Button disabled={locked} onClick={closeModal}>
          取消
        </Button>
        <Button
          disabled={locked || (activeKey === 'auto' && autoLoading)}
          loading={submitting}
          onClick={() => void handleModalConfirm()}
          type="primary"
        >
          确认
        </Button>
      </Space>
    </div>
  ) : null

  return (
    <PageContainer
      description="弹窗组件常用于在不离开当前页面的情况下，显示额外的信息、表单或操作提示，更多api请查看组件文档。"
      extra={
        <Button
          onClick={() =>
            window.open('https://ant.design/components/modal', '_blank', 'noopener,noreferrer')
          }
          type="primary"
        >
          查看文档
        </Button>
      }
      title="弹窗组件示例"
    >
      <Flex className="app-overlay-card-grid" gap={10} wrap>
        {modalDemos.map((demo) => (
          <Card
            actions={[
              <Button key="open" onClick={() => openDemo(demo)} type="primary">
                {modalCardActionLabel(demo.key)}
              </Button>,
            ]}
            extra={
              demo.key === 'dynamic' ? (
                <Button onClick={() => openDemo(demo)} type="link">
                  打开弹窗
                </Button>
              ) : undefined
            }
            key={demo.key}
            title={demo.title}
          >
            <p>{demo.description}</p>
            {demo.key === 'dynamic' ? (
              <Button onClick={() => openDemo(demo, '外部动态标题')} type="primary">
                外部修改标题并打开
              </Button>
            ) : null}
          </Card>
        ))}
        <Card
          actions={[
            <Button key="alert" onClick={openAlert} type="primary">
              Alert
            </Button>,
            <Button key="confirm" onClick={openConfirm} type="primary">
              Confirm
            </Button>,
            <Button key="prompt" onClick={openPrompt} type="primary">
              Prompt
            </Button>,
          ]}
          extra={
            <Button
              onClick={() =>
                window.open('https://ant.design/components/modal', '_blank', 'noopener,noreferrer')
              }
              type="link"
            >
              查看文档
            </Button>
          }
          title="轻量提示弹窗"
        >
          <p>通过快捷方法创建动态提示弹窗，适合一些轻量的提示和确认、输入等</p>
        </Card>
      </Flex>

      <Modal
        afterOpenChange={(open) => {
          if (open && activeKey === 'base') void message.info('onOpened：打开动画结束')
          if (!open && closingKey.current === 'base') {
            closingKey.current = null
            void message.info('onClosed：关闭动画结束')
          }
        }}
        centered={!dynamicFullscreen && activeKey !== 'content'}
        closable={!locked}
        destroyOnHidden={activeKey !== 'content'}
        footer={modalFooter}
        keyboard={!locked}
        mask={{ closable: !locked }}
        onCancel={closeModal}
        open={Boolean(active)}
        styles={{
          body: {
            maxHeight: dynamicFullscreen ? 'none' : '70vh',
            overflow: 'auto',
            ...(dynamicFullscreen ? { flex: 1 } : {}),
          },
          ...(dynamicFullscreen
            ? {
                container: {
                  borderRadius: 0,
                  display: 'flex',
                  height: '100vh',
                  maxHeight: '100vh',
                  flexDirection: 'column',
                },
              }
            : {}),
          mask: {
            ...(activeKey === 'blur' ? { backdropFilter: `blur(${blur}px)` } : {}),
          },
        }}
        title={
          activeKey ? (
            <div
              className={activeKey === 'drag' ? 'app-modal-drag-title' : undefined}
              onPointerDown={startDragging}
              onPointerMove={dragModal}
              onPointerUp={() => {
                dragGesture.current = undefined
              }}
            >
              {modalTitle(activeKey, dynamicTitle)}
            </div>
          ) : null
        }
        width={dynamicFullscreen ? '100vw' : activeKey === 'auto' ? 620 : 600}
        {...(dynamicFullscreen
          ? {
              rootClassName: 'app-modal-fullscreen',
              style: { margin: 0, maxWidth: 'none', paddingBottom: 0, top: 0 },
            }
          : {})}
        {...(activeKey === 'content'
          ? { getContainer: false, rootStyle: { position: 'absolute' as const } }
          : {})}
        {...(activeKey === 'drag'
          ? { style: { transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` } }
          : {})}
      >
        {activeKey === 'base' ? (
          <Space>
            <span>base demo</span>
            <Button disabled={locked} onClick={lockModal} type="primary">
              {locked ? '已锁定' : '锁定弹窗'}
            </Button>
          </Space>
        ) : null}
        {activeKey === 'content' ? (
          <Space orientation="vertical" size={12} style={{ width: '100%' }}>
            <span>此弹窗指定在内容区域打开，并且在关闭之后弹窗内容不会被销毁</span>
            <Input
              onChange={(event) => setContentValue(event.target.value)}
              placeholder="KeepAlive测试"
              value={contentValue}
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
        {activeKey === 'auto' && autoLoading ? (
          <div className="app-overlay-loading">加载中...</div>
        ) : null}
        {activeKey === 'drag' ? <p>鼠标移动到 header 上，可拖拽弹窗</p> : null}
        {activeKey === 'dynamic' ? (
          <Flex align="center" gap={12} justify="center" vertical>
            <Button onClick={() => setDynamicTitle('内部动态标题')} type="primary">
              内部动态修改标题
            </Button>
            <Button onClick={() => setDynamicFullscreen((value) => !value)} type="primary">
              {dynamicFullscreen ? '退出全屏' : '打开全屏'}
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
            <Form.Item label="字段3" name="field3" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: '选项1', value: '1' },
                  { label: '选项2', value: '2' },
                ]}
                placeholder="请输入"
              />
            </Form.Item>
          </Form>
        ) : null}
        {activeKey && isTypedDemo(activeKey) ? (
          <div>
            <p>类型来源：{typedData[activeKey].method}</p>
            <p>接收内容：{typedData[activeKey].message}</p>
          </div>
        ) : null}
        {activeKey === 'nested' ? (
          <Button onClick={() => setNestedOpen(true)} type="primary">
            打开子弹窗
          </Button>
        ) : null}
        {activeKey === 'blur' ? (
          <>
            <p>调整滑块来改变遮罩层模糊程度：{blur}</p>
            <Slider max={30} min={0} onChange={setBlur} value={blur} />
          </>
        ) : null}
      </Modal>
      <Modal
        onCancel={() => setNestedOpen(false)}
        onOk={() => void message.info('onConfirm')}
        open={nestedOpen}
        title="可拖拽示例"
      >
        鼠标移动到 header 上，可拖拽弹窗
      </Modal>
    </PageContainer>
  )
}
