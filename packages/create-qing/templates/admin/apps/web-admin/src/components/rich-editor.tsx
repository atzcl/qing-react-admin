import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  CodeOutlined,
  EyeOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  PictureOutlined,
  RedoOutlined,
  StrikethroughOutlined,
  UndoOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { Color, TextStyle } from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { App, Button, ColorPicker, Input, Modal, Select, Tooltip, Upload } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import { ButtonList } from './button-list'
import type { ButtonListItem } from './button-list'

export const initialEditorContent = `
  <h1>Qing Tiptap</h1>
  <p>这是基于 Tiptap 与 React 19 封装的可复用富文本编辑器。</p>
  <p>支持<strong>常用格式</strong>、<a href="https://tiptap.dev">链接</a>、多级标题、列表、代码块、文字颜色、高亮颜色、图片与对齐方式。</p>
  <blockquote>工具栏与预览能力都封装在 <code>src/components/rich-editor.tsx</code> 中。</blockquote>
  <pre><code>const stack = ['React 19', 'Tiptap', 'Ant Design 6']</code></pre>
`

const editorExtensions = [
  StarterKit.configure({ link: false, underline: false }),
  Underline,
  Image.configure({ allowBase64: true }),
  Link.configure({ autolink: true, defaultProtocol: 'https', openOnClick: false }),
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Placeholder.configure({ placeholder: '请输入内容…' }),
]

export function RichEditor({
  enableImageUpload = false,
  onChange,
  value,
}: {
  enableImageUpload?: boolean
  onChange?: (value: string) => void
  value?: string
}) {
  const { message } = App.useApp()
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkValue, setLinkValue] = useState('')
  const [imageOpen, setImageOpen] = useState(false)
  const [imageValue, setImageValue] = useState('')
  const [previewHtml, setPreviewHtml] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const editor = useEditor({
    content: value ?? '',
    extensions: editorExtensions,
    onUpdate: ({ editor: currentEditor }) => {
      if (!currentEditor.isDestroyed) onChange?.(currentEditor.getHTML())
    },
  })
  const activeEditor = editor.isDestroyed ? null : editor

  useEffect(() => {
    if (!activeEditor || value === undefined) return
    try {
      if (activeEditor.getHTML() === value) return
    } catch {
      return
    }
    activeEditor.commands.setContent(value, { emitUpdate: false })
  }, [activeEditor, value])

  function uploadImage(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      void message.error('图片大小不能超过 5MB')
      return Upload.LIST_IGNORE
    }
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result !== 'string') return
      activeEditor?.chain().focus().setImage({ alt: file.name, src: reader.result }).run()
      void message.success('图片已插入，文件仅在浏览器本地读取')
    })
    reader.readAsDataURL(file)
    return false
  }

  const formatItems = useMemo<ButtonListItem[]>(
    () => [
      {
        'aria-label': '粗体',
        icon: <BoldOutlined />,
        key: 'bold',
        onClick: () => activeEditor?.chain().focus().toggleBold().run(),
        type: activeEditor?.isActive('bold') ? 'primary' : 'text',
      },
      {
        'aria-label': '斜体',
        icon: <ItalicOutlined />,
        key: 'italic',
        onClick: () => activeEditor?.chain().focus().toggleItalic().run(),
        type: activeEditor?.isActive('italic') ? 'primary' : 'text',
      },
      {
        'aria-label': '下划线',
        key: 'underline',
        label: <u>U</u>,
        onClick: () => activeEditor?.chain().focus().toggleUnderline().run(),
        type: activeEditor?.isActive('underline') ? 'primary' : 'text',
      },
      {
        'aria-label': '删除线',
        icon: <StrikethroughOutlined />,
        key: 'strike',
        onClick: () => activeEditor?.chain().focus().toggleStrike().run(),
        type: activeEditor?.isActive('strike') ? 'primary' : 'text',
      },
      {
        'aria-label': '行内代码',
        icon: <CodeOutlined />,
        key: 'code',
        onClick: () => activeEditor?.chain().focus().toggleCode().run(),
        type: activeEditor?.isActive('code') ? 'primary' : 'text',
      },
    ],
    [activeEditor],
  )

  const blockItems = useMemo<ButtonListItem[]>(
    () => [
      {
        'aria-label': '无序列表',
        icon: <UnorderedListOutlined />,
        key: 'bullet',
        onClick: () => activeEditor?.chain().focus().toggleBulletList().run(),
        type: activeEditor?.isActive('bulletList') ? 'primary' : 'text',
      },
      {
        'aria-label': '有序列表',
        icon: <OrderedListOutlined />,
        key: 'ordered',
        onClick: () => activeEditor?.chain().focus().toggleOrderedList().run(),
        type: activeEditor?.isActive('orderedList') ? 'primary' : 'text',
      },
      {
        key: 'quote',
        label: '引用',
        onClick: () => activeEditor?.chain().focus().toggleBlockquote().run(),
        type: activeEditor?.isActive('blockquote') ? 'primary' : 'text',
      },
      {
        key: 'code-block',
        label: '代码块',
        onClick: () => activeEditor?.chain().focus().toggleCodeBlock().run(),
        type: activeEditor?.isActive('codeBlock') ? 'primary' : 'text',
      },
    ],
    [activeEditor],
  )

  return (
    <div className="app-tiptap">
      <div className="app-tiptap__toolbar">
        <ButtonList
          gap={0}
          list={[
            {
              'aria-label': '撤销',
              disabled: !activeEditor?.can().chain().focus().undo().run(),
              icon: <UndoOutlined />,
              key: 'undo',
              onClick: () => activeEditor?.chain().focus().undo().run(),
            },
            {
              'aria-label': '重做',
              disabled: !activeEditor?.can().chain().focus().redo().run(),
              icon: <RedoOutlined />,
              key: 'redo',
              onClick: () => activeEditor?.chain().focus().redo().run(),
            },
            {
              key: 'clear',
              label: '清除格式',
              onClick: () => activeEditor?.chain().focus().clearNodes().unsetAllMarks().run(),
            },
          ]}
          size="small"
          type="text"
        />
        <span className="app-tiptap__separator" />
        <ButtonList gap={0} list={formatItems} size="small" />
        <span className="app-tiptap__separator" />
        <Select
          aria-label="段落样式"
          onChange={(next: string) => {
            if (next === 'paragraph') activeEditor?.chain().focus().setParagraph().run()
            if (next === '1') activeEditor?.chain().focus().toggleHeading({ level: 1 }).run()
            if (next === '2') activeEditor?.chain().focus().toggleHeading({ level: 2 }).run()
            if (next === '3') activeEditor?.chain().focus().toggleHeading({ level: 3 }).run()
            if (next === '4') activeEditor?.chain().focus().toggleHeading({ level: 4 }).run()
          }}
          options={[
            { label: '正文', value: 'paragraph' },
            ...([1, 2, 3, 4] as const).map((level) => ({
              label: `标题 ${level}`,
              value: String(level),
            })),
          ]}
          size="small"
          value={
            activeEditor?.isActive('heading')
              ? String(activeEditor.getAttributes('heading').level)
              : 'paragraph'
          }
        />
        <ButtonList gap={0} list={blockItems} size="small" />
        <span className="app-tiptap__separator" />
        <ButtonList
          gap={0}
          list={[
            {
              icon: <LinkOutlined />,
              key: 'link',
              label: '链接',
              onClick: () => {
                setLinkValue(activeEditor?.getAttributes('link').href ?? '')
                setLinkOpen(true)
              },
              type: activeEditor?.isActive('link') ? 'primary' : 'text',
            },
            {
              disabled: !activeEditor?.isActive('link'),
              key: 'unlink',
              label: '取消链接',
              onClick: () => activeEditor?.chain().focus().unsetLink().run(),
            },
            {
              icon: <PictureOutlined />,
              key: 'image-url',
              label: '图片地址',
              onClick: () => setImageOpen(true),
            },
          ]}
          size="small"
          type="text"
        />
        {enableImageUpload ? (
          <Upload accept="image/*" beforeUpload={uploadImage} showUploadList={false}>
            <Button icon={<PictureOutlined />} size="small" type="text">
              上传图片
            </Button>
          </Upload>
        ) : null}
        <Tooltip title="文字颜色">
          <ColorPicker
            allowClear
            disabledAlpha
            onChange={(_color, css) => activeEditor?.chain().focus().setColor(css).run()}
            onClear={() => activeEditor?.chain().focus().unsetColor().run()}
            presets={[
              {
                colors: ['#1f2329', '#1677ff', '#13c2c2', '#52c41a', '#fa8c16', '#f5222d'],
                label: '常用颜色',
              },
            ]}
            size="small"
            value={activeEditor?.getAttributes('textStyle').color ?? '#1f2329'}
          />
        </Tooltip>
        <Tooltip title="高亮颜色">
          <ColorPicker
            allowClear
            disabledAlpha
            onChange={(_color, css) =>
              activeEditor?.chain().focus().setHighlight({ color: css }).run()
            }
            onClear={() => activeEditor?.chain().focus().unsetHighlight().run()}
            presets={[
              {
                colors: ['#fff1b8', '#d9f7be', '#bae7ff', '#efdbff', '#ffd6e7'],
                label: '高亮颜色',
              },
            ]}
            size="small"
            value={activeEditor?.getAttributes('highlight').color ?? '#fff1b8'}
          />
        </Tooltip>
        <span className="app-tiptap__separator" />
        <ButtonList
          gap={0}
          list={[
            {
              'aria-label': '左对齐',
              icon: <AlignLeftOutlined />,
              key: 'left',
              onClick: () => activeEditor?.chain().focus().setTextAlign('left').run(),
            },
            {
              'aria-label': '居中对齐',
              icon: <AlignCenterOutlined />,
              key: 'center',
              onClick: () => activeEditor?.chain().focus().setTextAlign('center').run(),
            },
            {
              'aria-label': '右对齐',
              icon: <AlignRightOutlined />,
              key: 'right',
              onClick: () => activeEditor?.chain().focus().setTextAlign('right').run(),
            },
            {
              icon: <EyeOutlined />,
              key: 'preview',
              label: '预览',
              onClick: () => {
                setPreviewHtml(activeEditor?.getHTML() ?? '')
                setPreviewOpen(true)
              },
            },
          ]}
          size="small"
          type="text"
        />
      </div>
      <EditorContent editor={activeEditor} />
      <Modal
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        open={previewOpen}
        title="内容预览"
        width={760}
      >
        <div className="app-tiptap-preview" dangerouslySetInnerHTML={{ __html: previewHtml }} />
      </Modal>
      <Modal
        onCancel={() => setLinkOpen(false)}
        onOk={() => {
          const href = linkValue.trim()
          if (href) activeEditor?.chain().focus().extendMarkRange('link').setLink({ href }).run()
          else activeEditor?.chain().focus().unsetLink().run()
          setLinkOpen(false)
        }}
        open={linkOpen}
        title="设置链接"
      >
        <Input
          autoFocus
          onChange={(event) => setLinkValue(event.target.value)}
          placeholder="https://example.com"
          value={linkValue}
        />
      </Modal>
      <Modal
        onCancel={() => setImageOpen(false)}
        onOk={() => {
          const src = imageValue.trim()
          if (src) activeEditor?.chain().focus().setImage({ src }).run()
          setImageOpen(false)
          setImageValue('')
        }}
        open={imageOpen}
        title="插入网络图片"
      >
        <Input
          autoFocus
          onChange={(event) => setImageValue(event.target.value)}
          placeholder="https://example.com/image.png"
          value={imageValue}
        />
      </Modal>
    </div>
  )
}
