import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { readPersisted, removePersisted, writePersisted } from './persisted-storage'

describe('persisted storage', () => {
  it('removes malformed JSON and returns the validated fallback', () => {
    window.localStorage.setItem('broken', '{not-json')

    expect(readPersisted(window.localStorage, 'broken', z.array(z.string()), [])).toEqual([])
    expect(window.localStorage.getItem('broken')).toBeNull()
  })

  it('round-trips values through a Zod boundary', () => {
    const schema = z.object({ locale: z.enum(['en-US', 'zh-CN']) })
    expect(writePersisted(window.localStorage, 'preferences', { locale: 'zh-CN' })).toBe(true)
    expect(readPersisted(window.localStorage, 'preferences', schema, { locale: 'en-US' })).toEqual({
      locale: 'zh-CN',
    })
    expect(removePersisted(window.localStorage, 'preferences')).toBe(true)
  })

  it('contains restricted storage failures', () => {
    const restricted = {
      clear: () => undefined,
      getItem: () => {
        throw new Error('blocked')
      },
      key: () => null,
      length: 0,
      removeItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
    } satisfies Storage

    expect(readPersisted(restricted, 'key', z.string(), 'fallback')).toBe('fallback')
    expect(writePersisted(restricted, 'key', 'value')).toBe(false)
    expect(removePersisted(restricted, 'key')).toBe(false)
  })
})
