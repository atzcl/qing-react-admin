import { DownloadOutlined, PictureOutlined, UploadOutlined } from '@ant-design/icons'
import { App, Button, Card, Flex, Select, Switch, Typography, Upload } from 'antd'
import { useRef, useState } from 'react'

import { PageContainer } from '~/components/page-container'
import { initialEditorContent, RichEditor } from '~/components/rich-editor'
import { VCropper } from '~/components/v-cropper'
import type { VCropperRef } from '~/components/v-cropper'

export function CropperExample() {
  const { message } = App.useApp()
  const cropperRef = useRef<VCropperRef>(null)
  const [aspect, setAspect] = useState('1:1')
  const [source, setSource] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)

  async function makeCrop() {
    if (!source || !cropperRef.current) return
    setLoading(true)
    try {
      const result = await cropperRef.current.getCropImage('image/jpeg', 0.92, 'base64')
      if (typeof result === 'string') setPreview(result)
    } catch {
      void message.error('图片裁剪失败')
    }
    setLoading(false)
  }

  return (
    <PageContainer
      description="VCropper是一个图片裁剪组件，提供基础的图片裁剪功能。"
      title="VCropper 图片裁剪"
    >
      <Card>
        <Flex align="center" className="app-cropper-controls" gap={16} wrap>
          <strong>当前裁剪比例：</strong>
          <Select
            onChange={setAspect}
            options={[
              { label: '1:1', value: '1:1' },
              { label: '16:9', value: '16:9' },
              { label: '不限制', value: '' },
            ]}
            value={aspect}
          />
          <Upload
            accept="image/*"
            beforeUpload={(file) => {
              if (!file.type.startsWith('image/')) {
                void message.error('请上传图片文件')
                return Upload.LIST_IGNORE
              }
              const reader = new FileReader()
              reader.addEventListener('load', () => {
                if (typeof reader.result !== 'string') return
                setSource(reader.result)
                setPreview('')
              })
              reader.readAsDataURL(file)
              return false
            }}
            maxCount={1}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>上传图片</Button>
          </Upload>
        </Flex>
        {source ? (
          <div className="app-cropper-main">
            <div className="app-cropper-editor">
              <VCropper
                aspectRatio={aspect || undefined}
                height={600}
                img={source}
                key={source}
                ref={cropperRef}
              />
            </div>
            <div className="app-cropper-actions">
              <Button loading={loading} onClick={() => void makeCrop()} type="primary">
                裁剪
              </Button>
              {preview ? (
                <Button
                  danger
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    const link = document.createElement('a')
                    link.download = `cropped-image-${Date.now()}.png`
                    link.href = preview
                    link.click()
                  }}
                >
                  下载图片
                </Button>
              ) : null}
            </div>
            {preview ? <img alt="裁剪预览" className="app-cropper-preview" src={preview} /> : null}
          </div>
        ) : (
          <div className="app-cropper-empty">
            <PictureOutlined />
            <span>请先上传一张图片</span>
          </div>
        )}
      </Card>
    </PageContainer>
  )
}

export function TiptapExample() {
  const [content, setContent] = useState(initialEditorContent)
  const [enableUpload, setEnableUpload] = useState(true)

  return (
    <PageContainer
      description="基于 React 19 与 Tiptap 封装的富文本编辑器，支持完整工具栏、图片、链接、代码与颜色能力。"
      title="Tiptap 富文本"
    >
      <Card className="app-demo-card" title="编辑器">
        <Flex align="center" className="app-tiptap-upload-switch" gap={12}>
          <span>启用图片上传：</span>
          <Switch checked={enableUpload} onChange={setEnableUpload} />
        </Flex>
        <RichEditor enableImageUpload={enableUpload} onChange={setContent} value={content} />
      </Card>
      <Card className="app-demo-card" title="富文本预览">
        <div className="app-tiptap-preview" dangerouslySetInnerHTML={{ __html: content }} />
      </Card>
      <Card title="HTML 输出">
        <Typography.Paragraph className="app-tiptap-html" code copyable={{ text: content }}>
          {content}
        </Typography.Paragraph>
      </Card>
    </PageContainer>
  )
}
