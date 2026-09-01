import { Icon } from '@iconify/react'
import { App, Button, Card, Dropdown, Flex, Form, InputNumber, Radio, Spin, Switch } from 'antd'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { ButtonList } from '~/components/button-list'
import { PageContainer } from '~/components/page-container'

function useTimedLoading() {
  const [loading, setLoading] = useState(false)
  function start() {
    setLoading(true)
    window.setTimeout(() => setLoading(false), 3000)
  }
  return [loading, start] as const
}

function LoadingPanel({
  children,
  loading,
  text,
  variant = 'default',
}: {
  children: ReactNode
  loading: boolean
  text?: string
  variant?: 'bars' | 'default' | 'ring'
}) {
  return (
    <div className="app-loading-panel">
      {children}
      {loading ? (
        <div className="app-loading-mask">
          <span className={`app-loading-spinner is-${variant}`} />
          {text ? <span>{text}</span> : null}
        </div>
      ) : null}
    </div>
  )
}

export function LoadingExample() {
  const [spinning, startSpinning] = useTimedLoading()
  const [loading, startLoading] = useTimedLoading()
  const [directiveLoading, startDirectiveLoading] = useTimedLoading()
  const [spinnerLoading, startSpinnerLoading] = useTimedLoading()
  return (
    <PageContainer
      description="加载中状态组件。这个组件可以为其它作为容器的组件添加一个加载中的遮罩层。使用它们时，容器需要relative定位。"
      title="Loading 加载组件"
    >
      <Card
        actions={[<span key="hint">这是Antd 组件库自带的Spin组件演示</span>]}
        className="app-demo-card"
        title="Antd Spin"
      >
        <Spin description="加载中..." spinning={spinning}>
          <Button onClick={startSpinning} type="primary">
            显示Spin
          </Button>
        </Spin>
      </Card>
      <LoadingPanel loading={directiveLoading} text="正在加载...">
        <Card
          actions={[
            <span key="hint">Loading组件可以设置文字，并且也提供了icon插槽用于替换加载图标。</span>,
          ]}
          className="app-demo-card"
          extra={
            <Button onClick={startDirectiveLoading} type="primary">
              显示加载状态
            </Button>
          }
          title="自定义 Loading"
        >
          <Flex gap={16} wrap>
            <LoadingPanel loading={loading} text="正在加载...">
              <div className="app-loading-demo-tile">
                <Button onClick={startLoading} type="primary">
                  默认动画
                </Button>
              </div>
            </LoadingPanel>
            <LoadingPanel loading={loading} variant="ring">
              <div className="app-loading-demo-tile">
                <Button onClick={startLoading} type="primary">
                  自定义动画1
                </Button>
              </div>
            </LoadingPanel>
            <LoadingPanel loading={loading} variant="bars">
              <div className="app-loading-demo-tile">
                <Button onClick={startLoading} type="primary">
                  自定义动画2
                </Button>
              </div>
            </LoadingPanel>
          </Flex>
        </Card>
      </LoadingPanel>
      <LoadingPanel loading={spinnerLoading}>
        <Card
          actions={[
            <span key="hint">Spinner组件是Loading组件的一个特例，只有一个固定的统一样式。</span>,
          ]}
          className="app-demo-card"
          extra={
            <Button onClick={startSpinnerLoading} type="primary">
              显示 Spinner
            </Button>
          }
          title="Spinner"
        >
          <div className="app-loading-demo-tile">
            <Button onClick={startSpinning} type="primary">
              显示Spinner
            </Button>
          </div>
        </Card>
      </LoadingPanel>
    </PageContainer>
  )
}

const buttonOptions = [
  { label: '选项1', value: 'a' },
  { label: '选项2', num: 999, value: 'b' },
  { label: '选项3', value: 'c' },
  { label: '选项4', value: 'd' },
  { label: '选项5', value: 'e' },
  { label: '选项6', value: 'f' },
]

interface DemoCheckButtonGroupProps {
  allowClear?: boolean
  beforeChange?: ((value: string, checked: boolean) => Promise<boolean>) | undefined
  customOption?: boolean
  disabled?: boolean
  gap: number
  iconMode?: 'circle' | 'square'
  multiple?: boolean
  onChange: (value: string | string[] | undefined) => void
  showIcon: boolean
  size: 'large' | 'middle' | 'small'
  value: string | string[] | undefined
  maxCount?: number
}

function DemoCheckButtonGroup({
  allowClear = false,
  beforeChange,
  customOption = false,
  disabled = false,
  gap,
  iconMode = 'circle',
  maxCount = 0,
  multiple = false,
  onChange,
  showIcon,
  size,
  value,
}: DemoCheckButtonGroupProps) {
  const [loadingValues, setLoadingValues] = useState<string[]>([])
  const selectedValues = Array.isArray(value) ? value : value === undefined ? [] : [value]

  async function select(nextValue: string) {
    const checked = selectedValues.includes(nextValue)
    if (beforeChange) {
      setLoadingValues((current) => [...current, nextValue])
      let canChange = false
      try {
        canChange = await beforeChange(nextValue, !checked)
      } catch {
        canChange = false
      }
      setLoadingValues((current) => current.filter((item) => item !== nextValue))
      if (!canChange) return
    }

    if (!multiple) {
      onChange(allowClear && checked ? undefined : nextValue)
      return
    }
    if (checked) {
      onChange(selectedValues.filter((item) => item !== nextValue))
      return
    }
    const next =
      maxCount > 0 && selectedValues.length >= maxCount
        ? selectedValues.slice(0, maxCount - 1)
        : [...selectedValues]
    onChange([...next, nextValue])
  }

  return (
    <Flex className={`app-check-button-group${gap ? ' has-gap' : ' no-gap'}`} gap={gap} wrap>
      {buttonOptions.map((item) => {
        const checked = selectedValues.includes(item.value)
        const loading = loadingValues.includes(item.value)
        return (
          <Button
            disabled={disabled || loading || (!multiple && loadingValues.length > 0)}
            key={item.value}
            loading={loading}
            onClick={() => void select(item.value)}
            size={size}
            type={checked ? 'primary' : 'default'}
          >
            {showIcon && !loading ? (
              <span className="app-check-button-group__icon">
                <Icon
                  icon={
                    iconMode === 'square'
                      ? checked
                        ? 'lucide:square-check-big'
                        : 'lucide:square'
                      : checked
                        ? 'lucide:circle-check-big'
                        : 'lucide:circle'
                  }
                />
              </span>
            ) : null}
            {customOption ? (
              <span>
                {item.label}
                <small className="app-check-button-group__meta">{item.value}</small>
                {item.num ? (
                  <small className="app-check-button-group__meta">{item.num}</small>
                ) : null}
              </span>
            ) : (
              item.label
            )}
          </Button>
        )
      })}
    </Flex>
  )
}

export function ButtonGroupExample() {
  const { message } = App.useApp()
  const [radioValue, setRadioValue] = useState<string | undefined>('a')
  const [checkValue, setCheckValue] = useState<string[]>(['a', 'b'])
  const [size, setSize] = useState<'large' | 'middle' | 'small'>('middle')
  const [gap, setGap] = useState<0 | 1 | 2 | 4 | 8>(0)
  const [showIcon, setShowIcon] = useState(true)
  const [disabled, setDisabled] = useState(false)
  const [beforeChange, setBeforeChange] = useState(false)
  const [allowClear, setAllowClear] = useState(false)
  const [maxCount, setMaxCount] = useState(0)

  async function beforeValueChange(value: string, checked: boolean) {
    message.loading({
      content: `正在设置${value}为${checked ? '选中' : '未选中'}...`,
      duration: 0,
      key: 'beforeChange',
    })
    await new Promise((resolve) => window.setTimeout(resolve, 2000))
    await message.success({ content: `${value} 已设置成功`, key: 'beforeChange' })
    return true
  }

  return (
    <PageContainer
      description="ButtonList 统一处理按钮间距、默认样式、权限、确认与溢出菜单；选择按钮组专注表单值。"
      title="按钮组与选择按钮组"
    >
      <Card
        className="app-demo-card"
        extra={
          <Button
            onClick={() => {
              setRadioValue(undefined)
              setCheckValue([])
            }}
            type="primary"
          >
            清空值
          </Button>
        }
        title="基本用法"
      >
        <p>按钮组：</p>
        <ButtonList
          disabled={disabled}
          gap={gap}
          list={buttonOptions.map((option) => ({
            key: option.value,
            label: option.label,
            onClick: () =>
              void message.success(`点击了按钮${option.label}，value = ${option.value}`),
          }))}
          size={size}
          type="link"
        />
        <ButtonList
          className="app-button-outline-group"
          disabled={disabled}
          gap={gap}
          list={[
            ...buttonOptions.map((option) => ({
              key: option.value,
              label: option.label,
              onClick: () =>
                void message.success(`点击了按钮${option.label}，value = ${option.value}`),
            })),
            {
              danger: true,
              key: 'delete',
              label: '删除',
              popconfirm: { description: '此操作仅用于演示', title: '确认删除？' },
            },
          ]}
          max={4}
          size={size}
        />
        <p>单选：{radioValue}</p>
        <DemoCheckButtonGroup
          allowClear={allowClear}
          beforeChange={beforeChange ? beforeValueChange : undefined}
          disabled={disabled}
          gap={gap}
          onChange={(next) => setRadioValue(typeof next === 'string' ? next : undefined)}
          showIcon={showIcon}
          size={size}
          value={radioValue}
        />
        <p>单选插槽：{radioValue}</p>
        <DemoCheckButtonGroup
          allowClear={allowClear}
          beforeChange={beforeChange ? beforeValueChange : undefined}
          customOption
          disabled={disabled}
          gap={gap}
          onChange={(next) => setRadioValue(typeof next === 'string' ? next : undefined)}
          showIcon={showIcon}
          size={size}
          value={radioValue}
        />
        <p>多选 {JSON.stringify(checkValue)}</p>
        <DemoCheckButtonGroup
          beforeChange={beforeChange ? beforeValueChange : undefined}
          disabled={disabled}
          gap={gap}
          maxCount={maxCount}
          multiple
          onChange={(next) => setCheckValue(Array.isArray(next) ? next : [])}
          showIcon={showIcon}
          size={size}
          value={checkValue}
        />
        <p>自定义图标 {JSON.stringify(checkValue)}</p>
        <DemoCheckButtonGroup
          beforeChange={beforeChange ? beforeValueChange : undefined}
          disabled={disabled}
          gap={gap}
          iconMode="square"
          maxCount={maxCount}
          multiple
          onChange={(next) => setCheckValue(Array.isArray(next) ? next : [])}
          showIcon={showIcon}
          size={size}
          value={checkValue}
        />
      </Card>
      <Card className="app-demo-card" title="设置">
        <Form className="app-button-settings" labelCol={{ flex: '150px' }}>
          <Form.Item label="尺寸">
            <Radio.Group
              onChange={(event) => setSize(event.target.value)}
              options={[
                { label: '大', value: 'large' },
                { label: '中', value: 'middle' },
                { label: '小', value: 'small' },
              ]}
              value={size}
            />
          </Form.Item>
          <Form.Item label="间距">
            <Radio.Group
              onChange={(event) => setGap(event.target.value)}
              options={[
                { label: '无', value: 0 },
                { label: '紧凑', value: 1 },
                { label: '小', value: 2 },
                { label: '中', value: 4 },
                { label: '大', value: 8 },
              ]}
              value={gap}
            />
          </Form.Item>
          <Form.Item label="显示图标">
            <Switch checked={showIcon} onChange={setShowIcon} />
          </Form.Item>
          <Form.Item label="禁用">
            <Switch checked={disabled} onChange={setDisabled} />
          </Form.Item>
          <Form.Item label="前置回调">
            <Switch checked={beforeChange} onChange={setBeforeChange} />
          </Form.Item>
          <Form.Item help="单选时是否允许取消选中（值为undefined）" label="允许清除">
            <Switch checked={allowClear} onChange={setAllowClear} />
          </Form.Item>
          <Form.Item help="多选时有效，0表示不限制" label="最大选中数量">
            <InputNumber min={0} onChange={(value) => setMaxCount(value ?? 0)} value={maxCount} />
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  )
}

export function ContextMenuExample() {
  const { message } = App.useApp()
  return (
    <PageContainer title="Context Menu 上下文菜单">
      <Card title="基本使用">
        <div>一共四个菜单（刷新、关闭当前、关闭其他、关闭所有）</div>
        <div className="app-context-menu-demo">
          <Dropdown
            menu={{
              items: [
                { key: 'refresh', label: '刷新' },
                { key: 'close-other', label: '关闭其他' },
                { key: 'close-all', label: '关闭所有' },
              ],
              onClick: ({ key }) =>
                void message.success(
                  key === 'refresh' ? '刷新成功' : key === 'close-other' ? '关闭其他' : '关闭所有',
                ),
            }}
            trigger={['contextMenu']}
          >
            <Button>右键点击我打开上下文菜单(有隐藏项)</Button>
          </Dropdown>
        </div>
      </Card>
    </PageContainer>
  )
}
