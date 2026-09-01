import { describe, expect, it } from 'vitest'

import { codeLoginSchema, forgetPasswordSchema, registerSchema } from './auth-pages'

describe('authentication page contracts', () => {
  it('matches the six-digit mobile login validation contract', () => {
    expect(codeLoginSchema.safeParse({ code: '123456', phoneNumber: '13800138000' }).success).toBe(
      true,
    )
    expect(codeLoginSchema.safeParse({ code: '12345', phoneNumber: '13800138000' }).success).toBe(
      false,
    )
    expect(codeLoginSchema.safeParse({ code: '123456', phoneNumber: '123' }).success).toBe(false)
  })

  it('rejects invalid reset addresses', () => {
    expect(forgetPasswordSchema.safeParse({ email: 'admin@example.com' }).success).toBe(true)
    expect(forgetPasswordSchema.safeParse({ email: 'not-an-email' }).success).toBe(false)
  })

  it('requires matching passwords and policy consent', () => {
    const valid = {
      agreePolicy: true,
      confirmPassword: '123456',
      password: '123456',
      username: 'super',
    }
    expect(registerSchema.safeParse(valid).success).toBe(true)
    expect(registerSchema.safeParse({ ...valid, agreePolicy: false }).success).toBe(false)
    expect(registerSchema.safeParse({ ...valid, confirmPassword: '654321' }).success).toBe(false)
  })
})
