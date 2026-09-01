import {
  App,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Mentions,
  Radio,
  Select,
  Space,
  Switch,
  TreeSelect,
} from 'antd'
import { useState } from 'react'

import { PageContainer } from '~/components/page-container'

const { RangePicker } = DatePicker

const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
]

interface DynamicFormValues extends Record<string, unknown> {
  field1?: string
  field2?: string
}

type PhoneCompositeValue = [string | undefined, string | undefined]

interface CustomFormValues extends Record<string, unknown> {
  field4?: PhoneCompositeValue
}

const emptyPhoneComposite: PhoneCompositeValue = [undefined, undefined]

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

export function RulesFormExample() {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  return (
    <PageContainer description="表单校验示例" title="表单组件">
      <Card
        extra={
          <Space>
            <Button onClick={() => void form.validateFields().catch(() => undefined)}>
              校验表单
            </Button>
            <Button
              onClick={() =>
                form.setFields(
                  form.getFieldsError().map(({ name }) => ({ errors: [], name, warnings: [] })),
                )
              }
            >
              清空校验信息
            </Button>
          </Space>
        }
        title="基础组件校验示例"
      >
        <Form
          form={form}
          labelCol={{ style: { width: 150 } }}
          onFinish={(values) => void message.success(`form values: ${JSON.stringify(values)}`)}
        >
          <div className="app-form-grid">
            <Form.Item label="字段1" name="field1" rules={[{ message: '请输入', required: true }]}>
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              initialValue="默认值"
              label="默认值(必填)"
              name="field2"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item initialValue="默认值" label="默认值(非必填)" name="field3">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="自定义信息"
              name="field31"
              rules={[{ message: '最少输入1个字符', min: 1, required: true }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="邮箱"
              name="field4"
              rules={[{ message: '请输入正确的邮箱', type: 'email' }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="数字" name="number" rules={[{ message: '请输入', required: true }]}>
              <InputNumber placeholder="请输入" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="下拉选"
              name="options"
              rules={[{ message: '请选择', required: true }]}
            >
              <Select allowClear options={options} placeholder="请选择" showSearch />
            </Form.Item>
            <Form.Item
              label="单选组"
              name="radioGroup"
              rules={[{ message: '请选择', required: true }]}
            >
              <Radio.Group options={options} />
            </Form.Item>
            <Form.Item
              label="多选组"
              name="checkboxGroup"
              rules={[{ message: '请选择', required: true }]}
            >
              <Checkbox.Group options={options} />
            </Form.Item>
            <Form.Item
              label=""
              name="checkbox"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('请勾选')),
                },
              ]}
              valuePropName="checked"
            >
              <Checkbox>我已阅读并同意</Checkbox>
            </Form.Item>
            <Form.Item
              label="日期选择框"
              name="datePicker"
              rules={[{ message: '请选择', required: true }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="区间选择框"
              name="rangePicker"
              rules={[{ message: '请选择', required: true }]}
            >
              <RangePicker />
            </Form.Item>
            <Form.Item label="密码" name="password" rules={[{ message: '请输入', required: true }]}>
              <Input.Password placeholder="请输入" />
            </Form.Item>
            <Form.Item
              extra="blur时才会触发校验"
              label="blur触发"
              name="input-blur"
              rules={[{ message: '请输入', required: true }]}
              validateTrigger="onBlur"
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="异步校验"
              name="input-async"
              rules={[
                {
                  async validator(_, value) {
                    if (!value || String(value).length < 3) {
                      throw new Error('用户名至少需要3个字符')
                    }
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                    if (value === 'existingUser') throw new Error('用户名已存在')
                  },
                },
              ]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </div>
          <FormActions />
        </Form>
      </Card>
    </PageContainer>
  )
}

export function DynamicFormExample() {
  const { message } = App.useApp()
  const [form] = Form.useForm<DynamicFormValues>()
  const [show1, setShow1] = useState(true)
  const [show2, setShow2] = useState(true)
  const [disable3, setDisable3] = useState(false)
  const [required4, setRequired4] = useState(false)
  const [extraFields, setExtraFields] = useState<number[]>([])
  const [syncValue, setSyncValue] = useState('')
  const [showField7, setShowField7] = useState(true)
  const [field3Label, setField3Label] = useState('字段3')
  const field1 = Form.useWatch('field1', form)
  const field2 = Form.useWatch('field2', form)
  return (
    <PageContainer
      description="表单组件动态联动示例，包含了常用的场景。增删改，本质上是修改schema，你也可以通过 `setState` 动态修改schema。"
      title="表单组件"
    >
      <Card
        extra={
          <Space>
            <Button onClick={() => setField3Label('字段3-修改')}>修改字段3</Button>
            <Button onClick={() => setShowField7(false)}>删除字段7</Button>
            <Button onClick={() => setExtraFields((items) => [...items, Date.now()])}>
              添加字段
            </Button>
          </Space>
        }
        title="表单动态联动示例"
      >
        <Form
          form={form}
          labelCol={{ style: { width: 110 } }}
          onFinish={(values) => void message.success(`form values: ${JSON.stringify(values)}`)}
        >
          <div className="app-dynamic-form-grid">
            <Form.Item hidden initialValue="hidden value" label="隐藏字段" name="hiddenField">
              <Input />
            </Form.Item>
            <Form.Item extra="通过Dom控制销毁" label="显示字段1">
              <Switch checked={show1} onChange={setShow1} />
            </Form.Item>
            <Form.Item extra="通过css控制隐藏" label="显示字段2">
              <Switch checked={show2} onChange={setShow2} />
            </Form.Item>
            <Form.Item label="禁用字段3">
              <Switch checked={disable3} onChange={setDisable3} />
            </Form.Item>
            <Form.Item label="字段4必填">
              <Switch checked={required4} onChange={setRequired4} />
            </Form.Item>
            {show1 ? (
              <Form.Item label="字段1" name="field1">
                <Input />
              </Form.Item>
            ) : null}
            <Form.Item
              label="字段2"
              name="field2"
              {...(show2 ? {} : { style: { display: 'none' } })}
            >
              <Input />
            </Form.Item>
            <Form.Item label={field3Label} name="field3">
              <Input disabled={disable3} />
            </Form.Item>
            <Form.Item
              label="字段4"
              name="field4"
              rules={required4 ? [{ message: '请输入字段4', required: true }] : []}
            >
              <Input />
            </Form.Item>
            <Form.Item
              extra="当字段1的值为`123`时，必填"
              label="动态rules"
              name="field5"
              rules={field1 === '123' ? [{ message: '请输入字段5', required: true }] : []}
            >
              <Input />
            </Form.Item>
            <Form.Item extra="当字段2的值为`123`时，更改下拉选项" label="动态配置" name="field6">
              <Select
                allowClear
                options={field2 === '123' ? [...options, { label: '选项3', value: '3' }] : options}
                placeholder="请选择"
                showSearch
              />
            </Form.Item>
            {showField7 ? (
              <Form.Item label="字段7" name="field7">
                <Input />
              </Form.Item>
            ) : null}
            {extraFields.map((field) => (
              <Form.Item key={field} label="字段+" name={`field${field}`}>
                <Input />
              </Form.Item>
            ))}
          </div>
          <FormActions />
        </Form>
      </Card>
      <Card className="app-demo-card" title="字段同步，字段1数据与字段2数据同步">
        <Form labelCol={{ style: { width: 100 } }}>
          <Form.Item label="字段1">
            <Input onChange={(event) => setSyncValue(event.target.value)} value={syncValue} />
          </Form.Item>
          <Form.Item label="字段2">
            <Input disabled value={syncValue} />
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  )
}

export function CustomLayoutFormExample() {
  return (
    <PageContainer
      description="使用tailwind自定义表单项的布局，使用Divider分割表单。"
      extra={<DocButton />}
      title="表单自定义布局"
    >
      <Card title="使用tailwind自定义布局">
        <Form layout="vertical">
          <div className="app-custom-form-grid">
            <Form.Item label="字符串" name="field1">
              <Select options={options} />
            </Form.Item>
            <Form.Item label="字符串" name="field2">
              <TreeSelect treeData={[]} />
            </Form.Item>
            <Form.Item label="字符串" name="field3">
              <Mentions />
            </Form.Item>
            <Form.Item label="字符串" name="field4">
              <Input />
            </Form.Item>
            <Form.Item className="starts-second" label="前面空了一列" name="field5">
              <InputNumber />
            </Form.Item>
            <Divider className="spans-all">分割线</Divider>
            <Form.Item className="spans-all" label="占满三列" name="field6">
              <Input.TextArea />
            </Form.Item>
            <Form.Item className="spans-two" label="占满2列" name="field7">
              <Input />
            </Form.Item>
            <Form.Item className="starts-second" label="左右留空" name="field8">
              <Input />
            </Form.Item>
            <Form.Item label="字符串" name="field9">
              <Input.Password />
            </Form.Item>
          </div>
        </Form>
      </Card>
    </PageContainer>
  )
}

function PhoneCompositeField({
  onChange,
  value = emptyPhoneComposite,
}: {
  onChange?: (value: PhoneCompositeValue) => void
  value?: PhoneCompositeValue
}) {
  return (
    <Space.Compact block>
      <Select
        allowClear
        onChange={(type) => onChange?.([type, value[1]])}
        options={[
          { label: '个人', value: 'personal' },
          { label: '工作', value: 'work' },
          { label: '私密', value: 'private' },
        ]}
        placeholder="类型"
        style={{ width: 90 }}
        value={value[0]}
      />
      <Input
        allowClear
        maxLength={11}
        onChange={(event) => onChange?.([value[0], event.target.value])}
        placeholder="请输入11位手机号码"
        type="tel"
        value={value[1]}
      />
    </Space.Compact>
  )
}

export function CustomComponentFormExample() {
  const { message } = App.useApp()
  const [dynamicSelect, setDynamicSelect] = useState(false)
  return (
    <PageContainer description="表单组件自定义示例" title="表单组件">
      <Card
        extra={
          <Button onClick={() => setDynamicSelect((value) => !value)}>
            {dynamicSelect ? '切换为输入框' : '切换为下拉框'}
          </Button>
        }
        title="基础示例"
      >
        <Form<CustomFormValues>
          initialValues={{ field4: [undefined, ''] }}
          labelCol={{ style: { width: '33.333%' } }}
          onFinish={(values) => {
            const [phoneType, phoneNumber] = values.field4 ?? emptyPhoneComposite
            const { field4: _field4, ...otherValues } = values
            void message.success(
              `form values: ${JSON.stringify({ ...otherValues, phoneNumber, phoneType })}`,
            )
          }}
        >
          <div className="app-form-grid-two">
            <Form.Item label="自定义后缀" name="field">
              <Input suffix={<span className="app-danger-text">元</span>} />
            </Form.Item>
            <Form.Item label="自定义组件slot" name="field1">
              <Input prefix="prefix" suffix="suffix" />
            </Form.Item>
            <Form.Item
              label="自定义组件"
              name="field2"
              rules={[{ message: '请输入Field2', required: true }]}
            >
              <Input placeholder="请输入Field2" />
            </Form.Item>
            <Form.Item
              label="自定义组件(slot)"
              name="field3"
              rules={[{ message: '请输入', required: true }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="组合字段"
              name="field4"
              rules={[
                {
                  validator: (_, compositeValue: [string?, string?] | undefined) => {
                    if (!compositeValue || compositeValue.length !== 2) {
                      return Promise.reject(new Error('请选择类型并输入手机号码'))
                    }
                    if (!compositeValue[0]) return Promise.reject(new Error('请选择类型'))
                    if (!compositeValue[1]) {
                      return Promise.reject(new Error('　　　　　　　输入手机号码'))
                    }
                    if (!/^1[3-9]\d{9}$/.test(compositeValue[1])) {
                      return Promise.reject(new Error('　　　　　　　号码格式不正确'))
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <PhoneCompositeField />
            </Form.Item>
            <Form.Item label="动态组件" name="field5">
              {dynamicSelect ? (
                <Select
                  allowClear
                  options={[
                    { label: '选项一', value: 'option-1' },
                    { label: '选项二', value: 'option-2' },
                  ]}
                  placeholder="请选择动态组件值"
                />
              ) : (
                <Input placeholder="请输入动态组件值" />
              )}
            </Form.Item>
          </div>
          <FormActions />
        </Form>
      </Card>
    </PageContainer>
  )
}
