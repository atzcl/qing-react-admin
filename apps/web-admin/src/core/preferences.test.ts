import { describe, expect, it } from 'vitest'

import { defaultPreferences, parsePreferences, widgetKeys } from './preferences'

describe('preferences contract', () => {
  it('migrates partial persisted preferences onto current defaults', () => {
    const preferences = parsePreferences({ colorMode: 'light', widgetOrder: ['refresh'] })

    expect(preferences.colorMode).toBe('light')
    expect(preferences.locale).toBe(defaultPreferences.locale)
    expect(preferences.widgetOrder).toEqual([
      'refresh',
      ...widgetKeys.filter((key) => key !== 'refresh'),
    ])
  })

  it('rejects unknown widget keys instead of leaking strings into the UI model', () => {
    expect(parsePreferences({ widgetOrder: ['unknown-widget'] }).widgetOrder).toEqual(
      defaultPreferences.widgetOrder,
    )
  })

  it('strips the removed hover expansion preference from persisted data', () => {
    expect('sidebarExpandOnHover' in parsePreferences({ sidebarExpandOnHover: true })).toBe(false)
  })

  it('moves the legacy header tools to the top bar during preference migration', () => {
    const preferences = parsePreferences({
      widgetFullscreenPosition: 'user-dropdown',
      widgetLanguagePosition: 'user-dropdown',
      widgetRefreshPosition: 'user-dropdown',
      widgetTimezonePosition: 'user-dropdown',
    })

    expect(preferences.widgetFullscreenPosition).toBe('header')
    expect(preferences.widgetLanguagePosition).toBe('header')
    expect(preferences.widgetRefreshPosition).toBe('none')
    expect(preferences.widgetTimezonePosition).toBe('header')
  })
})
