import { Alert, Button, Card, Checkbox, Flex, Slider, Space, Tag, Tooltip } from 'antd'
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { useLayoutEffect, useRef, useState } from 'react'

import { PageContainer } from '~/components/page-container'

const introText =
  'Qing React Admin 是一个基于 React 19、TanStack Router、Ant Design 6 与 TypeScript 的纯浏览器管理后台。它提供动态菜单、权限校验、页签状态保留、多主题、国际化以及可组合的业务组件，可用于快速搭建企业级中后台产品。'.repeat(
    4,
  )

function EllipsisText({
  children,
  expand = false,
  lines = 1,
  maxWidth,
  tooltip,
}: {
  children: ReactNode
  expand?: boolean
  lines?: number
  maxWidth?: number
  tooltip?: ReactNode
}) {
  const [expanded, setExpanded] = useState(false)
  const contentRef = useRef<HTMLSpanElement>(null)
  const [targetWidth, setTargetWidth] = useState(maxWidth ?? 0)

  useLayoutEffect(() => {
    const contentElement = contentRef.current
    if (!contentElement) return undefined
    const updateWidth = () => setTargetWidth(maxWidth ?? Math.ceil(contentElement.clientWidth))
    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(contentElement)
    return () => observer.disconnect()
  }, [maxWidth])

  const content = (
    <span
      className={`app-ellipsis-text${expanded ? ' is-expanded' : ''}`}
      ref={contentRef}
      style={{ '--ellipsis-lines': lines, ...(maxWidth ? { maxWidth } : {}) } as CSSProperties}
    >
      {children}
    </span>
  )

  return (
    <span className="app-ellipsis-shell">
      <Tooltip
        styles={{
          container: {
            maxWidth: targetWidth > 0 ? targetWidth : undefined,
            width: 'max-content',
          },
        }}
        title={tooltip ?? children}
      >
        {content}
      </Tooltip>
      {expand ? (
        <Button onClick={() => setExpanded((value) => !value)} size="small" type="link">
          {expanded ? '收起' : '展开'}
        </Button>
      ) : null}
    </span>
  )
}

export function EllipsisExample() {
  return (
    <PageContainer
      description="用于多行文本省略，支持点击展开和自定义内容。"
      extra={
        <Button
          onClick={() =>
            window.open('https://ant.design/components/typography', '_blank', 'noopener,noreferrer')
          }
          type="primary"
        >
          查看文档
        </Button>
      }
      title="文本省略组件示例"
    >
      <Card className="app-demo-card" title="基本使用">
        <EllipsisText maxWidth={500}>{introText}</EllipsisText>
      </Card>
      <Card className="app-demo-card" title="多行省略">
        <EllipsisText lines={2}>{introText}</EllipsisText>
      </Card>
      <Card className="app-demo-card" title="点击展开">
        <EllipsisText expand lines={3}>
          {introText}
        </EllipsisText>
      </Card>
      <Card className="app-demo-card" title="自定义内容">
        <EllipsisText
          maxWidth={240}
          tooltip={
            <div className="app-ellipsis-poem">
              《秦皇岛》
              <br />
              住在我心里孤独的
              <br />
              孤独的海怪 痛苦之王
              <br />
              开始厌倦 深海的光 停滞的海浪
            </div>
          }
        >
          住在我心里孤独的 孤独的海怪 痛苦之王 开始厌倦 深海的光 停滞的海浪
        </EllipsisText>
      </Card>
    </PageContainer>
  )
}

interface ResizeRect {
  height: number
  id: number
  left: number
  top: number
  width: number
}

function ResizeBlock({
  color,
  initial,
  onChange,
}: {
  color: string
  initial: ResizeRect
  onChange: (rect: ResizeRect) => void
}) {
  const [rect, setRect] = useState(initial)
  const gesture = useRef<
    { mode: 'drag' | 'resize'; origin: ResizeRect; pointerX: number; pointerY: number } | undefined
  >(undefined)

  function begin(event: ReactPointerEvent<HTMLElement>, mode: 'drag' | 'resize') {
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    gesture.current = {
      mode,
      origin: rect,
      pointerX: event.clientX,
      pointerY: event.clientY,
    }
  }

  function move(event: ReactPointerEvent<HTMLElement>) {
    const current = gesture.current
    if (!current) return
    const deltaX = event.clientX - current.pointerX
    const deltaY = event.clientY - current.pointerY
    const next =
      current.mode === 'drag'
        ? {
            ...current.origin,
            left: Math.max(0, current.origin.left + deltaX),
            top: Math.max(0, current.origin.top + deltaY),
          }
        : {
            ...current.origin,
            height: Math.max(60, current.origin.height + deltaY),
            width: Math.max(60, current.origin.width + deltaX),
          }
    setRect(next)
    onChange(next)
  }

  return (
    <div
      className="app-resize-block"
      onPointerDown={(event) => begin(event, 'drag')}
      onPointerMove={move}
      onPointerUp={() => {
        gesture.current = undefined
      }}
      style={{
        backgroundColor: color,
        height: rect.height,
        left: rect.left,
        top: rect.top,
        width: rect.width,
      }}
    >
      <span
        className="app-resize-handle"
        onPointerDown={(event) => begin(event, 'resize')}
        onPointerMove={move}
        onPointerUp={() => {
          gesture.current = undefined
        }}
      />
    </div>
  )
}

const initialResizeRects: ResizeRect[] = [
  { height: 200, id: 1, left: 200, top: 200, width: 200 },
  { height: 300, id: 2, left: 300, top: 300, width: 300 },
  { height: 400, id: 3, left: 400, top: 400, width: 400 },
  { height: 500, id: 4, left: 500, top: 500, width: 500 },
]

export function ResizeExample() {
  const [rects, setRects] = useState(initialResizeRects)

  return (
    <PageContainer description="Resize组件基础示例" title="Resize组件">
      <div className="app-resize-info">
        {rects.map((rect) => (
          <div key={rect.id}>
            width: {Math.round(rect.width)}px, height: {Math.round(rect.height)}px, top:{' '}
            {Math.round(rect.top)}px, left: {Math.round(rect.left)}px
          </div>
        ))}
      </div>
      <div className="app-resize-stage">
        {initialResizeRects.map((rect, index) => (
          <ResizeBlock
            color={['red', 'green', 'yellow', 'gray'][index] ?? 'gray'}
            initial={rect}
            key={rect.width}
            onChange={(next) =>
              setRects((current) =>
                current.map((item, itemIndex) => (itemIndex === index ? next : item)),
              )
            }
          />
        ))}
      </div>
    </PageContainer>
  )
}

export function ColPageExample() {
  const [collapsed, setCollapsed] = useState(false)
  const [leftWidth, setLeftWidth] = useState(30)
  const [leftMinWidth, setLeftMinWidth] = useState(20)
  const [leftMaxWidth, setLeftMaxWidth] = useState(50)
  const [resizable, setResizable] = useState(true)
  const [splitLine, setSplitLine] = useState(true)
  const [splitHandle, setSplitHandle] = useState(true)
  const [leftCollapsible, setLeftCollapsible] = useState(true)
  const shellRef = useRef<HTMLDivElement>(null)
  const dragOrigin = useRef<{ pointerX: number; width: number } | undefined>(undefined)

  function moveDivider(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragOrigin.current || !shellRef.current) return
    const delta =
      ((event.clientX - dragOrigin.current.pointerX) / shellRef.current.clientWidth) * 100
    const next = dragOrigin.current.width + delta
    if (leftCollapsible && next < leftMinWidth / 2) {
      setCollapsed(true)
      return
    }
    setCollapsed(false)
    setLeftWidth(Math.min(leftMaxWidth, Math.max(leftMinWidth, next)))
  }

  return (
    <PageContainer
      description="ColPage 是一个双列布局组件，支持左侧折叠、拖拽调整宽度等功能。"
      title={
        <Space>
          <span>ColPage 双列布局组件</span>
          <Tag color="red">Alpha</Tag>
        </Space>
      }
    >
      <div className="app-col-page" ref={shellRef}>
        <aside
          className={`app-col-page__left${collapsed ? ' is-collapsed' : ''}`}
          style={{ width: collapsed ? '5%' : `${leftWidth}%` }}
        >
          {collapsed ? (
            <Tooltip title="点击展开左侧">
              <Button onClick={() => setCollapsed(false)} shape="circle" type="primary">
                →
              </Button>
            </Tooltip>
          ) : (
            <div className="app-col-page__left-content">
              {Array.from({ length: 5 }, (_, index) => (
                <p key={index}>这里是左侧内容</p>
              ))}
            </div>
          )}
        </aside>
        <div
          className={`app-col-page__divider${splitLine ? ' has-line' : ''}${splitHandle ? ' has-handle' : ''}`}
          onPointerDown={(event) => {
            if (!resizable) return
            event.currentTarget.setPointerCapture(event.pointerId)
            dragOrigin.current = { pointerX: event.clientX, width: leftWidth }
          }}
          onPointerMove={moveDivider}
          onPointerUp={() => {
            dragOrigin.current = undefined
          }}
        />
        <Card className="app-col-page__right" title="基本使用">
          <Flex gap={10} wrap>
            <Checkbox checked={resizable} onChange={(event) => setResizable(event.target.checked)}>
              可拖动调整宽度
            </Checkbox>
            <Checkbox checked={splitLine} onChange={(event) => setSplitLine(event.target.checked)}>
              显示拖动分隔线
            </Checkbox>
            <Checkbox
              checked={splitHandle}
              onChange={(event) => setSplitHandle(event.target.checked)}
            >
              显示拖动手柄
            </Checkbox>
            <Checkbox
              checked={leftCollapsible}
              onChange={(event) => setLeftCollapsible(event.target.checked)}
            >
              左侧可折叠
            </Checkbox>
          </Flex>
          <div className="app-col-page__sliders">
            <span>左侧最小宽度百分比：</span>
            <Slider
              max={leftMaxWidth - 1}
              min={1}
              onChange={setLeftMinWidth}
              value={leftMinWidth}
            />
            <span>左侧最大宽度百分比：</span>
            <Slider
              max={100}
              min={leftMinWidth + 1}
              onChange={setLeftMaxWidth}
              value={leftMaxWidth}
            />
          </div>
          <Alert
            description={
              <>
                <p>
                  双列布局组件是一个在Page组件上扩展的相对基础的布局组件，支持左侧折叠（当拖拽导致左侧宽度比最小宽度还要小时，还可以进入折叠状态）、拖拽调整宽度等功能。
                </p>
                <p>以上宽度设置的数值是百分比，最小值为1，最大值为100。</p>
                <strong className="app-warning-copy">
                  这是一个实验性的组件，用法可能会发生变动，也可能最终不会被采用。在其用法正式出现在文档中之前，不建议在生产环境中使用。
                </strong>
              </>
            }
            showIcon
            title="实验性的组件"
            type="warning"
          />
        </Card>
      </div>
    </PageContainer>
  )
}
