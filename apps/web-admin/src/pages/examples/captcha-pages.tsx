import {
  BellOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ReloadOutlined,
  RightOutlined,
  SunOutlined,
} from '@ant-design/icons'
import { App, Button, Card, Input, InputNumber, Space, Switch } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'

import { PageContainer } from '~/components/page-container'

type CaptchaStatus = 'default' | 'fail' | 'success'

function DragSlider({
  action,
  content,
  onComplete,
  onMove,
  rounded = false,
  tinted = false,
}: {
  action?: ReactNode
  content: ReactNode
  onComplete?: (progress: number, elapsed: number) => boolean
  onMove?: (progress: number) => void
  rounded?: boolean
  tinted?: boolean
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ left: number; startedAt: number; x: number } | undefined>(undefined)
  const [left, setLeft] = useState(0)
  const [status, setStatus] = useState<CaptchaStatus>('default')

  const reset = useCallback(() => {
    setLeft(0)
    setStatus('default')
    onMove?.(0)
  }, [onMove])

  function maxLeft() {
    return Math.max(0, (trackRef.current?.clientWidth ?? 0) - 40)
  }

  function move(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current
    if (!drag || status === 'success') return
    const next = Math.min(maxLeft(), Math.max(0, drag.left + event.clientX - drag.x))
    setLeft(next)
    onMove?.(next / Math.max(1, maxLeft()))
  }

  function complete(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current
    if (!drag || status === 'success') return
    dragRef.current = undefined
    event.currentTarget.releasePointerCapture(event.pointerId)
    const progress = left / Math.max(1, maxLeft())
    const elapsed = (performance.now() - drag.startedAt) / 1000
    const passed = onComplete?.(progress, elapsed) ?? progress >= 0.98
    if (passed) {
      const end = maxLeft()
      setLeft(end)
      setStatus('success')
      onMove?.(1)
      return
    }
    setStatus('fail')
    window.setTimeout(reset, 420)
  }

  return (
    <div
      className={`example-slider-captcha${rounded ? ' is-rounded' : ''}${tinted ? ' is-tinted' : ''} is-${status}`}
      ref={trackRef}
    >
      <div className="example-slider-captcha__bar" style={{ width: left + 20 }} />
      <div className="example-slider-captcha__content">
        {status === 'success' ? <CheckCircleFilled /> : null}
        {status === 'fail' ? <CloseCircleFilled /> : null}
        {content}
      </div>
      <button
        aria-label="拖动滑块"
        className="example-slider-captcha__action"
        onPointerDown={(event) => {
          if (status === 'success') return
          event.currentTarget.setPointerCapture(event.pointerId)
          dragRef.current = { left, startedAt: performance.now(), x: event.clientX }
        }}
        onPointerMove={move}
        onPointerUp={complete}
        style={{ left }}
        type="button"
      >
        {action ?? <RightOutlined />}
      </button>
    </div>
  )
}

function SliderCaptcha({
  action,
  content = '请按住滑块拖动',
  rounded,
  tinted,
}: {
  action?: ReactNode
  content?: ReactNode
  rounded?: boolean
  tinted?: boolean
}) {
  const { message } = App.useApp()
  const [resetKey, setResetKey] = useState(0)
  return (
    <div className="app-captcha-row">
      <DragSlider
        action={action}
        content={content}
        key={resetKey}
        onComplete={(progress, elapsed) => {
          const passed = progress >= 0.98
          if (passed) void message.success(`校验成功，耗时 ${elapsed.toFixed(1)} 秒`)
          return passed
        }}
        rounded={Boolean(rounded)}
        tinted={Boolean(tinted)}
      />
      <Button onClick={() => setResetKey((value) => value + 1)} type="primary">
        还原
      </Button>
    </div>
  )
}

export function SliderCaptchaExample() {
  return (
    <PageContainer description="覆盖拖动校验状态、插槽与样式配置" title="滑块校验">
      <Card className="app-demo-card" title="基础示例">
        <SliderCaptcha />
      </Card>
      <Card className="app-demo-card" title="自定义圆角">
        <SliderCaptcha rounded />
      </Card>
      <Card className="app-demo-card" title="自定义背景色">
        <SliderCaptcha content="拖动以进行校验" tinted />
      </Card>
      <Card className="app-demo-card" title="自定义拖拽图标">
        <SliderCaptcha action={<BellOutlined />} />
      </Card>
      <Card className="app-demo-card" title="自定义文本">
        <SliderCaptcha content="拖动" />
      </Card>
      <Card className="app-demo-card" title="自定义内容(slot)">
        <SliderCaptcha
          action={<SunOutlined />}
          content={
            <Space size={6}>
              <BellOutlined /> React 19 自定义内容
            </Space>
          }
        />
      </Card>
    </PageContainer>
  )
}

export function SliderRotateCaptchaExample() {
  const { message } = App.useApp()
  const [target, setTarget] = useState(() => 120 + Math.random() * 180)
  const [angle, setAngle] = useState(target)
  const [status, setStatus] = useState<CaptchaStatus>('default')
  const [resetKey, setResetKey] = useState(0)

  function reset() {
    const next = 120 + Math.random() * 180
    setTarget(next)
    setAngle(next)
    setStatus('default')
    setResetKey((value) => value + 1)
  }

  return (
    <PageContainer description="随机初始角度、误差判定、耗时反馈与点击重置" title="滑块旋转校验">
      <Card className="app-demo-card" title="基本示例">
        <div className="app-rotate-captcha">
          <button className="app-rotate-captcha__image" onClick={reset} type="button">
            <img
              alt="旋转验证码"
              src="/admin-illustration.svg"
              style={{ transform: `rotate(${angle}deg)` }}
            />
            <span className={`app-captcha-feedback is-${status}`}>
              {status === 'success'
                ? '验证成功，点击图片刷新'
                : status === 'fail'
                  ? '验证失败，请重试'
                  : '拖动滑块，将图片转正'}
            </span>
          </button>
          <DragSlider
            content="拖动滑块旋转图片"
            key={resetKey}
            onComplete={(progress, elapsed) => {
              const passed = Math.abs(target * (1 - progress)) < 20
              setStatus(passed ? 'success' : 'fail')
              if (passed) void message.success(`success! ${elapsed.toFixed(1)}s`)
              return passed
            }}
            onMove={(progress) => setAngle(target * (1 - progress))}
          />
          <Button icon={<ReloadOutlined />} onClick={reset}>
            刷新
          </Button>
        </div>
      </Card>
    </PageContainer>
  )
}

function drawPuzzle(
  background: HTMLCanvasElement,
  piece: HTMLCanvasElement,
  image: HTMLImageElement,
  targetX: number,
  targetY: number,
) {
  const width = 420
  const height = 420
  const size = 52
  const radius = 10
  const path = (context: CanvasRenderingContext2D, x: number, y: number) => {
    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x + size / 2 - radius, y)
    context.arc(x + size / 2, y, radius, Math.PI, 0)
    context.lineTo(x + size, y)
    context.lineTo(x + size, y + size / 2 - radius)
    context.arc(x + size, y + size / 2, radius, -Math.PI / 2, Math.PI / 2)
    context.lineTo(x + size, y + size)
    context.lineTo(x, y + size)
    context.closePath()
  }
  background.width = width
  background.height = height
  piece.width = 72
  piece.height = height
  const backgroundContext = background.getContext('2d')
  const pieceContext = piece.getContext('2d')
  if (!backgroundContext || !pieceContext) return
  backgroundContext.drawImage(image, 0, 0, width, height)
  path(backgroundContext, targetX, targetY)
  backgroundContext.fillStyle = 'rgb(0 0 0 / 48%)'
  backgroundContext.fill()
  backgroundContext.strokeStyle = 'rgb(255 255 255 / 75%)'
  backgroundContext.stroke()

  pieceContext.save()
  path(pieceContext, 0, targetY)
  pieceContext.clip()
  pieceContext.drawImage(image, -targetX, 0, width, height)
  pieceContext.restore()
  pieceContext.strokeStyle = '#fff'
  path(pieceContext, 0, targetY)
  pieceContext.stroke()
}

export function SliderTranslateCaptchaExample() {
  const { message } = App.useApp()
  const backgroundRef = useRef<HTMLCanvasElement>(null)
  const pieceRef = useRef<HTMLCanvasElement>(null)
  const [target, setTarget] = useState({ x: 280, y: 170 })
  const [pieceX, setPieceX] = useState(0)
  const [status, setStatus] = useState<CaptchaStatus>('default')
  const [resetKey, setResetKey] = useState(0)

  const reset = useCallback(() => {
    setTarget({ x: 190 + Math.round(Math.random() * 160), y: 65 + Math.round(Math.random() * 270) })
    setPieceX(0)
    setStatus('default')
    setResetKey((value) => value + 1)
  }, [])

  useEffect(() => {
    const image = new Image()
    image.addEventListener('load', () => {
      if (backgroundRef.current && pieceRef.current) {
        drawPuzzle(backgroundRef.current, pieceRef.current, image, target.x, target.y)
      }
    })
    image.src = '/admin-illustration.svg'
  }, [target])

  return (
    <PageContainer
      description="双 Canvas 生成真实拼图缺口与裁片，包含随机位置和误差判定"
      title="拼图滑块校验"
    >
      <Card className="app-demo-card" title="基本示例">
        <div className="app-translate-captcha">
          <button className="app-translate-captcha__canvas" onClick={reset} type="button">
            <canvas aria-label="拼图验证码背景" ref={backgroundRef} />
            <canvas
              aria-label="可移动拼图裁片"
              className="app-translate-captcha__piece"
              ref={pieceRef}
              style={{ left: pieceX }}
            />
            <span className={`app-captcha-feedback is-${status}`}>
              {status === 'success'
                ? '验证成功，点击图片刷新'
                : status === 'fail'
                  ? '位置不正确，请重试'
                  : '拖动滑块完成拼图'}
            </span>
          </button>
          <DragSlider
            content="向右拖动滑块完成拼图"
            key={resetKey}
            onComplete={(progress, elapsed) => {
              const distance = Math.abs(target.x - progress * target.x)
              const passed = distance <= 3
              setStatus(passed ? 'success' : 'fail')
              if (passed) void message.success(`success! ${elapsed.toFixed(1)}s`)
              return passed
            }}
            onMove={(progress) => setPieceX(progress * target.x)}
          />
        </div>
      </Card>
    </PageContainer>
  )
}

interface CaptchaPoint {
  i: number
  t: number
  x: number
  y: number
}

export function PointSelectionCaptchaExample() {
  const { message } = App.useApp()
  const [points, setPoints] = useState<CaptchaPoint[]>([])
  const [title, setTitle] = useState('')
  const [captchaImageUrl, setCaptchaImageUrl] = useState('/admin-illustration.svg')
  const [hintText, setHintText] = useState('唇，燕，碴，找')
  const [hintImageUrl, setHintImageUrl] = useState('/app-icons/avatar-3.svg')
  const [showHintImage, setShowHintImage] = useState(false)
  const [showConfirm, setShowConfirm] = useState(true)
  const [width, setWidth] = useState(300)
  const [height, setHeight] = useState(220)
  const [paddingX, setPaddingX] = useState(12)
  const [paddingY, setPaddingY] = useState(16)

  function clear() {
    setPoints([])
  }

  return (
    <PageContainer
      description="完整配置标题、提示、尺寸、内边距、确认动作和点位数据"
      title="点选验证码"
    >
      <Card className="app-demo-card" title="基本使用">
        <div className="app-point-controls">
          <Input
            onChange={(event) => setTitle(event.target.value)}
            placeholder="请输入标题"
            value={title}
          />
          <Input
            onChange={(event) => setCaptchaImageUrl(event.target.value)}
            placeholder="请输入验证码图片地址"
            value={captchaImageUrl}
          />
          <Switch
            checked={showHintImage}
            checkedChildren="提示图片"
            onChange={setShowHintImage}
            unCheckedChildren="提示文字"
          />
          {showHintImage ? (
            <Input
              onChange={(event) => setHintImageUrl(event.target.value)}
              placeholder="请输入提示图片地址"
              value={hintImageUrl}
            />
          ) : (
            <Input
              onChange={(event) => setHintText(event.target.value)}
              placeholder="请输入提示文字"
              value={hintText}
            />
          )}
          <Switch
            checked={showConfirm}
            checkedChildren="显示确认"
            onChange={setShowConfirm}
            unCheckedChildren="隐藏确认"
          />
          <InputNumber
            min={1}
            onChange={(value) => typeof value === 'number' && setWidth(value)}
            placeholder="宽度"
            suffix="px"
            value={width}
          />
          <InputNumber
            min={1}
            onChange={(value) => typeof value === 'number' && setHeight(value)}
            placeholder="高度"
            suffix="px"
            value={height}
          />
          <InputNumber
            min={0}
            onChange={(value) => typeof value === 'number' && setPaddingX(value)}
            placeholder="水平内边距"
            suffix="px"
            value={paddingX}
          />
          <InputNumber
            min={0}
            onChange={(value) => typeof value === 'number' && setPaddingY(value)}
            placeholder="垂直内边距"
            suffix="px"
            value={paddingY}
          />
        </div>
        <div className="app-point-captcha-layout">
          <div className="app-point-captcha" style={{ padding: `${paddingY}px ${paddingX}px` }}>
            <header>
              <strong>{title || '请依次点击下图中的文字'}</strong>
              <Space size={4}>
                <Button
                  aria-label="刷新点选验证码"
                  icon={<ReloadOutlined />}
                  onClick={clear}
                  type="text"
                />
                {showConfirm ? (
                  <Button
                    onClick={() => {
                      void message.success(`captcha points: ${JSON.stringify(points)}`)
                      clear()
                    }}
                    size="small"
                    type="primary"
                  >
                    确认
                  </Button>
                ) : null}
              </Space>
            </header>
            <button
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect()
                setPoints((items) => [
                  ...items,
                  {
                    i: items.length,
                    t: Date.now(),
                    x: Math.round(event.clientX - rect.left),
                    y: Math.round(event.clientY - rect.top),
                  },
                ])
              }}
              style={{ height, width }}
              type="button"
            >
              <img alt="点选验证码" src={captchaImageUrl} />
              {points.map((point) => (
                <i key={`${point.t}-${point.i}`} style={{ left: point.x, top: point.y }}>
                  {point.i + 1}
                </i>
              ))}
            </button>
            <footer>
              {showHintImage ? (
                <img alt="提示" src={hintImageUrl} />
              ) : (
                <span>请依次点击：{hintText}</span>
              )}
            </footer>
          </div>
          <ol className="app-point-list">
            {points.map((point) => (
              <li key={`${point.t}-${point.i}`}>
                序号{point.i}　时间戳{point.t}　x:{point.x}　y:{point.y}
              </li>
            ))}
          </ol>
        </div>
      </Card>
    </PageContainer>
  )
}
