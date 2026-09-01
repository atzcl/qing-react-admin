import { describe, expect, it } from 'vitest'

import { defineAdminFeature } from './admin-feature'

function TestPage() {
  return null
}

describe('defineAdminFeature', () => {
  it('supplies navigation defaults while preserving a lazy page boundary', () => {
    const feature = defineAdminFeature({
      group: 'system',
      label: { 'en-US': 'Audit', 'zh-CN': '审计', 'zh-TW': '稽核' },
      loadPage: async () => ({ default: TestPage }),
      path: '/business/audit',
    })

    expect(feature.group).toBe('system')
    expect(feature.order).toBe(0)
    expect(feature.titleKey).toBe('menu.system')
    expect(feature.page).not.toBe(TestPage)
  })

  it('requires an explicit translation fallback for hidden utility pages', () => {
    expect(() =>
      defineAdminFeature({
        group: 'utility',
        loadPage: async () => ({ default: TestPage }),
        path: '/utility/audit',
      }),
    ).toThrow('must provide a titleKey')
  })
})
