import { Input, InputNumber, Select } from 'antd'

import { updatePreferences, useAppSelector, useAppStore } from '~/core/app-store'

import { PreferenceBlock, SwitchRow } from './preference-primitives'

export function ShowcasePreferences() {
  const appStore = useAppStore()
  const preferences = useAppSelector((state) => state.preferences)

  return (
    <div className="preference-tab-content">
      <PreferenceBlock title="Showcase 业务偏好">
        <label className="preference-field-row">
          <span>看板标题</span>
          <Input
            onChange={(event) =>
              updatePreferences(appStore, { showcaseReportTitle: event.target.value })
            }
            placeholder="请输入看板标题"
            value={preferences.showcaseReportTitle}
          />
        </label>
        <label className="preference-field-row">
          <span>
            默认展示条数
            <small>用于控制示例页中任务列表默认渲染多少条数据。</small>
          </span>
          <InputNumber
            max={8}
            min={1}
            onChange={(value) => {
              if (typeof value === 'number') {
                updatePreferences(appStore, { showcaseDefaultVisibleRows: value })
              }
            }}
            step={1}
            value={preferences.showcaseDefaultVisibleRows}
          />
        </label>
        <SwitchRow
          checked={preferences.showcaseEnableQuickActions}
          label="显示快捷操作"
          onChange={(showcaseEnableQuickActions) =>
            updatePreferences(appStore, { showcaseEnableQuickActions })
          }
        />
        <label className="preference-field-row">
          <span>高亮风格</span>
          <Select
            onChange={(showcaseHighlightTone) =>
              updatePreferences(appStore, { showcaseHighlightTone })
            }
            options={[
              { label: '默认', value: 'default' },
              { label: '成功', value: 'success' },
              { label: '警告', value: 'warning' },
            ]}
            value={preferences.showcaseHighlightTone}
          />
        </label>
      </PreferenceBlock>
    </div>
  )
}
