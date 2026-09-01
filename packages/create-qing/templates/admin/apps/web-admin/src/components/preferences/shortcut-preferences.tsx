import { Switch } from 'antd'

import { updatePreferences, useAppSelector, useAppStore } from '~/core/app-store'

import { PreferenceBlock, SwitchRow } from './preference-primitives'

export function ShortcutPreferences() {
  const appStore = useAppStore()
  const preferences = useAppSelector((state) => state.preferences)

  return (
    <div className="preference-tab-content">
      <PreferenceBlock title="全局快捷键">
        <SwitchRow
          checked={preferences.shortcutKeysEnable}
          label="启用快捷键"
          onChange={(shortcutKeysEnable) => updatePreferences(appStore, { shortcutKeysEnable })}
        />
        {(
          [
            ['shortcutKeysSearch', '搜索', '⌘ K'],
            ['shortcutKeysLogout', '退出登录', '⌥ Q'],
            ['shortcutKeysLockScreen', '锁屏', '⌥ L'],
            ['shortcutKeysEscape', '关闭浮层', 'Esc'],
          ] as const
        ).map(([key, label, shortcut]) => (
          <div className="preference-shortcut-row" key={key}>
            <span>{label}</span>
            <kbd>{shortcut}</kbd>
            <Switch
              checked={preferences[key]}
              disabled={!preferences.shortcutKeysEnable}
              onChange={(checked) => updatePreferences(appStore, { [key]: checked })}
              size="small"
            />
          </div>
        ))}
      </PreferenceBlock>
    </div>
  )
}
