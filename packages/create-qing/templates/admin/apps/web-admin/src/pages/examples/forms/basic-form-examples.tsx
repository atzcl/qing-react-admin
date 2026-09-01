/* oxlint-disable react/no-unstable-nested-components -- QueryForm render entries are schema field callbacks, not mounted component definitions. */
import {
  App,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Mentions,
  Modal,
  Radio,
  Rate,
  Select,
  Space,
  Spin,
  Switch,
  Tag,
  TimePicker,
  TreeSelect,
  Upload,
} from 'antd'
import type { FormInstance, UploadFile, UploadProps } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useEffect, useMemo, useRef, useState } from 'react'
import { z } from 'zod'

import { PageContainer } from '~/components/page-container'
import { QueryForm } from '~/components/query-form'
import { initialEditorContent, RichEditor } from '~/components/rich-editor'
import { VCropper } from '~/components/v-cropper'
import type { VCropperRef } from '~/components/v-cropper'
import { queryFormDayjsSchema } from '~/core/query-form-search'

const { RangePicker } = DatePicker

const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
]

interface BasicFormValues extends Record<string, unknown> {
  cropImage?: UploadFile[]
  files?: UploadFile[]
  rangePicker?: [Dayjs, Dayjs]
  rate?: number
}

const emptyUploadFiles: UploadFile[] = []

function uploadedFileUrl(file: UploadFile) {
  if (file.url) return file.url
  if (
    typeof file.response === 'object' &&
    file.response !== null &&
    'url' in file.response &&
    typeof file.response.url === 'string'
  ) {
    return file.response.url
  }
  return undefined
}

function CropImageUpload({
  onChange,
  value = emptyUploadFiles,
}: {
  onChange?: (files: UploadFile[]) => void
  value?: UploadFile[]
}) {
  const { message } = App.useApp()
  const cropperRef = useRef<VCropperRef>(null)
  const [fileName, setFileName] = useState('cropped-image.jpg')
  const [loading, setLoading] = useState(false)
  const [source, setSource] = useState('')

  function selectImage(file: File) {
    if (!file.type.startsWith('image/')) {
      void message.error('请上传图片文件')
      return Upload.LIST_IGNORE
    }
    if (file.size > 2 * 1024 * 1024) {
      void message.error(`${file.name} 上传失败：图片不能超过 2MB`)
      return Upload.LIST_IGNORE
    }
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result !== 'string') return
      setFileName(file.name)
      setSource(reader.result)
    })
    reader.addEventListener('error', () => void message.error('图片读取失败'))
    reader.readAsDataURL(file)
    return Upload.LIST_IGNORE
  }

  async function confirmCrop() {
    if (!source || !cropperRef.current) return
    setLoading(true)
    try {
      const result = await cropperRef.current.getCropImage('image/jpeg', 0.92, 'base64')
      if (typeof result !== 'string') throw new Error('Expected a base64 crop result')
      const url = result
      onChange?.([
        {
          name: fileName,
          response: { url },
          status: 'done',
          uid: `crop-${Date.now()}`,
          url,
        },
      ])
      setSource('')
      void message.success(`${fileName} 上传成功`)
    } catch {
      void message.error('图片裁剪失败')
      setLoading(false)
      return
    }
    setLoading(false)
  }

  return (
    <>
      <Upload
        accept=".png,.jpg,.jpeg"
        beforeUpload={selectImage}
        fileList={value}
        listType="picture-card"
        maxCount={1}
        onChange={({ fileList }) => onChange?.(fileList)}
        onRemove={() => {
          onChange?.([])
          return true
        }}
      >
        {value.length === 0 ? <span>点击上传图片</span> : null}
      </Upload>
      <Modal
        cancelText="取消"
        confirmLoading={loading}
        destroyOnHidden
        okText="裁剪并上传"
        onCancel={() => setSource('')}
        onOk={() => void confirmCrop()}
        open={Boolean(source)}
        title="裁剪图片"
      >
        <div className="app-form-cropper">
          {source ? (
            <VCropper aspectRatio="1:1" height={420} img={source} ref={cropperRef} />
          ) : null}
        </div>
      </Modal>
    </>
  )
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

function FullBasicForm({ form }: { form: FormInstance<BasicFormValues> }) {
  const { message } = App.useApp()
  const [remoteKeyword, setRemoteKeyword] = useState('')
  const [remoteLoading, setRemoteLoading] = useState(false)
  const [remoteOptions, setRemoteOptions] = useState<Array<{ label: string; value: string }>>([])
  const rate = Form.useWatch('rate', form)

  useEffect(() => {
    if (!remoteKeyword) return undefined
    const timer = window.setTimeout(() => {
      setRemoteOptions(
        Array.from({ length: 10 }, (_, index) => ({
          label: `${remoteKeyword}-${index}`,
          value: `${remoteKeyword}-${index}`,
        })),
      )
      setRemoteLoading(false)
    }, 1300)
    return () => window.clearTimeout(timer)
  }, [remoteKeyword])

  function searchRemoteOptions(keyword: string) {
    setRemoteKeyword(keyword)
    setRemoteOptions([])
    setRemoteLoading(Boolean(keyword))
  }

  function uploadRequest({
    file,
    onSuccess,
  }: Parameters<NonNullable<UploadProps['customRequest']>>[0]) {
    window.setTimeout(() => {
      const url = file instanceof Blob ? URL.createObjectURL(file) : file
      onSuccess?.({ url })
    }, 450)
  }

  return (
    <Form<BasicFormValues>
      form={form}
      labelCol={{ style: { width: 130 } }}
      onFinish={(values) => {
        const range = values.rangePicker
        const files = values.files ?? []
        const cropImages = values.cropImage ?? []
        const failedFiles = files.filter((file) => file.status !== 'done')
        const failedCropImages = cropImages.filter((file) => file.status !== 'done')
        if (failedFiles.length > 0 || failedCropImages.length > 0) {
          const failedNames = [...failedFiles, ...failedCropImages]
            .map((file) => file.name)
            .join(', ')
          void message.error(`上传失败: ${failedNames}`)
          return
        }
        const fileUrls = files.map(uploadedFileUrl).filter((url) => url !== undefined)
        const cropImageUrls = cropImages.map(uploadedFileUrl).filter((url) => url !== undefined)
        const payload = {
          ...values,
          cropImage: cropImageUrls,
          endTime: range?.[1]?.format('YYYY-MM-DD'),
          files: fileUrls,
          rangePicker: undefined,
          startTime: range?.[0]?.format('YYYY-MM-DD'),
        }
        if (fileUrls.length > 0) void message.success(`上传地址: ${fileUrls.join(', ')}`)
        if (cropImageUrls.length > 0) {
          void message.success(`上传地址: ${cropImageUrls.join(', ')}`)
        }
        void message.success(`form values: ${JSON.stringify(payload)}`)
      }}
      onValuesChange={(changed) =>
        void message.info(`表单以下字段发生变化：${Object.keys(changed).join('，')}`)
      }
    >
      <div className="app-form-grid">
        <Form.Item
          label="字符串"
          name="username"
          rules={[{ message: '请输入用户名', required: true }]}
        >
          <Input allowClear placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item extra="这是表单描述" label="字符串(带描述)" name="desc">
          <Input />
        </Form.Item>
        <Form.Item initialValue="/dashboard/analytics" label="ApiSelect" name="api">
          <Select
            options={[
              { label: '分析页', value: '/dashboard/analytics' },
              { label: '工作台', value: '/dashboard/workspace' },
              { label: '系统管理', value: '/system' },
            ]}
          />
        </Form.Item>
        <Form.Item
          extra="远程查询，仅有输入时方进行查询"
          label="远程搜索"
          name="remoteSearch"
          rules={[{ message: '请选择', required: true }]}
        >
          <Select
            notFoundContent={remoteLoading ? <Spin size="small" /> : null}
            options={remoteOptions}
            placeholder="请输入关键字搜索"
            showSearch={{ filterOption: false, onSearch: searchRemoteOptions }}
          />
        </Form.Item>
        <Form.Item label="ApiTreeSelect" name="apiTree">
          <TreeSelect
            treeData={[
              {
                children: [
                  { title: '分析页', value: '/dashboard/analytics' },
                  { title: '工作台', value: '/dashboard/workspace' },
                ],
                title: '概览',
                value: '/dashboard',
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="密码" name="password">
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        <Form.Item label="数字(带后缀)" name="number">
          <InputNumber placeholder="请输入" style={{ width: '100%' }} suffix="¥" />
        </Form.Item>
        <Form.Item label="图标" name="icon">
          <Select options={[{ label: 'lucide:search', value: 'lucide:search' }]} />
        </Form.Item>
        <Form.Item label={<Tag color="warning">😎自定义：</Tag>} name="options">
          <Select allowClear options={options} placeholder="请选择" showSearch />
        </Form.Item>
        <Form.Item label="单选组" name="radioGroup">
          <Radio.Group options={options} />
        </Form.Item>
        <Form.Item label="" name="radio" valuePropName="checked">
          <Radio>Radio</Radio>
        </Form.Item>
        <Form.Item label="多选组" name="checkboxGroup">
          <Checkbox.Group options={options} />
        </Form.Item>
        <Form.Item
          label=""
          name="checkbox"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('为什么不同意？勾上它！')),
            },
          ]}
          valuePropName="checked"
        >
          <Checkbox>我已阅读并同意</Checkbox>
        </Form.Item>
        <Form.Item label="提及" name="mentions">
          <Mentions
            options={[
              { label: 'afc163', value: 'afc163' },
              { label: 'zombieJ', value: 'zombieJ' },
            ]}
            placeholder="请输入"
          />
        </Form.Item>
        <Form.Item label="评分" name="rate">
          <Rate />
        </Form.Item>
        <Form.Item
          extra={
            <>
              <p>这是一个多行帮助信息</p>
              <p>第二行</p>
              <p>第三行</p>
            </>
          }
          label="开关"
          name="switch"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          extra={`这是一个可输出其他字段值的帮助信息${rate ?? ''}`}
          label="日期选择框"
          name="datePicker"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="范围选择器" name="rangePicker">
          <RangePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="时间选择框" name="timePicker">
          <TimePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="树选择" name="treeSelect">
          <TreeSelect
            allowClear
            placeholder="请选择"
            treeData={[
              {
                children: [
                  {
                    children: [
                      {
                        children: [
                          { title: 'my leaf', value: 'leaf1' },
                          { title: 'your leaf', value: 'leaf2' },
                        ],
                        title: 'parent 1-0',
                        value: 'parent 1-0',
                      },
                      { title: 'parent 1-1', value: 'parent 1-1' },
                    ],
                    title: 'parent 1',
                    value: 'parent 1',
                  },
                  { title: 'parent 2', value: 'parent 2' },
                ],
                title: 'root 1',
                value: 'root 1',
              },
            ]}
            showSearch={{ treeNodeFilterProp: 'title' }}
          />
        </Form.Item>
        <Form.Item
          getValueFromEvent={(event) => event?.fileList}
          label="文件"
          name="files"
          rules={[{ message: '请上传图片', required: true }]}
          valuePropName="fileList"
        >
          <Upload
            accept=".png,.jpg,.jpeg"
            beforeUpload={(file) => {
              if (file.size <= 2 * 1024 * 1024) return true
              void message.error(`${file.name} 上传失败：图片不能超过 2MB`)
              return Upload.LIST_IGNORE
            }}
            customRequest={uploadRequest}
            listType="picture-card"
            maxCount={3}
            onChange={({ file }) => {
              if (file.status === 'done') void message.success(`${file.name} 上传成功`)
              if (file.status === 'error') void message.error(`${file.name} 上传失败`)
            }}
          >
            <span>点击上传图片</span>
          </Upload>
        </Form.Item>
        <Form.Item
          label="裁剪图片"
          name="cropImage"
          rules={[{ message: '请上传图片', required: true }]}
        >
          <CropImageUpload />
        </Form.Item>
        <Form.Item className="is-full" label="富文本" name="richEditor">
          <RichEditor />
        </Form.Item>
      </div>
      <FormActions />
    </Form>
  )
}

export function BasicFormExample() {
  const [form] = Form.useForm<BasicFormValues>()
  return (
    <PageContainer
      description="表单组件基础示例，请注意，该页面用到的参数代码会添加一些简单注释，方便理解，请仔细查看。"
      extra={<DocButton />}
      title="表单组件"
    >
      <Card
        extra={
          <Button
            onClick={() =>
              form.setFieldsValue({
                checkbox: true,
                checkboxGroup: ['1'],
                datePicker: dayjs('2022-01-01'),
                files: [
                  {
                    name: 'example.png',
                    status: 'done',
                    uid: '-1',
                    url: '/admin-illustration.svg',
                  },
                ],
                mentions: '@afc163',
                number: 3,
                options: '1',
                password: '2',
                radioGroup: '1',
                rangePicker: [dayjs('2022-01-01'), dayjs('2022-01-02')],
                rate: 3,
                richEditor: initialEditorContent,
                switch: true,
                timePicker: dayjs('2022-01-01 12:00:00'),
                treeSelect: 'leaf1',
                username: '1',
              })
            }
            type="primary"
          >
            设置表单值
          </Button>
        }
        title="基础示例"
      >
        <FullBasicForm form={form} />
      </Card>
    </PageContainer>
  )
}

function CompactQueryForm({
  fieldCount = 5,
  namespace,
}: {
  fieldCount?: number
  namespace: string
}) {
  const { message } = App.useApp()
  const querySchema = z
    .object({
      datePicker: queryFormDayjsSchema.optional(),
      number: z.number().optional(),
      options: z.string().optional(),
      password: z.string().optional(),
      username: z.string().optional(),
    })
    .catchall(z.string())
  return (
    <QueryForm<Record<string, unknown>>
      items={Array.from({ length: fieldCount }, (_, index) => {
        if (fieldCount > 5) {
          return {
            field: `field${index}`,
            label: `字段${index + 1}`,
            render: () => <Input allowClear placeholder={`请输入字段${index + 1}`} />,
          }
        }
        if (index === 0)
          return {
            field: 'username',
            label: '字符串',
            render: () => <Input allowClear placeholder="请输入用户名" />,
          }
        if (index === 1)
          return {
            field: 'password',
            label: '密码',
            render: () => <Input.Password placeholder="请输入密码" />,
          }
        if (index === 2)
          return {
            field: 'number',
            label: '数字',
            render: () => <InputNumber placeholder="请输入" suffix="¥" />,
          }
        if (index === 3)
          return {
            field: 'options',
            label: '下拉选',
            render: () => <Select allowClear options={options} placeholder="请选择" />,
          }
        return {
          field: 'datePicker',
          label: '日期',
          render: () => <DatePicker />,
        }
      })}
      onQuery={(values) => void message.info(`form values: ${JSON.stringify(values)}`)}
      urlSync={{ namespace, schema: querySchema }}
    />
  )
}

export function QueryFormExample() {
  return (
    <PageContainer description="查询表单，常用语和表格组合使用，可进行收缩展开。" title="表单组件">
      <Card className="app-demo-card" title="标准查询表单">
        <CompactQueryForm namespace="query-standard" />
      </Card>
      <Card className="app-demo-card" title="查询表单，三个字段时保持单行">
        <CompactQueryForm fieldCount={3} namespace="query-compact" />
      </Card>
      <Card className="app-demo-card" title="查询表单，超过三个字段自动折叠">
        <CompactQueryForm fieldCount={4} namespace="query-collapsible" />
      </Card>
      <Card title="查询表单，大字段集按需展开">
        <CompactQueryForm fieldCount={14} namespace="query-large" />
      </Card>
    </PageContainer>
  )
}

export function ValueFormatFormExample() {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [rawValues, setRawValues] = useState<Record<string, unknown>>({})
  const encoded = useMemo(
    () => ({
      deadline: dayjs.isDayjs(rawValues.deadline) ? rawValues.deadline.valueOf() : undefined,
      endTime:
        Array.isArray(rawValues.reportRange) && dayjs.isDayjs(rawValues.reportRange[1])
          ? rawValues.reportRange[1].valueOf()
          : undefined,
      keyword: rawValues.keyword,
      startTime:
        Array.isArray(rawValues.reportRange) && dayjs.isDayjs(rawValues.reportRange[0])
          ? rawValues.reportRange[0].valueOf()
          : undefined,
    }),
    [rawValues],
  )

  function fillExample() {
    const values = {
      deadline: dayjs('2026-04-12 18:30:00'),
      keyword: 'invoice',
      reportRange: [dayjs('2026-04-01 00:00:00'), dayjs('2026-04-12 23:59:59')],
    }
    form.setFieldsValue(values)
    setRawValues(values)
  }

  function formatPreview(value: unknown) {
    return JSON.stringify(
      value,
      (_key, currentValue: unknown) =>
        dayjs.isDayjs(currentValue) ? currentValue.format('YYYY-MM-DD HH:mm:ss') : currentValue,
      2,
    )
  }

  return (
    <PageContainer
      description={
        <div>
          <p>
            <code>getRawValues()</code> 返回组件原始值，<code>getValues()</code> / 提交时会按{' '}
            <code>codec.encode</code> 输出 payload，回填时通过 <code>codec.decode</code>{' '}
            恢复组件值。
          </p>
          <Space wrap>
            <Tag color="processing">encode：生成完整提交值</Tag>
            <Tag color="success">decode：恢复完整表单值</Tag>
            <Tag color="warning">多字段转换原子执行</Tag>
          </Space>
        </div>
      }
      extra={<DocButton />}
      title="表单 Codec"
    >
      <Card
        extra={
          <Space wrap>
            <Button onClick={fillExample}>填充示例数据</Button>
            <Button
              onClick={() => {
                setRawValues(form.getFieldsValue())
                void message.success('已刷新 getValues 输出')
              }}
              type="primary"
            >
              查看 getValues 输出
            </Button>
          </Space>
        }
        title="Codec 示例"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={() => void message.success(`getValues output: ${JSON.stringify(encoded)}`)}
          onValuesChange={(_, values) => setRawValues(values)}
        >
          <Form.Item
            extra="由表单 codec 拆分为 startTime / endTime"
            label="统计时间范围"
            name="reportRange"
          >
            <RangePicker />
          </Form.Item>
          <Form.Item extra="由表单 codec 编码为时间戳" label="截止时间" name="deadline">
            <DatePicker />
          </Form.Item>
          <Form.Item label="关键字" name="keyword">
            <Input placeholder="请输入关键字" />
          </Form.Item>
          <FormActions />
        </Form>
      </Card>
      <div className="app-codec-grid">
        <Card title="getRawValues() 输出（组件值）">
          <pre>{formatPreview(rawValues)}</pre>
        </Card>
        <Card title="getValues / submit 输出（codec.encode 后）">
          <pre>{JSON.stringify(encoded, null, 2)}</pre>
        </Card>
      </div>
    </PageContainer>
  )
}
