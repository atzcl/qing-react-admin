import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import {
  queryFormSearchSignature,
  queryFormDayjsSchema,
  readQueryFormSearch,
  writeQueryFormSearch,
} from './query-form-search'

describe('query form URL search', () => {
  const userSchema = z.object({
    active: z.boolean().optional(),
    createdAt: queryFormDayjsSchema.optional(),
    filters: z.object({ level: z.number() }).optional(),
    keywords: z.array(z.string()).optional(),
    name: z.string().optional(),
  })

  it('round-trips primitive, array, nested and Dayjs values', () => {
    const search = writeQueryFormSearch('', 'users', {
      active: true,
      createdAt: dayjs('2026-09-01T08:30:00+08:00'),
      filters: { level: 2 },
      keywords: ['Qing', 'React'],
      name: 'Ada',
    })
    const values = readQueryFormSearch<{
      active: boolean
      createdAt: dayjs.Dayjs
      filters: { level: number }
      keywords: string[]
      name: string
    }>(search, 'users', userSchema)

    expect(values).toMatchObject({
      active: true,
      filters: { level: 2 },
      keywords: ['Qing', 'React'],
      name: 'Ada',
    })
    expect(values?.createdAt?.format('YYYY-MM-DD HH:mm')).toBe('2026-09-01 08:30')
  })

  it('isolates namespaces and removes only the reset form', () => {
    const withUsers = writeQueryFormSearch('?lang=zh-CN', 'users', { name: 'Ada' })
    const withRoles = writeQueryFormSearch(withUsers, 'roles', { status: 1 })
    const withoutUsers = writeQueryFormSearch(withRoles, 'users')

    expect(
      readQueryFormSearch(withoutUsers, 'users', z.object({ name: z.string() })),
    ).toBeUndefined()
    expect(readQueryFormSearch(withoutUsers, 'roles', z.object({ status: z.literal(1) }))).toEqual({
      status: 1,
    })
    expect(new URLSearchParams(withoutUsers).get('lang')).toBe('zh-CN')
    expect(queryFormSearchSignature(withoutUsers, 'roles')).not.toBeNull()
  })

  it('ignores malformed or unvalidated payloads', () => {
    expect(readQueryFormSearch('?qf=not-json', 'users', userSchema)).toBeUndefined()
    expect(
      readQueryFormSearch('?qf=j%3A%7B%22users%22%3A1%7D', 'users', userSchema),
    ).toBeUndefined()
  })

  it('rejects a structurally valid payload that violates the page schema', () => {
    const search = writeQueryFormSearch('', 'users', { createdAt: 'not-a-dayjs', name: 42 })

    expect(readQueryFormSearch(search, 'users', userSchema)).toBeUndefined()
  })
})
