import { CheckOutlined } from '@ant-design/icons'
import { ColorPicker, Divider, Segmented, Slider } from 'antd'

import { updatePreferences, useAppSelector, useAppStore } from '~/core/app-store'
import { useTranslation } from '~/core/use-translation'

import { PreferenceBlock, SwitchRow } from './preference-primitives'

export function AppearancePreferences() {
  const appStore = useAppStore()
  const preferences = useAppSelector((state) => state.preferences)
  const t = useTranslation()

  return (
    <div className="preference-tab-content">
      <PreferenceBlock title="颜色模式">
        <Segmented
          block
          onChange={(value) => {
            if (value === 'dark' || value === 'light' || value === 'system') {
              updatePreferences(appStore, { colorMode: value })
            }
          }}
          options={[
            { label: '浅色', value: 'light' },
            { label: '深色', value: 'dark' },
            { label: '跟随系统', value: 'system' },
          ]}
          value={preferences.colorMode}
        />
        <SwitchRow
          checked={preferences.semiDarkHeader}
          disabled={preferences.colorMode === 'dark'}
          label="深色顶栏"
          onChange={(semiDarkHeader) => updatePreferences(appStore, { semiDarkHeader })}
        />
        <SwitchRow
          checked={preferences.semiDarkSidebar}
          disabled={preferences.colorMode === 'dark'}
          label="深色侧边栏"
          onChange={(semiDarkSidebar) => updatePreferences(appStore, { semiDarkSidebar })}
        />
        <SwitchRow
          checked={preferences.semiDarkSidebarSub}
          disabled={preferences.colorMode === 'dark'}
          label="深色子菜单"
          onChange={(semiDarkSidebarSub) => updatePreferences(appStore, { semiDarkSidebarSub })}
        />
      </PreferenceBlock>
      <Divider />
      <PreferenceBlock title="内置主题">
        <div className="preference-color-row">
          {['#006fe6', '#7c3aed', '#0284c7', '#059669', '#ea580c', '#e11d48', '#d97706'].map(
            (color) => (
              <button
                aria-label={`使用主题色 ${color}`}
                className={
                  preferences.colorPrimary === color ? 'color-swatch is-active' : 'color-swatch'
                }
                key={color}
                onClick={() => updatePreferences(appStore, { colorPrimary: color })}
                style={{ backgroundColor: color }}
                type="button"
              >
                {preferences.colorPrimary === color ? <CheckOutlined /> : null}
              </button>
            ),
          )}
          <ColorPicker
            onChangeComplete={(color) =>
              updatePreferences(appStore, { colorPrimary: color.toHexString() })
            }
            value={preferences.colorPrimary}
          />
        </div>
      </PreferenceBlock>
      <Divider />
      <PreferenceBlock title={t('preferences.radius')}>
        <Slider
          max={16}
          min={0}
          onChange={(radius) => updatePreferences(appStore, { radius })}
          value={preferences.radius}
        />
      </PreferenceBlock>
      <PreferenceBlock title="字体大小">
        <Slider
          max={20}
          min={12}
          onChange={(fontSize) => updatePreferences(appStore, { fontSize })}
          value={preferences.fontSize}
        />
      </PreferenceBlock>
      <Divider />
      <PreferenceBlock title="其他">
        <SwitchRow
          checked={preferences.colorGrayMode}
          label="灰色模式"
          onChange={(colorGrayMode) => updatePreferences(appStore, { colorGrayMode })}
        />
        <SwitchRow
          checked={preferences.colorWeakMode}
          label="色弱模式"
          onChange={(colorWeakMode) => updatePreferences(appStore, { colorWeakMode })}
        />
      </PreferenceBlock>
    </div>
  )
}
