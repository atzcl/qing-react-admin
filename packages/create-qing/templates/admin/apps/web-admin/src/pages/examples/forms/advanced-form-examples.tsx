import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import {
  App,
  Button,
  Card,
  Collapse,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Switch,
} from 'antd'
import { useState } from 'react'

import { PageContainer } from '~/components/page-container'
import { RichEditor } from '~/components/rich-editor'

interface CollapsibleFormValues {
  params?: Record<string, number | null>
  qat?: boolean
  richEditor?: string
}

type ContactRole = 'member' | 'owner' | 'viewer'

interface FormArrayContact {
  enabled?: boolean
  name?: string
  phone?: string
  role?: ContactRole
}

interface FormArrayValues {
  contacts?: FormArrayContact[]
  description?: string
  planName?: string
}

function DocButton() {
  return (
    <Button
      onClick={() =>
        window.open('https://ant.design/components/form', '_blank', 'noopener,noreferrer')
      }
      type="primary"
    >
      查看文档
    </Button>
  )
}

function FormActions() {
  return (
    <Form.Item label={null}>
      <Space>
        <Button htmlType="submit" type="primary">
          提交
        </Button>
        <Button htmlType="reset">重置</Button>
      </Space>
    </Form.Item>
  )
}

export function CollapsibleFormExample() {
  const { message } = App.useApp()
  const [form] = Form.useForm<CollapsibleFormValues>()
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('vertical')
  const [paramsOpen, setParamsOpen] = useState(false)
  const qat = Form.useWatch('qat', form) ?? false
  const parameterFields = [
    ...(qat
      ? [
          {
            description: '校准步数；校准的数据集大小 = 校准步数 * 训练的batch_size',
            key: 'calib_steps',
            max: undefined,
            min: 1,
            step: 1,
          },
        ]
      : []),
    {
      description:
        '批次大小，代表模型训练过程中，模型更新模型参数的数据步长，可理解为模型每看多少数据即更新一次模型参数，一般建议的批次大小为16/32，表示模型每看16或32条数据即更新一次参数',
      key: 'micro_batch_size',
      max: 1024,
      min: 8,
      step: 8,
    },
    {
      description:
        '学习率，代表每次更新数据的增量参数权重，学习率数值越大参数变化越大，对模型影响越大',
      key: 'learning_rate',
      max: 1,
      min: 0,
      step: 0.0001,
    },
    {
      description: '验证步数，训练阶段针模型的验证间隔步长，用于阶段性评估模型训练准确率、训练损失',
      key: 'eval_steps',
      max: 2_147_483_647,
      min: 1,
      step: 1,
    },
    {
      description:
        '循环次数，代表模型训练过程中模型学习数据集的次数，可理解为看几遍数据，一般建议的范围是1-3遍即可，可依据需求进行调整',
      key: 'num_train_epochs',
      max: 200,
      min: 1,
      step: 1,
    },
    {
      description: '序列长度，单个训练数据样本的最大长度，超出配置长度将丢弃',
      key: 'max_length',
      max: 131_072,
      min: 500,
      step: 1,
    },
    {
      description: '学习率预热比例，学习率预热阶段占总训练步数的比例',
      key: 'warmup_ratio',
      max: 1,
      min: 0,
      step: 0.01,
    },
    {
      description: 'Checkpoint保存间隔',
      key: 'save_steps',
      max: 2_147_483_647,
      min: 1,
      step: 1,
    },
  ]

  function setExampleValues() {
    form.setFieldValue('params', {
      eval_steps: 150,
      learning_rate: 0.00001,
      max_length: 131_072,
      micro_batch_size: 1024,
      num_train_epochs: 13,
      save_steps: 150,
      warmup_ratio: 0.05,
    })
  }

  function submit() {
    void form
      .validateFields()
      .then((values) => message.info(`form values: ${JSON.stringify(values)}`))
      .catch(() => undefined)
  }

  return (
    <PageContainer
      description="可折叠表单项、以及可折叠参数配置组件示例"
      extra={<DocButton />}
      title="可折叠表单项"
    >
      <Card
        extra={
          <Space wrap>
            <Radio.Group
              onChange={(event) => setLayout(event.target.value)}
              optionType="button"
              options={[
                { label: 'Vertical', value: 'vertical' },
                { label: 'Horizontal', value: 'horizontal' },
              ]}
              value={layout}
            />
            <Button onClick={setExampleValues} type="primary">
              设置表单值
            </Button>
            <Button onClick={submit} type="primary">
              提交表单
            </Button>
            <Button onClick={() => form.resetFields()} type="primary">
              重置表单
            </Button>
          </Space>
        }
        title="基础示例"
      >
        <Form
          form={form}
          initialValues={{
            params: {
              eval_steps: 50,
              learning_rate: 0.00001,
              max_length: 32_768,
              micro_batch_size: 8,
              num_train_epochs: 3,
              save_steps: 50,
              warmup_ratio: 0.05,
            },
            qat: false,
          }}
          layout={layout}
        >
          <Form.Item label="QAT" name="qat" valuePropName="checked">
            <Switch
              checkedChildren="开"
              onChange={(checked) => {
                const params = form.getFieldValue('params') ?? {}
                form.setFieldValue(
                  'params',
                  checked
                    ? {
                        ...params,
                        calib_steps: 10,
                        eval_steps: 80,
                        learning_rate: 0.00004,
                        max_length: 32_768,
                        micro_batch_size: 32,
                        num_train_epochs: 3,
                        save_steps: 80,
                        warmup_ratio: 0.1,
                      }
                    : { ...params, calib_steps: null },
                )
              }}
              unCheckedChildren="关"
            />
          </Form.Item>
          <Form.Item label="参数配置">
            <Card size="small">
              {(paramsOpen ? parameterFields : parameterFields.slice(0, 3)).map((parameter) => (
                <Form.Item
                  extra={parameter.description}
                  key={parameter.key}
                  label={parameter.key}
                  name={['params', parameter.key]}
                  rules={[
                    {
                      message: `${parameter.key} 值不能为空`,
                      required: true,
                    },
                    {
                      message: `${parameter.key} 值只能为数字`,
                      type: 'number',
                    },
                    {
                      min: parameter.min,
                      message: `${parameter.key} 值不能小于${parameter.min}`,
                      type: 'number',
                    },
                    ...(parameter.max === undefined
                      ? []
                      : [
                          {
                            max: parameter.max,
                            message: `${parameter.key} 值不能大于${parameter.max}`,
                            type: 'number' as const,
                          },
                        ]),
                  ]}
                >
                  <InputNumber
                    min={parameter.min}
                    step={parameter.step}
                    style={{ width: '100%' }}
                    {...(parameter.max === undefined ? {} : { max: parameter.max })}
                  />
                </Form.Item>
              ))}
              <Button block onClick={() => setParamsOpen((value) => !value)} type="link">
                {paramsOpen ? '收起参数配置' : '展开全部参数'}
              </Button>
            </Card>
          </Form.Item>
          <Form.Item label="富文本">
            <Collapse
              defaultActiveKey={['richEditor']}
              items={[
                {
                  children: (
                    <Form.Item name="richEditor" noStyle>
                      <RichEditor />
                    </Form.Item>
                  ),
                  key: 'richEditor',
                  label: '富文本',
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  )
}

export function LabelWidthFormExample() {
  const { message } = App.useApp()
  const [showExtra, setShowExtra] = useState(true)
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal')
  const [labelWidthMode, setLabelWidthMode] = useState<'100' | '150' | '8rem' | 'auto'>('auto')
  const resolvedLabelWidth =
    labelWidthMode === 'auto'
      ? showExtra
        ? 310
        : 190
      : labelWidthMode === '8rem'
        ? '8rem'
        : Number(labelWidthMode)
  return (
    <PageContainer
      description={
        <p>
          设置 <code>labelWidth: 'auto'</code> 后，水平布局会按当前可见 label
          的最大宽度自动对齐；垂直布局或 <code>labelClass</code> 含 <code>w-*</code> 时不生效。
        </p>
      }
      extra={<DocButton />}
      title="Label 自动宽度"
    >
      <Card
        extra={
          <Space wrap>
            <Radio.Group
              onChange={(event) => setLayout(event.target.value)}
              optionType="button"
              options={[
                { label: 'Horizontal', value: 'horizontal' },
                { label: 'Vertical', value: 'vertical' },
              ]}
              value={layout}
            />
            <Radio.Group
              onChange={(event) => setLabelWidthMode(event.target.value)}
              optionType="button"
              options={[
                { label: 'auto', value: 'auto' },
                { label: '100px', value: '100' },
                { label: '150px', value: '150' },
                { label: '8rem', value: '8rem' },
              ]}
              value={labelWidthMode}
            />
          </Space>
        }
        title="labelWidth: auto"
      >
        <div className="app-label-width-form">
          <Form
            layout={layout}
            onFinish={(values) => void message.success(`form values: ${JSON.stringify(values)}`)}
            {...(layout === 'horizontal'
              ? { labelCol: { style: { width: resolvedLabelWidth } } }
              : {})}
          >
            <Form.Item
              extra="关闭后超长标签会卸载，auto 宽度会按剩余 label 重算"
              label="显示超长字段"
            >
              <Switch checked={showExtra} onChange={setShowExtra} />
            </Form.Item>
            <Form.Item label="姓名" name="name">
              <Input placeholder="短标签" />
            </Form.Item>
            <Form.Item label="电子邮箱" name="email">
              <Input placeholder="中等长度标签" />
            </Form.Item>
            <Form.Item label="所属组织 / 部门名称" name="organization">
              <Input placeholder="较长标签，用于撑开 auto 宽度" />
            </Form.Item>
            <Form.Item label="状态" name="status">
              <Select
                allowClear
                options={[
                  { label: '启用', value: 'enabled' },
                  { label: '禁用', value: 'disabled' },
                ]}
                placeholder="请选择"
              />
            </Form.Item>
            <Form.Item
              label="固定 class"
              name="fixedClass"
              {...(layout === 'horizontal' ? { labelCol: { style: { width: 128 } } } : {})}
            >
              <Input placeholder="使用 labelClass: w-32，不受 labelWidth 控制" />
            </Form.Item>
            {showExtra ? (
              <Form.Item label="这是一个会动态显示的超长标签字段" name="extraLongLabel">
                <Input placeholder="切换上方开关后，auto 宽度会重新计算" />
              </Form.Item>
            ) : null}
            <Form.Item label="备注" name="remark">
              <Input.TextArea placeholder="备注" rows={3} />
            </Form.Item>
            <FormActions />
          </Form>
        </div>
      </Card>
    </PageContainer>
  )
}

export function FormArrayDemo() {
  const { message } = App.useApp()
  const [form] = Form.useForm<FormArrayValues>()
  const [output, setOutput] = useState<Record<string, unknown>>({})
  const [strictPhoneRule, setStrictPhoneRule] = useState(false)
  const contacts = Form.useWatch('contacts', form)
  const planName = Form.useWatch('planName', form)

  function encodeValues(values: FormArrayValues) {
    return {
      ...values,
      contacts: (values.contacts ?? []).map((contact) => {
        const encoded: FormArrayContact = {}
        const trimmedName = contact.name?.trim()
        const trimmedPhone = contact.phone?.trim()
        if (contact.enabled !== undefined) encoded.enabled = contact.enabled
        if (trimmedName !== undefined) encoded.name = trimmedName
        if (trimmedPhone) encoded.phone = trimmedPhone
        if (contact.role !== undefined) encoded.role = contact.role
        return encoded
      }),
    }
  }

  async function submit() {
    try {
      const values = await form.validateFields()
      setOutput(encodeValues(values))
      void message.success('已通过校验')
    } catch {
      // Ant Design has already rendered the field-level validation messages.
    }
  }

  return (
    <PageContainer title="Form Array Demo">
      <div className="app-form-array-layout">
        <Card title="数组字段">
          <Form<FormArrayValues>
            form={form}
            initialValues={{
              contacts: [{ enabled: true, name: '张三', phone: ' 10086 ', role: 'owner' }],
              planName: '值班联络人配置',
            }}
            labelCol={{ style: { width: 90 } }}
          >
            <Form.Item
              label="方案名称"
              name="planName"
              rules={[{ message: '请输入方案名称', required: true }]}
            >
              <Input placeholder="请输入方案名称" />
            </Form.Item>
            <Form.Item
              label="方案说明"
              name="description"
              rules={
                planName?.includes('值班')
                  ? [{ message: '请输入至少 2 个字', min: 2, required: true }]
                  : []
              }
            >
              <Input.TextArea
                disabled={!planName}
                placeholder={planName ? `${planName} 的补充说明` : '请先填写方案名称'}
                rows={2}
              />
            </Form.Item>
            <Form.Item
              label="联系人"
              required
              {...(contacts?.length === 0
                ? { help: '请至少添加一个联系人', validateStatus: 'error' as const }
                : {})}
            >
              <Form.List name="contacts">
                {(fields, { add, remove }) => (
                  <div className="app-form-array">
                    {fields.map((field, index) => (
                      <Card
                        extra={
                          <Button
                            aria-label={`删除联系人 ${index + 1}`}
                            danger
                            disabled={fields.length <= 1}
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                            type="text"
                          />
                        }
                        key={field.key}
                        size="small"
                        title={`联系人 ${index + 1}`}
                      >
                        <div className="app-form-grid">
                          <Form.Item
                            label="姓名"
                            name={[field.name, 'name']}
                            rules={[
                              {
                                message: '请输入姓名',
                                required: true,
                                transform: (value) => String(value ?? '').trim(),
                              },
                            ]}
                          >
                            <Input placeholder={`第 ${index + 1} 行姓名`} />
                          </Form.Item>
                          <Form.Item
                            label="角色"
                            name={[field.name, 'role']}
                            rules={[{ message: '请选择角色', required: true }]}
                          >
                            <Select
                              options={[
                                { label: '负责人', value: 'owner' },
                                { label: '成员', value: 'member' },
                                { label: '观察员', value: 'viewer' },
                              ]}
                            />
                          </Form.Item>
                          <Form.Item noStyle shouldUpdate>
                            {() => {
                              const role = form.getFieldsValue().contacts?.[field.name]?.role
                              return (
                                <Form.Item
                                  label="电话"
                                  name={[field.name, 'phone']}
                                  rules={
                                    strictPhoneRule
                                      ? [{ message: '电话至少 5 位', min: 5, required: true }]
                                      : []
                                  }
                                >
                                  <Input
                                    disabled={role === 'viewer'}
                                    placeholder={
                                      role === 'viewer' ? '观察员无需电话' : '请输入电话'
                                    }
                                  />
                                </Form.Item>
                              )
                            }}
                          </Form.Item>
                          <Form.Item
                            label="状态"
                            name={[field.name, 'enabled']}
                            valuePropName="checked"
                          >
                            <Switch checkedChildren="启用" unCheckedChildren="停用" />
                          </Form.Item>
                        </div>
                      </Card>
                    ))}
                    <Button
                      block
                      disabled={fields.length >= 5}
                      icon={<PlusOutlined />}
                      onClick={() => add({ enabled: true, name: '', phone: '', role: 'member' })}
                      type="dashed"
                    >
                      添加联系人
                    </Button>
                  </div>
                )}
              </Form.List>
            </Form.Item>
          </Form>
          <Space className="app-form-array-actions" wrap>
            <Button onClick={() => void submit()} type="primary">
              提交
            </Button>
            <Button onClick={() => setOutput(encodeValues(form.getFieldsValue()))}>获取值</Button>
            <Button
              onClick={() => {
                setStrictPhoneRule(true)
                void message.success('已动态更新子字段规则')
              }}
            >
              更新电话规则
            </Button>
          </Space>
        </Card>
        <Card title="输出">
          <pre>{JSON.stringify(output, null, 2)}</pre>
        </Card>
      </div>
    </PageContainer>
  )
}
