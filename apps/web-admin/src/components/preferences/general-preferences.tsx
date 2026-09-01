import { Divider, Input, Select } from 'antd'

import { updatePreferences, useAppSelector, useAppStore } from '~/core/app-store'
import { supportedLocaleOptions } from '~/core/i18n'
import { useTranslation } from '~/core/use-translation'

import { PreferenceBlock, SwitchRow } from './preference-primitives'

export function GeneralPreferences() {
  const appStore = useAppStore()
  const preferences = useAppSelector((state) => state.preferences)
  const t = useTranslation()

  return (
    <div className="preference-tab-content">
      <PreferenceBlock title="语言与时区">
        <label className="preference-field-row">
          <span>语言</span>
          <Select
            onChange={(locale) => updatePreferences(appStore, { locale })}
            options={[...supportedLocaleOptions]}
            value={preferences.locale}
          />
        </label>
        <label className="preference-field-row">
          <span>时区</span>
          <Select
            onChange={(timezone) => updatePreferences(appStore, { timezone })}
            options={[
              { label: 'Asia/Shanghai (UTC+8)', value: 'Asia/Shanghai' },
              { label: 'UTC', value: 'UTC' },
              { label: 'America/New_York', value: 'America/New_York' },
            ]}
            value={preferences.timezone}
          />
        </label>
      </PreferenceBlock>
      <Divider />
      <PreferenceBlock title="通用">
        <SwitchRow
          checked={preferences.dynamicTitle}
          label="动态标题"
          onChange={(dynamicTitle) => updatePreferences(appStore, { dynamicTitle })}
        />
        <SwitchRow
          checked={preferences.showWatermark}
          label={t('preferences.watermark')}
          onChange={(showWatermark) =>
            updatePreferences(appStore, {
              showWatermark,
              ...(showWatermark ? {} : { watermarkContent: '' }),
            })
          }
        />
        <Input
          disabled={!preferences.showWatermark}
          onChange={(event) =>
            updatePreferences(appStore, { watermarkContent: event.target.value })
          }
          placeholder="水印内容"
          value={preferences.watermarkContent}
        />
        <SwitchRow
          checked={preferences.enableCheckUpdates}
          label="检查更新"
          onChange={(enableCheckUpdates) => updatePreferences(appStore, { enableCheckUpdates })}
        />
        <SwitchRow
          checked={preferences.enableCopyPreferences}
          label="显示复制偏好设置按钮"
          onChange={(enableCopyPreferences) =>
            updatePreferences(appStore, { enableCopyPreferences })
          }
        />
      </PreferenceBlock>
      <Divider />
      <PreferenceBlock title="动画">
        <SwitchRow
          checked={preferences.transitionProgress}
          label="页面加载进度条"
          onChange={(transitionProgress) => updatePreferences(appStore, { transitionProgress })}
        />
        <SwitchRow
          checked={preferences.transitionLoading}
          label="页面加载动画"
          onChange={(transitionLoading) => updatePreferences(appStore, { transitionLoading })}
        />
        <SwitchRow
          checked={preferences.animations}
          label="页面切换动画"
          onChange={(animations) => updatePreferences(appStore, { animations })}
        />
        {preferences.animations ? (
          <div className="preference-transition-grid">
            {(['fade', 'fade-slide', 'fade-up', 'fade-down'] as const).map((name) => (
              <button
                className={preferences.transitionName === name ? 'is-active' : ''}
                key={name}
                onClick={() => updatePreferences(appStore, { transitionName: name })}
                type="button"
              >
                <i className={`is-${name}`} />
              </button>
            ))}
          </div>
        ) : null}
      </PreferenceBlock>
    </div>
  )
}
