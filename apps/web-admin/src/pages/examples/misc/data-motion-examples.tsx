import { ReloadOutlined } from '@ant-design/icons'
import JsonView from '@uiw/react-json-view'
import { App, Button, Card, Flex, Form, InputNumber, Select } from 'antd'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

import { PageContainer } from '~/components/page-container'

const jsonOne = {
  additionalInfo: {
    author: 'Your Name',
    debug: true,
    version: '1.3.10',
    versionCode: 132,
  },
  additionalNotes: 'This JSON is used for demonstration purposes',
  tools: Array.from({ length: 4 }, (_, index) => ({
    description: `Description of Tool ${index + 1}`,
    name: `Tool ${index + 1}`,
  })),
}

const jsonTwo = {
  choices: [
    {
      finish_reason: 'stop',
      index: 0,
      message: {
        content: 'Hello there, how may I assist you today?',
        role: 'assistant',
      },
    },
  ],
  created: 1_677_652_288,
  debug: {
    logs: [
      {
        extra: ['extra1', 'extra2'],
        message: 'This is a debug message',
        timestamp: '2021-08-01T00:00:00Z',
      },
      {
        extra: ['extra3', 'extra4'],
        message: 'This is another debug message',
        timestamp: '2021-08-01T00:00:01Z',
      },
    ],
    startAt: '2021-08-01T00:00:00Z',
  },
  id: 'chatgpt-123',
  model: 'gpt-3.5-turbo-0613',
  object: 'chat.completion',
  system_fingerprint: 'fp_44709d6fcb',
  usage: {
    completion_tokens: 12,
    debug_mode: true,
    prompt_tokens: 9,
    total_tokens: 21,
  },
}

export function JsonViewerExample() {
  const { message } = App.useApp()
  return (
    <PageContainer
      description="一个渲染 JSON 结构数据的组件，支持复制、展开等，简单易用"
      title="Json Viewer"
    >
      <Card className="app-demo-card" title="默认配置">
        <JsonView value={jsonOne} />
      </Card>
      <Card className="app-demo-card" title="可复制、默认展开3层、显示边框、事件处理">
        <div
          className="app-json-viewer-boxed"
          onClick={(event) => {
            const target = event.target
            if (!(target instanceof Element)) return
            const key = target.closest('.w-rjv-object-key')
            if (key) {
              void message.info(`点击了Key ${key.textContent ?? ''}`)
              return
            }
            const value = target.closest('.w-rjv-value')
            if (!value) return
            const rawValue = value.textContent ?? ''
            let parsedValue: unknown = rawValue
            try {
              parsedValue = JSON.parse(rawValue)
            } catch {
              parsedValue = rawValue
            }
            void message.info(`点击了Value ${JSON.stringify(parsedValue)}`)
          }}
          role="presentation"
        >
          <JsonView
            collapsed={3}
            enableClipboard
            onCopied={() => void message.success('已复制JSON')}
            value={jsonTwo}
          />
        </div>
      </Card>
      <Card className="app-demo-card" title="预览模式">
        <JsonView collapsed={2} enableClipboard value={jsonTwo} />
      </Card>
    </PageContainer>
  )
}

const motionPresetOptions = [
  'fade',
  'pop',
  'slide-left',
  'slide-right',
  'slide-bottom',
  'slide-top',
] as const

function motionInitial(preset: (typeof motionPresetOptions)[number]) {
  if (preset === 'pop') return { opacity: 0, scale: 0.6 }
  if (preset === 'slide-left') return { opacity: 0, x: -60 }
  if (preset === 'slide-right') return { opacity: 0, x: 60 }
  if (preset === 'slide-bottom') return { opacity: 0, y: 60 }
  if (preset === 'slide-top') return { opacity: 0, y: -60 }
  return { opacity: 0 }
}

interface MotionSettings {
  delay: number
  duration: number
  hoverScale: number
  preset: (typeof motionPresetOptions)[number]
  tapScale: number
}

function MotionSettingsForm({
  settings,
  setSettings,
}: {
  settings: MotionSettings
  setSettings: (next: MotionSettings) => void
}) {
  return (
    <Form className="app-motion-settings" layout="vertical">
      <Form.Item label="动画效果">
        <Select
          onChange={(preset) => setSettings({ ...settings, preset })}
          options={motionPresetOptions.map((preset) => ({ label: preset, value: preset }))}
          value={settings.preset}
        />
      </Form.Item>
      <Form.Item label="持续时间">
        <InputNumber
          min={0}
          onChange={(duration) => setSettings({ ...settings, duration: duration ?? 0 })}
          value={settings.duration}
        />
      </Form.Item>
      <Form.Item label="延迟动画">
        <InputNumber
          min={0}
          onChange={(delay) => setSettings({ ...settings, delay: delay ?? 0 })}
          value={settings.delay}
        />
      </Form.Item>
      <Form.Item label="Hover缩放">
        <InputNumber
          max={2}
          min={0}
          onChange={(hoverScale) => setSettings({ ...settings, hoverScale: hoverScale ?? 1 })}
          step={0.1}
          value={settings.hoverScale}
        />
      </Form.Item>
      <Form.Item label="按下时缩放">
        <InputNumber
          max={2}
          min={0}
          onChange={(tapScale) => setSettings({ ...settings, tapScale: tapScale ?? 1 })}
          step={0.1}
          value={settings.tapScale}
        />
      </Form.Item>
    </Form>
  )
}

export function MotionExample() {
  const [directiveKey, setDirectiveKey] = useState(0)
  const [componentKey, setComponentKey] = useState(0)
  const [groupKey, setGroupKey] = useState(0)
  const [settings, setSettingsState] = useState<MotionSettings>({
    delay: 0,
    duration: 300,
    hoverScale: 1.1,
    preset: 'fade',
    tapScale: 0.9,
  })
  const [groupSettings, setGroupSettingsState] = useState<MotionSettings>({ ...settings })

  function updateSettings(next: MotionSettings) {
    setSettingsState(next)
    setComponentKey((value) => value + 1)
  }

  function updateGroupSettings(next: MotionSettings) {
    setGroupSettingsState(next)
    setGroupKey((value) => value + 1)
  }

  return (
    <PageContainer
      description={
        <>
          一个易于使用的为其它组件赋予动画效果的组件。
          <Button
            onClick={() => window.open('https://motion.dev/docs/react', '_blank')}
            type="link"
          >
            查看文档
          </Button>
        </>
      }
      title="Motion"
    >
      <Card
        className="app-demo-card"
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={() => setDirectiveKey((value) => value + 1)}
            type="primary"
          >
            重载
          </Button>
        }
        title="使用指令"
      >
        <Flex gap={8} key={directiveKey} wrap>
          {motionPresetOptions.map((preset) => (
            <motion.div
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              initial={motionInitial(preset)}
              key={preset}
              transition={{ duration: preset === 'pop' ? 0.5 : 0.3 }}
            >
              <Button>{preset}</Button>
            </motion.div>
          ))}
        </Flex>
      </Card>
      <Card className="app-demo-card" title="使用组件（将内部作为一个整体添加动画）">
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            className="app-motion-stage"
            initial={motionInitial(settings.preset)}
            key={componentKey}
            transition={{ delay: settings.delay / 1000, duration: settings.duration / 1000 }}
            whileHover={{ scale: settings.hoverScale }}
            whileTap={{ scale: settings.tapScale }}
          >
            <Button size="large">这个按钮在显示时会有动画效果</Button>
            <span>附属组件，会作为整体处理动画</span>
          </motion.div>
        </AnimatePresence>
        <div className="app-motion-stage">
          <span>顺序延迟</span>
          {Array.from({ length: 5 }, (_, index) => (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.7 }}
              key={`${componentKey}-${index}`}
              transition={{ delay: (settings.delay + index * 100) / 1000 }}
            >
              <Button size="large">按钮{index + 1}</Button>
            </motion.div>
          ))}
        </div>
        <MotionSettingsForm setSettings={updateSettings} settings={settings} />
      </Card>
      <Card className="app-demo-card" title="分组动画（每个子元素都会应用相同的独立动画）">
        <div className="app-motion-stage">
          {Array.from({ length: 5 }, (_, index) => (
            <motion.div
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              initial={motionInitial(groupSettings.preset)}
              key={`${groupKey}-${index}`}
              transition={{
                delay: (groupSettings.delay + index * 70) / 1000,
                duration: groupSettings.duration / 1000,
              }}
              whileHover={{ scale: groupSettings.hoverScale }}
              whileTap={{ scale: groupSettings.tapScale }}
            >
              <Button size="large">按钮{index + 1}</Button>
            </motion.div>
          ))}
        </div>
        <MotionSettingsForm setSettings={updateGroupSettings} settings={groupSettings} />
      </Card>
    </PageContainer>
  )
}
