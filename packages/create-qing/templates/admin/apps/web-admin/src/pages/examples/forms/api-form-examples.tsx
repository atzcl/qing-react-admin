import { App, Alert, Button, Card, Form, Input, Select, Space, Steps, Switch } from 'antd'
import type { ComponentRef } from 'react'
import { useRef, useState } from 'react'

import { PageContainer } from '~/components/page-container'

const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
]

export function ApiFormExample() {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [disabled, setDisabled] = useState(false)
  const [reverseActions, setReverseActions] = useState(false)
  const [resetDisabled, setResetDisabled] = useState(false)
  const [showActions, setShowActions] = useState(true)
  const [showReset, setShowReset] = useState(true)
  const [showSubmit, setShowSubmit] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [actionCentered, setActionCentered] = useState(false)
  const [labelWidth, setLabelWidth] = useState(100)
  const [extraFields, setExtraFields] = useState<number[]>([])
  const [selectOptions, setSelectOptions] = useState(options)
  const selectRef = useRef<ComponentRef<typeof Select>>(null)

  function updateSelectSchema() {
    setSelectOptions([...options, { label: '选项3', value: '3' }])
    void message.success('字段 `fieldOptions` 下拉选项更新成功。')
  }

  return (
    <PageContainer description="表单组件api操作示例。" title="表单组件">
      <Space className="app-api-actions" wrap>
        <Button onClick={updateSelectSchema}>updateSchema</Button>
        <Button onClick={() => setLabelWidth(150)}>更改labelWidth</Button>
        <Button onClick={() => setLabelWidth(100)}>还原labelWidth</Button>
        <Button onClick={() => setDisabled(true)}>禁用表单</Button>
        <Button onClick={() => setDisabled(false)}>解除禁用</Button>
        <Button onClick={() => setReverseActions((value) => !value)}>翻转操作按钮位置</Button>
        <Button onClick={() => setShowActions(false)}>隐藏操作按钮</Button>
        <Button onClick={() => setShowActions(true)}>显示操作按钮</Button>
        <Button onClick={() => setShowReset(false)}>隐藏重置按钮</Button>
        <Button onClick={() => setShowReset(true)}>显示重置按钮</Button>
        <Button onClick={() => setShowSubmit(false)}>隐藏提交按钮</Button>
        <Button onClick={() => setShowSubmit(true)}>显示提交按钮</Button>
        <Button onClick={() => setResetDisabled(true)}>修改重置按钮</Button>
        <Button onClick={() => setSubmitLoading(true)}>修改提交按钮</Button>
        <Button onClick={() => setActionCentered(true)}>调整操作按钮位置</Button>
        <Button
          onClick={() =>
            setExtraFields((items) => [...items, Date.now(), Date.now() + 1, Date.now() + 2])
          }
        >
          批量添加表单项
        </Button>
        <Button onClick={() => setExtraFields((items) => items.slice(0, -3))}>
          批量删除表单项
        </Button>
        <Button onClick={() => selectRef.current?.focus()}>下拉组件获取焦点</Button>
      </Space>
      <Card title="操作示例">
        <Form
          disabled={disabled}
          form={form}
          labelCol={{ style: { width: labelWidth } }}
          onFinish={(values) => void message.success(`form values: ${JSON.stringify(values)}`)}
        >
          <Form.Item label="field1" name="field1">
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item label="field2" name="field2">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="下拉选" name="fieldOptions">
            <Select
              allowClear
              options={selectOptions}
              placeholder="请选择"
              ref={selectRef}
              showSearch
            />
          </Form.Item>
          {extraFields.map((field) => (
            <Form.Item key={field} label="field+" name={`field${field}`}>
              <Input />
            </Form.Item>
          ))}
          {showActions ? (
            <Form.Item label={null}>
              <Space
                style={{
                  flexDirection: reverseActions ? 'row-reverse' : 'row',
                  justifyContent: actionCentered ? 'center' : 'flex-start',
                  width: '100%',
                }}
              >
                {showSubmit ? (
                  <Button htmlType="submit" loading={submitLoading} type="primary">
                    提交
                  </Button>
                ) : null}
                {showReset ? (
                  <Button disabled={resetDisabled} htmlType="reset">
                    重置
                  </Button>
                ) : null}
              </Space>
            </Form.Item>
          ) : null}
        </Form>
      </Card>
    </PageContainer>
  )
}

export function MergeFormExample() {
  const { message } = App.useApp()
  const [first] = Form.useForm()
  const [second] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [needMerge, setNeedMerge] = useState(true)

  async function mergeSubmit() {
    try {
      const [firstValues, secondValues] = await Promise.all([
        first.validateFields(),
        second.validateFields(),
      ])
      const values = needMerge ? { ...firstValues, ...secondValues } : [firstValues, secondValues]
      void message.success(`merged form values: ${JSON.stringify(values)}`)
    } catch {
      // Field-level errors are rendered by Ant Design.
    }
  }

  return (
    <PageContainer
      description="表单组件合并示例：在某些场景下，例如分步表单，需要合并多个表单并统一提交。默认情况下，使用 Object.assign 规则合并表单。如果需要特殊处理数据，可以传入 false。"
      title="表单组件"
    >
      <Card
        extra={
          <Space>
            <Switch
              checked={needMerge}
              checkedChildren="开启字段合并"
              onChange={setNeedMerge}
              unCheckedChildren="关闭字段合并"
            />
            <Button onClick={() => void mergeSubmit()} type="primary">
              合并提交
            </Button>
          </Space>
        }
        title="基础示例"
      >
        <div className="app-merge-step-form">
          <Steps current={currentStep} items={[{ title: '表单1' }, { title: '表单2' }]} />
          <div className="app-merge-step-form__body">
            <Form
              form={first}
              onFinish={(values) => {
                void message.success(`form1 values: ${JSON.stringify(values)}`)
                setCurrentStep(1)
              }}
              style={currentStep === 0 ? undefined : { display: 'none' }}
            >
              <Form.Item
                label="表单1字段"
                name="formFirst"
                rules={[{ message: '请输入', required: true }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item label={null}>
                <Button htmlType="submit" type="primary">
                  下一步
                </Button>
              </Form.Item>
            </Form>
            <Form
              form={second}
              onFinish={(values) => void message.success(`form2 values: ${JSON.stringify(values)}`)}
              style={currentStep === 1 ? undefined : { display: 'none' }}
            >
              <Form.Item
                label="表单2字段"
                name="formSecond"
                rules={[{ message: '请输入', required: true }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item label={null}>
                <Space>
                  <Button onClick={() => setCurrentStep(0)}>上一步</Button>
                  <Button htmlType="submit" type="primary">
                    提交
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Card>
    </PageContainer>
  )
}

export function ScrollToErrorFormExample() {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [scrollEnabled, setScrollEnabled] = useState(true)
  const fields = [
    ['username', '用户名'],
    ['email', '邮箱'],
    ['phone', '手机号'],
    ['address', '地址'],
    ['remark', '备注'],
    ['company', '公司名称'],
    ['position', '职位'],
  ] as const

  function scrollToFirstInvalidField() {
    if (!scrollEnabled) return
    const firstInvalidField = form.getFieldsError().find(({ errors }) => errors.length > 0)
    if (firstInvalidField) form.scrollToField(firstInvalidField.name, { block: 'center' })
  }

  async function validateAll() {
    try {
      await form.validateFields()
      void message.success('表单验证通过')
    } catch {
      scrollToFirstInvalidField()
    }
  }

  async function validateUsername() {
    try {
      await form.validateFields(['username'])
      void message.success('用户名字段验证通过')
    } catch {
      scrollToFirstInvalidField()
    }
  }

  return (
    <PageContainer
      description="测试表单验证失败时自动滚动到错误字段的功能"
      title="滚动到错误字段测试"
    >
      <Card
        extra={
          <Space>
            <Switch checked={scrollEnabled} onChange={setScrollEnabled} />
            <span>启用滚动到错误字段</span>
          </Space>
        }
        title="功能测试"
      >
        <Alert
          className="app-demo-card"
          description={
            <ul>
              <li>所有验证方法在验证失败时都会自动滚动到第一个错误字段</li>
              <li>可以通过右上角的开关控制是否启用自动滚动功能</li>
            </ul>
          }
          title="测试说明："
          type="info"
        />
        <Card className="app-demo-card" size="small" title="验证方法测试：">
          <Space wrap>
            <Button onClick={() => form.submit()} type="primary">
              测试 validateAndSubmit()
            </Button>
            <Button onClick={() => void validateAll()}>测试 validate()</Button>
            <Button onClick={() => void validateUsername()}>测试 validateField()</Button>
          </Space>
          <div className="app-demo-result">
            <p>• validateAndSubmit(): 验证表单并提交</p>
            <p>• validate(): 手动验证整个表单</p>
            <p>• validateField(): 验证单个字段（这里测试用户名字段）</p>
          </div>
        </Card>
        <Card className="app-demo-card" size="small" title="数据填充测试：">
          <Space wrap>
            <Button
              onClick={() => {
                form.resetFields()
                form.setFieldsValue({ email: 'test@example.com', username: '测试用户' })
              }}
            >
              填充部分数据
            </Button>
            <Button onClick={() => form.resetFields()}>清空表单</Button>
          </Space>
          <p className="app-demo-result">• 填充部分数据后验证，会滚动到第一个错误字段</p>
        </Card>
        <Form
          form={form}
          labelCol={{ style: { width: 110 } }}
          onFinish={() => void message.success('表单提交成功')}
          scrollToFirstError={scrollEnabled}
        >
          {fields.map(([name, label]) => (
            <Form.Item
              key={name}
              label={label}
              name={name}
              rules={[{ required: true, message: `请输入${label}` }]}
            >
              <Input placeholder={`请输入${label}`} />
            </Form.Item>
          ))}
          <Form.Item label="性别" name="gender" rules={[{ message: '请选择性别', required: true }]}>
            <Select
              options={[
                { label: '男', value: 'male' },
                { label: '女', value: 'female' },
              ]}
              placeholder="请选择性别"
            />
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  )
}
