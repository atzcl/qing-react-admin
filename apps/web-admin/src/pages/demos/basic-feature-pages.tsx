import {
  CopyOutlined,
  DownloadOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
} from '@ant-design/icons'
import { useRouter } from '@tanstack/react-router'
import { Alert, App, Button, Card, Input, Modal, Radio, Space, Watermark } from 'antd'
import { useEffect, useRef, useState } from 'react'

import { PageContainer } from '~/components/page-container'
import { logout } from '~/core/auth'

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.download = fileName
  anchor.href = url
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

function saveUrl(source: string, fileName?: string) {
  const anchor = document.createElement('a')
  if (fileName) anchor.download = fileName
  anchor.href = source
  anchor.rel = 'noopener noreferrer'
  anchor.target = '_self'
  anchor.click()
}

export function ClipboardDemo() {
  const { message } = App.useApp()
  const [source, setSource] = useState('Hello')
  const [text, setText] = useState('')

  async function copy() {
    await navigator.clipboard.writeText(source)
    setText(source)
    await message.success('复制成功')
  }

  return (
    <PageContainer title="剪切板示例">
      <Card title="基本使用">
        <p className="app-demo-copy-state">
          Current copied: <code>{text || 'none'}</code>
        </p>
        <div className="app-demo-inline-input">
          <Input onChange={(event) => setSource(event.target.value)} value={source} />
          <Button icon={<CopyOutlined />} onClick={() => void copy()} type="primary">
            Copy
          </Button>
        </div>
      </Card>
    </PageContainer>
  )
}

function useFullscreenState(target?: React.RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const update = () =>
      setIsFullscreen(
        target
          ? document.fullscreenElement === target.current
          : Boolean(document.fullscreenElement),
      )
    update()
    document.addEventListener('fullscreenchange', update)
    return () => document.removeEventListener('fullscreenchange', update)
  }, [target])

  async function enter() {
    await (target?.current ?? document.documentElement).requestFullscreen()
  }

  async function exit() {
    if (document.fullscreenElement) await document.exitFullscreen()
  }

  async function toggle() {
    if (target ? document.fullscreenElement === target.current : document.fullscreenElement) {
      await exit()
    } else {
      await enter()
    }
  }

  return { enter, exit, isFullscreen, toggle }
}

export function FullScreenDemo() {
  const domRef = useRef<HTMLDivElement>(null)
  const windowFullscreen = useFullscreenState()
  const domFullscreen = useFullscreenState(domRef)

  return (
    <PageContainer title="全屏示例">
      <Card title="Window Full Screen">
        <Space size={16} wrap>
          <Button
            disabled={windowFullscreen.isFullscreen}
            icon={<FullscreenOutlined />}
            onClick={() => void windowFullscreen.enter()}
            type="primary"
          >
            Enter Window Full Screen
          </Button>
          <Button onClick={() => void windowFullscreen.toggle()}>Toggle Window Full Screen</Button>
          <Button
            danger
            disabled={!windowFullscreen.isFullscreen}
            icon={<FullscreenExitOutlined />}
            onClick={() => void windowFullscreen.exit()}
          >
            Exit Window Full Screen
          </Button>
          <span className="app-demo-nowrap">
            Current State: {String(windowFullscreen.isFullscreen)}
          </span>
        </Space>
      </Card>

      <Card className="app-demo-card" title="Dom Full Screen">
        <Button onClick={() => void domFullscreen.toggle()} type="primary">
          Enter Dom Full Screen
        </Button>
      </Card>

      <div className="app-dom-fullscreen-demo" ref={domRef}>
        <Button onClick={() => void domFullscreen.toggle()} type="primary">
          {domFullscreen.isFullscreen ? 'Exit Dom Full Screen' : 'Enter Dom Full Screen'}
        </Button>
      </div>
    </PageContainer>
  )
}

export function FileDownloadDemo() {
  const [downloadResult, setDownloadResult] = useState('')

  function getBlob() {
    const blob = new Blob(['Qing React Admin download example'], {
      type: 'text/plain;charset=utf-8',
    })
    setDownloadResult(`获取Blob成功，长度：${blob.size}`)
  }

  function getResponse() {
    const blob = new Blob(['Qing React Admin response download example'], {
      type: 'application/octet-stream',
    })
    const headers = { 'content-type': blob.type }
    setDownloadResult(`获取Response成功，headers：${JSON.stringify(headers)},长度：${blob.size}`)
  }

  return (
    <PageContainer title="文件下载示例">
      <Card title="根据文件地址下载文件">
        <Button
          icon={<DownloadOutlined />}
          onClick={() => saveUrl('https://codeload.github.com/facebook/react/zip/refs/heads/main')}
          type="primary"
        >
          Download File
        </Button>
      </Card>
      <Card className="app-demo-card" title="根据地址下载图片">
        <Button
          icon={<DownloadOutlined />}
          onClick={() => saveUrl('/admin-illustration.svg', 'admin-illustration.svg')}
          type="primary"
        >
          Download File
        </Button>
      </Card>
      <Card className="app-demo-card" title="base64流下载">
        <Button
          icon={<DownloadOutlined />}
          onClick={() =>
            saveUrl(
              'data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22240%22%3E%3Crect width=%22240%22 height=%22240%22 rx=%2248%22 fill=%22%23006fe6%22/%3E%3Ctext x=%22120%22 y=%22145%22 text-anchor=%22middle%22 font-size=%2296%22 fill=%22white%22%3EQ%3C/text%3E%3C/svg%3E',
              'image.png',
            )
          }
          type="primary"
        >
          Download Image
        </Button>
      </Card>
      <Card className="app-demo-card" title="文本下载">
        <Button
          icon={<DownloadOutlined />}
          onClick={() => saveBlob(new Blob(['text content']), 'test.txt')}
          type="primary"
        >
          Download TxT
        </Button>
      </Card>
      <Card className="app-demo-card" title="Request download">
        <Space size={16} wrap>
          <Button onClick={getBlob} type="primary">
            获取Blob
          </Button>
          <Button onClick={getResponse} type="primary">
            获取Response
          </Button>
        </Space>
        <div className="app-demo-result">{downloadResult}</div>
      </Card>
    </PageContainer>
  )
}

export function JsonBigIntDemo() {
  const [response, setResponse] = useState('')

  return (
    <PageContainer
      description="解析后端返回的长整数（long/bigInt）。代码位置：showcase/src/api/request.ts中的transformResponse"
      title="JSON BigInt Support"
    >
      <Card>
        <Alert
          title={
            <>
              有些后端接口返回的ID是长整数，但javascript原生的JSON解析是不支持超过2^53-1的长整数的。
              这种情况可以建议后端返回数据前将长整数转换为字符串类型。如果后端不接受我们的建议😡……
              <br />
              下面的按钮点击后会发起请求，接口返回的JSON数据中的id字段是超出整数范围的数字，已自动将其解析为字符串
            </>
          }
        />
        <Button
          className="app-demo-action"
          onClick={() =>
            setResponse('{\n  "id": "9223372036854775807",\n  "name": "Qing Admin"\n}')
          }
          type="primary"
        >
          发起请求
        </Button>
        <pre>{response}</pre>
      </Card>
    </PageContainer>
  )
}

type ParamsSerializer = 'brackets' | 'comma' | 'indices' | 'repeat'

function isParamsSerializer(value: unknown): value is ParamsSerializer {
  return value === 'brackets' || value === 'comma' || value === 'indices' || value === 'repeat'
}

function serializeIds(mode: ParamsSerializer) {
  const ids = [2512, 3241, 4255]
  if (mode === 'comma') return `ids=${ids.join(',')}`
  if (mode === 'repeat') return ids.map((id) => `ids=${id}`).join('&')
  if (mode === 'indices') return ids.map((id, index) => `ids[${index}]=${id}`).join('&')
  return ids.map((id) => `ids[]=${id}`).join('&')
}

export function RequestParamsSerializerDemo() {
  const params = { ids: [2512, 3241, 4255] }
  const [paramsSerializer, setParamsSerializer] = useState<ParamsSerializer>('brackets')
  const paramsString = serializeIds(paramsSerializer)
  const response = `${window.location.origin}/api/examples/params?${paramsString}`

  return (
    <PageContainer
      description="不同的后台接口可能对数组类型的GET参数的解析方式不同，我们预置了几种数组序列化方式，通过配置 paramsSerializer 来实现不同的序列化方式"
      title="请求参数序列化"
    >
      <Card>
        <Radio.Group
          name="paramsSerializer"
          onChange={(event) => {
            const value: unknown = event.target.value
            if (isParamsSerializer(value)) setParamsSerializer(value)
          }}
          value={paramsSerializer}
        >
          <Radio value="brackets">brackets</Radio>
          <Radio value="comma">comma</Radio>
          <Radio value="indices">indices</Radio>
          <Radio value="repeat">repeat</Radio>
        </Radio.Group>
        <div className="app-serializer-results">
          <section>
            <h3>需要提交的参数</h3>
            <div>{JSON.stringify(params, null, 2)}</div>
          </section>
          <section>
            <h3>访问地址</h3>
            <pre>{response}</pre>
          </section>
          <section>
            <h3>参数字符串</h3>
            <pre>{encodeURI(paramsString)}</pre>
          </section>
          <section>
            <h3>参数解码</h3>
            <pre>{paramsString}</pre>
          </section>
        </div>
      </Card>
    </PageContainer>
  )
}

export function LoginExpiredDemo() {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)

  async function pageExpired() {
    logout()
    await router.invalidate()
    await router.navigate({
      href: `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`,
    })
  }

  return (
    <PageContainer
      description={
        <div className="app-login-expired-description">
          接口请求遇到401状态码时，需要重新登录。有两种方式：
          <p>1.转到登录页，登录成功后跳转回原页面</p>
          <p>2.弹出重新登录弹窗，登录后关闭弹窗，不进行任何页面跳转（刷新后还是会跳转登录页面）</p>
        </div>
      }
      title="登录过期演示"
    >
      <Card className="app-demo-card" title="跳转登录页面方式">
        <Button onClick={() => void pageExpired()} type="primary">
          点击触发
        </Button>
      </Card>
      <Card className="app-demo-card" title="登录弹窗方式">
        <Button onClick={() => setModalOpen(true)} type="primary">
          点击触发
        </Button>
      </Card>
      <Modal
        cancelText="取消"
        okText="重新登录"
        onCancel={() => setModalOpen(false)}
        onOk={() => setModalOpen(false)}
        open={modalOpen}
        title="登录已过期"
      >
        <p>您的登录状态已过期，请重新登录后继续操作。</p>
        <Input defaultValue="super" placeholder="账号" />
        <Input.Password className="app-demo-action" defaultValue="123456" placeholder="密码" />
      </Modal>
    </PageContainer>
  )
}

export function WatermarkDemo() {
  const [watermarkContent, setWatermarkContent] = useState<string[]>([])
  const watermark = watermarkContent.length > 0

  function createWatermark() {
    setWatermarkContent(['hello my watermark', new Date().toLocaleString()])
  }

  function destroyWatermark() {
    setWatermarkContent([])
  }

  return (
    <PageContainer
      description={
        <div className="app-watermark-description">使用 Ant Design 官方 Watermark 组件。</div>
      }
      title="水印"
    >
      <Card title="使用">
        {watermark ? (
          <Watermark content={watermarkContent} gap={[100, 100]} rotate={22}>
            <WatermarkActions
              createWatermark={createWatermark}
              destroyWatermark={destroyWatermark}
              watermark
            />
          </Watermark>
        ) : (
          <WatermarkActions
            createWatermark={createWatermark}
            destroyWatermark={destroyWatermark}
            watermark={false}
          />
        )}
      </Card>
    </PageContainer>
  )
}

function WatermarkActions({
  createWatermark,
  destroyWatermark,
  watermark,
}: {
  createWatermark: () => void
  destroyWatermark: () => void
  watermark: boolean
}) {
  return (
    <div className="app-watermark-demo-content">
      <Space size={8} wrap>
        <Button disabled={watermark} onClick={createWatermark} type="primary">
          创建水印
        </Button>
        <Button disabled={!watermark} onClick={createWatermark} type="primary">
          更新水印
        </Button>
        <Button danger disabled={!watermark} onClick={destroyWatermark}>
          移除水印
        </Button>
      </Space>
    </div>
  )
}
