import { Alert, Button, Card, Space, Tag } from 'antd'

import { PageContainer } from '~/components/page-container'
import { updatePreferences, useAppSelector, useAppStore } from '~/core/app-store'

interface DemoTaskItem {
  id: number
  owner: string
  priority: 'P0' | 'P1' | 'P2'
  title: string
}

const demoTasks: DemoTaskItem[] = [
  { id: 1, owner: 'Luna', priority: 'P0', title: '同步租户配置到缓存' },
  { id: 2, owner: 'Aiden', priority: 'P1', title: '补充角色权限回归用例' },
  { id: 3, owner: 'Mia', priority: 'P0', title: '修复看板接口超时重试' },
  { id: 4, owner: 'Noah', priority: 'P2', title: '整理本周运营周报模板' },
  { id: 5, owner: 'Ethan', priority: 'P1', title: '验证暗黑主题下图表对比度' },
  { id: 6, owner: 'Sophia', priority: 'P1', title: '更新埋点字段映射文档' },
  { id: 7, owner: 'Lucas', priority: 'P2', title: '检查消息中心未读状态同步' },
  { id: 8, owner: 'Emma', priority: 'P0', title: '补齐导出任务失败告警' },
]

const toneMap = {
  default: { alertType: 'info', label: '默认', tagColor: 'processing' },
  success: { alertType: 'success', label: '成功', tagColor: 'success' },
  warning: { alertType: 'warning', label: '警告', tagColor: 'warning' },
} as const

function priorityColor(priority: DemoTaskItem['priority']) {
  if (priority === 'P0') return 'error'
  if (priority === 'P1') return 'warning'
  return 'default'
}

export function PreferencesExtensionDemo() {
  const appStore = useAppStore()
  const preferences = useAppSelector((state) => state.preferences)
  const extension = {
    defaultVisibleRows: preferences.showcaseDefaultVisibleRows,
    enableQuickActions: preferences.showcaseEnableQuickActions,
    highlightTone: preferences.showcaseHighlightTone,
    reportTitle: preferences.showcaseReportTitle,
  }
  const tone = toneMap[extension.highlightTone]

  function applyPreset(type: 'compact' | 'focus' | 'review') {
    const presets = {
      compact: {
        showcaseDefaultVisibleRows: 3,
        showcaseEnableQuickActions: false,
        showcaseHighlightTone: 'warning' as const,
        showcaseReportTitle: '紧凑模式看板',
      },
      focus: {
        showcaseDefaultVisibleRows: 4,
        showcaseEnableQuickActions: true,
        showcaseHighlightTone: 'default' as const,
        showcaseReportTitle: '本周运营概览',
      },
      review: {
        showcaseDefaultVisibleRows: 6,
        showcaseEnableQuickActions: true,
        showcaseHighlightTone: 'success' as const,
        showcaseReportTitle: '评审态工作看板',
      },
    }
    updatePreferences(appStore, presets[type])
  }

  return (
    <PageContainer
      description="这个页面直接读取 showcase 子项目定义的拓展偏好。你可以在右上角的“偏好设置 → Showcase 拓展”中修改字段，也可以点击下方预设按钮，页面会实时联动。"
      title="偏好设置扩展"
    >
      <Card className="app-demo-card" title="当前拓展配置">
        <Alert
          description={`默认展示 ${extension.defaultVisibleRows} 条任务；${extension.enableQuickActions ? '显示' : '隐藏'} 快捷操作；当前高亮风格为“${tone.label}”。`}
          showIcon
          title={`当前标题：${extension.reportTitle}`}
          type={tone.alertType}
        />

        <div className={`app-preference-board is-${extension.highlightTone}`}>
          <header>
            <div>
              <div className="app-preference-board__title">{extension.reportTitle}</div>
              <div className="app-preference-board__description">
                这是一个“真实使用”的示例：页面标题、操作区、列表条数和高亮样式都由拓展偏好驱动。
              </div>
            </div>
            <Tag color={tone.tagColor}>{tone.label}</Tag>
          </header>

          {extension.enableQuickActions ? (
            <Space className="app-preference-board__actions" wrap>
              <Button type="primary">新建任务</Button>
              <Button>批量导出</Button>
              <Button>刷新数据</Button>
            </Space>
          ) : (
            <div className="app-preference-board__disabled">
              当前已关闭快捷操作，页面只保留只读信息展示。
            </div>
          )}

          <div className="app-task-list">
            {demoTasks.slice(0, extension.defaultVisibleRows).map((task) => (
              <div className="app-task" key={task.id}>
                <div>
                  <div className="app-task__title">{task.title}</div>
                  <div className="app-task__owner">负责人：{task.owner}</div>
                </div>
                <Tag color={priorityColor(task.priority)}>{task.priority}</Tag>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card title="快捷预设（演示 updateCustomPreferences 用法）">
        <Space wrap>
          <Button onClick={() => applyPreset('focus')}>恢复默认</Button>
          <Button onClick={() => applyPreset('compact')}>切换紧凑模式</Button>
          <Button onClick={() => applyPreset('review')} type="primary">
            切换评审模式
          </Button>
        </Space>
        <pre className="app-preference-json">{JSON.stringify(extension, null, 2)}</pre>
      </Card>
    </PageContainer>
  )
}
