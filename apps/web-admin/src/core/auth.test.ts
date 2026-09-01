import { getCurrentUser, login, logout, sendLoginCode } from './auth'

describe('client authentication', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })

  it('persists remembered users across browser sessions', () => {
    const result = login({ password: '123456', remember: true, username: 'admin' })

    expect(result.success).toBe(true)
    expect(window.localStorage.length).toBe(1)
    expect(window.sessionStorage.length).toBe(0)
    expect(getCurrentUser()?.username).toBe('admin')
  })

  it('keeps non-remembered users in the current tab only', () => {
    const result = login({ password: '123456', remember: false, username: 'user' })

    expect(result.success).toBe(true)
    expect(window.localStorage.length).toBe(0)
    expect(window.sessionStorage.length).toBe(1)
    expect(getCurrentUser()?.homePath).toBe('/dashboard/analytics')
  })

  it('rejects invalid demo credentials without creating a session', () => {
    const result = login({ password: 'not-valid', remember: true, username: 'admin' })

    expect(result).toEqual({ message: '账号或密码错误', success: false })
    expect(getCurrentUser()).toBeNull()
  })

  it('clears both storage modes on logout', () => {
    login({ password: '123456', remember: true, username: 'admin' })
    logout()

    expect(getCurrentUser()).toBeNull()
    expect(window.localStorage.length).toBe(0)
    expect(window.sessionStorage.length).toBe(0)
  })

  it('validates and masks the demo login-code request', () => {
    expect(sendLoginCode({ phone: '13800138000' })).toEqual({
      maskedPhone: '*******8000',
      success: true,
    })
  })

  it('discards malformed and schema-invalid stored sessions', () => {
    window.sessionStorage.setItem('qing-admin:auth:transient', '{broken')
    window.localStorage.setItem(
      'qing-admin:auth:persistent',
      JSON.stringify({ username: 'unknown' }),
    )

    expect(getCurrentUser()).toBeNull()
    expect(window.sessionStorage.length).toBe(0)
    expect(window.localStorage.length).toBe(0)
  })
})
