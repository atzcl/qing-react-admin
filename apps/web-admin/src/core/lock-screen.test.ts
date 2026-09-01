import { beforeEach, describe, expect, it } from 'vitest'

import { clearLockScreenState, persistLockScreenState, readLockScreenState } from './lock-screen'

describe('lock screen persistence', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it('restores a lock for the active user after a refresh', () => {
    expect(persistLockScreenState('super', '123456')).toBe(true)
    expect(readLockScreenState('super')).toEqual({ password: '123456', username: 'super' })
  })

  it('does not reuse another user lock', () => {
    persistLockScreenState('super', '123456')

    expect(readLockScreenState('admin')).toBeNull()
    expect(readLockScreenState('super')).toBeNull()
  })

  it('clears the lock when the session is unlocked', () => {
    persistLockScreenState('super', '123456')

    expect(clearLockScreenState()).toBe(true)
    expect(readLockScreenState('super')).toBeNull()
  })
})
