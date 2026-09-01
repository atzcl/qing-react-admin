import { Icon } from '@iconify/react'
import { Card, Input, Select, Space } from 'antd'
import { useState } from 'react'

import { PageContainer } from '~/components/page-container'

const iconifyOptions = [
  'ant-design:trademark-outlined',
  'mdi:alien-outline',
  'mdi-light:book-multiple',
  'ant-design:alipay-circle-outlined',
  'ant-design:account-book-filled',
  'ant-design:container-outlined',
  'svg-spinners:wind-toy',
  'svg-spinners:blocks-wave',
  'line-md:compass-filled-loop',
]

function IconPreview({ name }: { name: string }) {
  if (name.startsWith('svg:')) {
    return <img alt="" className="app-local-svg-icon" src={`/app-icons/${name.slice(4)}.svg`} />
  }
  return <Icon icon={name} />
}

const brandIcons = [
  ['/auth-icons/github.svg', 'Github'],
  ['/auth-icons/google.svg', 'Google'],
  ['/auth-icons/qqchat.svg', 'QQ'],
  ['/auth-icons/wechat.svg', 'WeChat'],
] as const

const localSvgIcons = [
  'avatar-1',
  'avatar-2',
  'avatar-3',
  'avatar-4',
  'cake',
  'bell',
  'card',
  'download',
] as const

function IconPicker({
  onChange,
  prefix,
  value,
}: {
  onChange: (value: string) => void
  prefix?: string
  value: string
}) {
  const options =
    prefix === 'svg'
      ? ['svg:avatar-1', 'svg:avatar-2', 'svg:avatar-3', 'svg:avatar-4']
      : iconifyOptions
  return (
    <Select
      className="app-icon-picker"
      onChange={onChange}
      options={options.map((name) => ({
        label: name,
        value: name,
      }))}
      prefix={<IconPreview name={value} />}
      showSearch={{ optionFilterProp: 'label' }}
      value={value}
    />
  )
}

export function IconsDemo() {
  const [iconValue1, setIconValue1] = useState('ant-design:trademark-outlined')
  const [iconValue2, setIconValue2] = useState('svg:avatar-1')
  const [iconValue3, setIconValue3] = useState('mdi:alien-outline')
  const [iconValue4, setIconValue4] = useState('mdi-light:book-multiple')

  return (
    <PageContainer
      description={
        <div className="app-icons-description">
          图标可在{' '}
          <a href="https://icon-sets.iconify.design/" rel="noreferrer" target="_blank">
            Iconify
          </a>{' '}
          中查找，支持多种图标库，如 Material Design, Font Awesome, Jam Icons 等。
        </div>
      }
      title="图标"
    >
      <Card className="app-demo-card" title="Iconify">
        <Space className="app-icon-row" size={20}>
          {brandIcons.map(([src, name]) => (
            <img alt={name} key={src} src={src} />
          ))}
          <Icon icon="mdi:keyboard-esc" />
        </Space>
      </Card>

      <Card className="app-demo-card" title="Svg Icons">
        <Space className="app-icon-row" size={20}>
          {localSvgIcons.map((name) => (
            <img alt={name} key={name} src={`/app-icons/${name}.svg`} />
          ))}
        </Space>
      </Card>

      <Card className="app-demo-card" title="Tailwind CSS">
        <Space className="app-icon-row is-large" size={20}>
          <Icon icon="ant-design:alipay-circle-outlined" />
          <Icon icon="ant-design:account-book-filled" />
          <Icon icon="ant-design:container-outlined" />
          <Icon icon="svg-spinners:wind-toy" />
          <Icon icon="svg-spinners:blocks-wave" />
          <Icon icon="line-md:compass-filled-loop" />
        </Space>
      </Card>

      <Card className="app-demo-card" title="图标选择器">
        <div className="app-icon-picker-row">
          <span>原始样式(Iconify):</span>
          <IconPicker onChange={setIconValue1} value={iconValue1} />
        </div>
        <div className="app-icon-picker-row">
          <span>原始样式(svg):</span>
          <IconPicker onChange={setIconValue2} prefix="svg" value={iconValue2} />
        </div>
        <div className="app-icon-picker-row">
          <span>自定义Input:</span>
          <Input
            onChange={(event) => setIconValue3(event.target.value)}
            suffix={<IconPreview name={iconValue3} />}
            value={iconValue3}
          />
        </div>
        <div className="app-icon-picker-row">
          <span>显示为一个Icon:</span>
          <Input
            allowClear
            onChange={(event) => setIconValue4(event.target.value)}
            placeholder="点击这里选择图标"
            suffix={<IconPreview name={iconValue4} />}
            value={iconValue4}
          />
        </div>
      </Card>
    </PageContainer>
  )
}
