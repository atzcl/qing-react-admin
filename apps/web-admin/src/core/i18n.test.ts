import { describe, expect, it } from 'vitest'

import { translate } from './i18n'

describe('translate', () => {
  it('selects the requested locale', () => {
    expect(translate('zh-CN', 'menu.analytics')).toBe('分析页')
    expect(translate('en-US', 'menu.analytics')).toBe('Analytics')
  })

  it('replaces every named parameter', () => {
    expect(translate('zh-CN', 'dashboard.greeting', { name: 'Olivia' })).toContain('Olivia')
    expect(translate('en-US', 'common.total', { count: 42 })).toBe('42 items')
  })

  it('includes the Showcase Traditional Chinese locale', () => {
    expect(translate('zh-TW', 'menu.analytics')).toBe('分析頁')
    expect(translate('zh-TW', 'menu.system')).toBe('系統管理')
  })
})
