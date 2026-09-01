import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'

import {
  queryFormSearchSignature,
  readQueryFormSearch,
  writeQueryFormSearch,
} from './query-form-search'

describe('query form URL search', () => {
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
    }>(search, 'users')

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

    expect(readQueryFormSearch(withoutUsers, 'users')).toBeUndefined()
    expect(readQueryFormSearch(withoutUsers, 'roles')).toEqual({ status: 1 })
    expect(new URLSearchParams(withoutUsers).get('lang')).toBe('zh-CN')
    expect(queryFormSearchSignature(withoutUsers, 'roles')).not.toBeNull()
  })

  it('ignores malformed or unvalidated payloads', () => {
    expect(readQueryFormSearch('?qf=not-json', 'users')).toBeUndefined()
    expect(readQueryFormSearch('?qf=j%3A%7B%22users%22%3A1%7D', 'users')).toBeUndefined()
  })
})
