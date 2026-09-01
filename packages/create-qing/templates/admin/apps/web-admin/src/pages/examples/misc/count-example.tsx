import { ReloadOutlined } from '@ant-design/icons'
import { App, Button, Card, Form, Input, InputNumber, Select, Switch, Tooltip } from 'antd'
import { animate } from 'motion/react'
import { useEffect, useState } from 'react'

import { PageContainer } from '~/components/page-container'

interface CountSettings {
  decimal: string
  decimals: number
  delay: number
  disabled: boolean
  duration: number
  endVal: number
  prefix: string
  separator: string
  startVal: number
  suffix: string
  transition: CountTransition
}

const countTransitionOptions = [
  'linear',
  'easeInSine',
  'easeOutSine',
  'easeInOutSine',
  'easeInQuad',
  'easeOutQuad',
  'easeInOutQuad',
  'easeInCubic',
  'easeOutCubic',
  'easeInOutCubic',
  'easeInQuart',
  'easeOutQuart',
  'easeInOutQuart',
  'easeInQuint',
  'easeOutQuint',
  'easeInOutQuint',
  'easeInExpo',
  'easeOutExpo',
  'easeInOutExpo',
  'easeInCirc',
  'easeOutCirc',
  'easeInOutCirc',
  'easeInBack',
  'easeOutBack',
  'easeInOutBack',
] as const

type CountTransition = (typeof countTransitionOptions)[number]

function baseCountEase(transition: CountTransition, progress: number) {
  if (transition.includes('Sine')) return 1 - Math.cos((progress * Math.PI) / 2)
  if (transition.includes('Quad')) return progress ** 2
  if (transition.includes('Cubic')) return progress ** 3
  if (transition.includes('Quart')) return progress ** 4
  if (transition.includes('Quint')) return progress ** 5
  if (transition.includes('Expo')) return progress === 0 ? 0 : 2 ** (10 * progress - 10)
  if (transition.includes('Circ')) return 1 - Math.sqrt(1 - progress ** 2)
  if (transition.includes('Back')) {
    const overshoot = 1.70158
    return (overshoot + 1) * progress ** 3 - overshoot * progress ** 2
  }
  return progress
}

function countEase(transition: CountTransition) {
  return (progress: number) => {
    if (transition === 'linear') return progress
    if (transition.startsWith('easeInOut')) {
      return progress < 0.5
        ? baseCountEase(transition, progress * 2) / 2
        : 1 - baseCountEase(transition, (1 - progress) * 2) / 2
    }
    if (transition.startsWith('easeIn')) return baseCountEase(transition, progress)
    if (transition.startsWith('easeOut')) {
      return 1 - baseCountEase(transition, 1 - progress)
    }
    return progress
  }
}

function formatCount(value: number, settings: CountSettings) {
  const [integer, fraction] = value.toFixed(settings.decimals).split('.')
  const grouped = integer?.replace(/\B(?=(\d{3})+(?!\d))/g, settings.separator) ?? '0'
  return `${settings.prefix}${grouped}${fraction ? `${settings.decimal}${fraction}` : ''}${settings.suffix}`
}

function AnimatedCount({ settings }: { settings: CountSettings }) {
  const { message } = App.useApp()
  const [value, setValue] = useState(settings.startVal)

  useEffect(() => {
    void message.loading({ content: '动画已开始', duration: 0, key: 'animator-info' })
    const playback = animate(settings.startVal, settings.endVal, {
      delay: settings.delay / 1000,
      duration: settings.duration / 1000,
      ease: countEase(settings.transition),
      onComplete: () =>
        void message.success({ content: '动画已结束', duration: 2, key: 'animator-info' }),
      onUpdate: setValue,
    })
    return () => playback.stop()
  }, [
    message,
    settings.delay,
    settings.duration,
    settings.endVal,
    settings.startVal,
    settings.transition,
  ])

  return formatCount(value, settings)
}

export function CountToExample() {
  const [settings, setSettings] = useState<CountSettings>({
    decimal: '.',
    decimals: 2,
    delay: 0,
    disabled: false,
    duration: 2000,
    endVal: 100_000,
    prefix: '￥',
    separator: ',',
    startVal: 0,
    suffix: '元',
    transition: 'easeOutQuart',
  })

  return (
    <PageContainer
      description={
        <>
          使用useTransition封装的数字滚动动画组件，每次改变当前值都会产生过渡动画。
          <Button
            onClick={() => window.open('https://motion.dev/docs/react-animate-number', '_blank')}
            type="link"
          >
            查看useTransition文档
          </Button>
        </>
      }
      title="CountTo"
    >
      <Card title="基本用法">
        <div className="app-count-preview">
          {settings.disabled ? (
            formatCount(settings.endVal, settings)
          ) : (
            <AnimatedCount key={settings.startVal} settings={settings} />
          )}
        </div>
        <Form className="app-count-form" layout="vertical">
          <Form.Item label="初始值">
            <InputNumber
              onChange={(startVal) =>
                setSettings((value) => ({ ...value, startVal: startVal ?? 0 }))
              }
              value={settings.startVal}
            />
          </Form.Item>
          <Form.Item label="当前值">
            <InputNumber
              suffix={
                <Tooltip title="设置一个随机值">
                  <ReloadOutlined
                    onClick={() =>
                      setSettings((value) => ({
                        ...value,
                        endVal: Math.floor(Math.random() * 100_000_000) / 10 ** value.decimals,
                      }))
                    }
                  />
                </Tooltip>
              }
              onChange={(endVal) => setSettings((value) => ({ ...value, endVal: endVal ?? 0 }))}
              precision={settings.decimals}
              value={settings.endVal}
            />
          </Form.Item>
          <Form.Item label="禁用动画">
            <Switch
              checked={settings.disabled}
              onChange={(disabled) => setSettings((value) => ({ ...value, disabled }))}
            />
          </Form.Item>
          <Form.Item label="延迟动画">
            <InputNumber
              min={0}
              onChange={(delay) => setSettings((value) => ({ ...value, delay: delay ?? 0 }))}
              value={settings.delay}
            />
          </Form.Item>
          <Form.Item label="持续时间">
            <InputNumber
              min={0}
              onChange={(duration) =>
                setSettings((value) => ({ ...value, duration: duration ?? 0 }))
              }
              value={settings.duration}
            />
          </Form.Item>
          <Form.Item label="小数位数">
            <InputNumber
              min={0}
              onChange={(decimals) =>
                setSettings((value) => ({ ...value, decimals: decimals ?? 0 }))
              }
              precision={0}
              value={settings.decimals}
            />
          </Form.Item>
          <Form.Item label="分隔符">
            <Input
              onChange={(event) =>
                setSettings((value) => ({ ...value, separator: event.target.value }))
              }
              value={settings.separator}
            />
          </Form.Item>
          <Form.Item label="小数点">
            <Input
              onChange={(event) =>
                setSettings((value) => ({ ...value, decimal: event.target.value }))
              }
              value={settings.decimal}
            />
          </Form.Item>
          <Form.Item label="动画">
            <Select
              onChange={(transition) => setSettings((value) => ({ ...value, transition }))}
              options={countTransitionOptions.map((value) => ({
                label: value,
                value,
              }))}
              value={settings.transition}
            />
          </Form.Item>
          <Form.Item label="前缀">
            <Input
              onChange={(event) =>
                setSettings((value) => ({ ...value, prefix: event.target.value }))
              }
              value={settings.prefix}
            />
          </Form.Item>
          <Form.Item label="后缀">
            <Input
              onChange={(event) =>
                setSettings((value) => ({ ...value, suffix: event.target.value }))
              }
              value={settings.suffix}
            />
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  )
}
