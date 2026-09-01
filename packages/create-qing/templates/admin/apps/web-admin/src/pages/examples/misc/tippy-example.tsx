import { Button, Card, Flex, Form, Input, InputNumber, Radio, Select, Switch } from 'antd'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import createTippy, { followCursor as followCursorPlugin } from 'tippy.js'
import type { Placement, Props as TippyProps } from 'tippy.js'

import { PageContainer } from '~/components/page-container'

import 'tippy.js/animations/shift-away.css'
import 'tippy.js/dist/tippy.css'

type FollowCursor = boolean | 'horizontal' | 'initial' | 'vertical'

type NativeTippyProps = {
  children: ReactNode
  content: string
} & Partial<
  Pick<
    TippyProps,
    | 'animation'
    | 'arrow'
    | 'delay'
    | 'duration'
    | 'followCursor'
    | 'hideOnClick'
    | 'inertia'
    | 'maxWidth'
    | 'placement'
    | 'theme'
    | 'trigger'
  >
>

function NativeTippy({
  animation = 'fade',
  arrow = true,
  children,
  content,
  delay = 0,
  duration = 300,
  followCursor = false,
  hideOnClick = true,
  inertia = false,
  maxWidth = 350,
  placement = 'top',
  theme = '',
  trigger = 'mouseenter focus',
}: NativeTippyProps) {
  const reference = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!reference.current) return undefined
    const instance = createTippy(reference.current, {
      animation,
      arrow,
      content,
      delay,
      duration,
      followCursor,
      hideOnClick,
      inertia,
      maxWidth,
      placement,
      plugins: [followCursorPlugin],
      theme,
      trigger,
    })
    return () => instance.destroy()
  }, [
    animation,
    arrow,
    content,
    delay,
    duration,
    followCursor,
    hideOnClick,
    inertia,
    maxWidth,
    placement,
    theme,
    trigger,
  ])

  return (
    <span className="app-tippy-reference" ref={reference}>
      {children}
    </span>
  )
}

interface TippySettings {
  animation: 'fade' | 'perspective' | 'scale' | 'shift-away' | 'shift-toward'
  arrow: boolean
  content: string
  delayHide: number
  delayShow: number
  duration: number
  followCursor: FollowCursor
  hideOnClick: boolean | 'toggle'
  inertia: boolean
  maxWidth: number | string
  placement: Placement
  theme: 'auto' | 'dark' | 'light'
  trigger: string[]
}

const placementOptions: Array<{ label: string; value: Placement }> = [
  { label: '顶部', value: 'top' },
  { label: '顶左', value: 'top-start' },
  { label: '顶右', value: 'top-end' },
  { label: '底部', value: 'bottom' },
  { label: '底左', value: 'bottom-start' },
  { label: '底右', value: 'bottom-end' },
  { label: '左侧', value: 'left' },
  { label: '左上', value: 'left-start' },
  { label: '左下', value: 'left-end' },
  { label: '右侧', value: 'right' },
  { label: '右上', value: 'right-start' },
  { label: '右下', value: 'right-end' },
]

export function TippyExample() {
  const [settings, setSettings] = useState<TippySettings>({
    animation: 'shift-away',
    arrow: true,
    content: '这是一个提示',
    delayHide: 100,
    delayShow: 100,
    duration: 200,
    followCursor: false,
    hideOnClick: false,
    inertia: true,
    maxWidth: 'none',
    placement: 'top',
    theme: 'dark',
    trigger: ['mouseenter', 'focus'],
  })
  const trigger = settings.trigger.join(' ')

  return (
    <PageContainer
      description={
        <>
          Tippy 是一个轻量级的提示工具库，它可以用来创建各种交互式提示，如工具提示、引导提示等。
          <Button
            onClick={() => window.open('https://atomiks.github.io/tippyjs/v6/all-props/', '_blank')}
            size="small"
            type="link"
          >
            查看文档
          </Button>
        </>
      }
      title="Tippy"
    >
      <Card className="app-demo-card" title="指令形式使用">
        <p>
          指令形式使用比较简洁，直接在需要展示tooltip的组件上用v-tippy传递配置，适用于固定内容的工具提示。
        </p>
        <Flex align="center" gap={20} wrap>
          <NativeTippy content="这是一个提示，使用了默认的配置">
            <Button>默认配置</Button>
          </NativeTippy>
          <NativeTippy content="这是一个提示，总是light主题" theme="light">
            <Button>指定主题</Button>
          </NativeTippy>
          <NativeTippy content="这个提示将在点燃组件100毫秒后激活" delay={100} theme="light">
            <Button>指定延时</Button>
          </NativeTippy>
          <NativeTippy animation="scale" content="本提示的动画为`scale`">
            <Button>指定动画</Button>
          </NativeTippy>
        </Flex>
      </Card>
      <Card className="app-demo-card" title="组件形式使用">
        <div className="app-tippy-preview">
          <NativeTippy
            animation={settings.animation}
            arrow={settings.arrow}
            content={settings.content}
            delay={[settings.delayShow, settings.delayHide]}
            duration={settings.duration}
            followCursor={settings.followCursor}
            hideOnClick={settings.hideOnClick}
            inertia={settings.inertia}
            maxWidth={settings.maxWidth}
            placement={settings.placement}
            trigger={trigger}
            {...(settings.theme === 'auto' ? {} : { theme: settings.theme })}
          >
            <Button>鼠标移到这个组件上来体验效果</Button>
          </NativeTippy>
        </div>
        <Form className="app-tippy-form" layout="vertical">
          <Form.Item label="主题">
            <Radio.Group
              buttonStyle="solid"
              onChange={(event) =>
                setSettings((current) => ({ ...current, theme: event.target.value }))
              }
              optionType="button"
              options={[
                { label: '自动', value: 'auto' },
                { label: '暗色', value: 'dark' },
                { label: '亮色', value: 'light' },
              ]}
              value={settings.theme}
            />
          </Form.Item>
          <Form.Item label="动画类型">
            <Select
              onChange={(animation) => setSettings((current) => ({ ...current, animation }))}
              options={[
                { label: '向上滑入', value: 'shift-away' },
                { label: '向下滑入', value: 'shift-toward' },
                { label: '缩放', value: 'scale' },
                { label: '透视', value: 'perspective' },
                { label: '淡入', value: 'fade' },
              ]}
              value={settings.animation}
            />
          </Form.Item>
          <Form.Item label="位置">
            <Select
              onChange={(placement) => setSettings((current) => ({ ...current, placement }))}
              options={placementOptions}
              value={settings.placement}
            />
          </Form.Item>
          <Form.Item label="动画时长">
            <InputNumber
              min={0}
              onChange={(value) => setSettings((current) => ({ ...current, duration: value ?? 0 }))}
              suffix="毫秒"
              value={settings.duration}
            />
          </Form.Item>
          <Form.Item label="显示延时">
            <InputNumber
              min={0}
              onChange={(value) =>
                setSettings((current) => ({ ...current, delayShow: value ?? 0 }))
              }
              suffix="毫秒"
              value={settings.delayShow}
            />
          </Form.Item>
          <Form.Item label="隐藏延时">
            <InputNumber
              min={0}
              onChange={(value) =>
                setSettings((current) => ({ ...current, delayHide: value ?? 0 }))
              }
              suffix="毫秒"
              value={settings.delayHide}
            />
          </Form.Item>
          <Form.Item label="内容">
            <Input
              onChange={(event) =>
                setSettings((current) => ({ ...current, content: event.target.value }))
              }
              value={settings.content}
            />
          </Form.Item>
          <Form.Item label="指示箭头">
            <Switch
              checked={settings.arrow}
              onChange={(arrow) => setSettings((current) => ({ ...current, arrow }))}
            />
          </Form.Item>
          <Form.Item label="动画惯性">
            <Switch
              checked={settings.inertia}
              onChange={(inertia) => setSettings((current) => ({ ...current, inertia }))}
            />
          </Form.Item>
          <Form.Item label="跟随指针">
            <Select
              onChange={(nextFollowCursor) =>
                setSettings((current) => ({ ...current, followCursor: nextFollowCursor }))
              }
              options={[
                { label: '不跟随', value: false },
                { label: '完全跟随', value: true },
                { label: '仅横向', value: 'horizontal' },
                { label: '仅纵向', value: 'vertical' },
                { label: '仅初始', value: 'initial' },
              ]}
              value={settings.followCursor}
            />
          </Form.Item>
          <Form.Item label="触发方式">
            <Select
              mode="multiple"
              onChange={(values) => setSettings((current) => ({ ...current, trigger: values }))}
              options={[
                { label: '鼠标移入', value: 'mouseenter' },
                { label: '被点击', value: 'click' },
                { label: '获得焦点', value: 'focusin' },
                { label: '无触发，仅手动', value: 'manual' },
              ]}
              value={settings.trigger}
            />
          </Form.Item>
          <Form.Item help="只有在触发方式为 click 时才有效" label="点击后隐藏">
            <Select
              disabled={!settings.trigger.includes('click')}
              onChange={(hideOnClick) => setSettings((current) => ({ ...current, hideOnClick }))}
              options={[
                { label: '否', value: false },
                { label: '是', value: true },
                { label: '仅内部', value: 'toggle' },
              ]}
              value={settings.hideOnClick}
            />
          </Form.Item>
          <Form.Item label="最大宽度">
            <Input
              onChange={(event) =>
                setSettings((current) => {
                  const input = event.target.value.trim()
                  const numericWidth = Number(input)
                  return {
                    ...current,
                    maxWidth:
                      input && Number.isFinite(numericWidth) ? numericWidth : input || 'none',
                  }
                })
              }
              placeholder="none、200px"
              value={settings.maxWidth}
            />
          </Form.Item>
        </Form>
        <p className="app-tippy-more">
          更多配置请
          <Button
            onClick={() => window.open('https://atomiks.github.io/tippyjs/v6/all-props/', '_blank')}
            size="small"
            type="link"
          >
            查看文档
          </Button>
          ，这里只列出了一些常用的配置
        </p>
      </Card>
    </PageContainer>
  )
}
