import { beforeEach, describe, expect, it } from 'vitest'

import {
  createDefaultColumnPreferences,
  moveColumnPreference,
  normalizeColumnPreferences,
  readColumnPreferences,
  readDensity,
  updateAllColumnPreferenceVisibility,
  updateColumnPreferenceFixedSide,
  updateColumnPreferenceVisibility,
  writeColumnPreferences,
  writeDensity,
} from './table-preferences'

const columns = ['name', 'status', 'operation'] as const

describe('table preferences', () => {
  beforeEach(() => window.localStorage.clear())

  it('repairs stale identifiers and legacy visibility arrays', () => {
    expect(normalizeColumnPreferences(['name', 'removed'], columns)).toMatchObject({
      fixedColumnIds: {},
      orderedColumnIds: columns,
    })
    expect(
      normalizeColumnPreferences(
        {
          fixedColumnIds: { name: 'left', removed: 'right', status: 'invalid' },
          orderedColumnIds: ['operation', 'removed'],
          visibleColumnIds: ['status', 'removed'],
        },
        columns,
      ),
    ).toMatchObject({
      fixedColumnIds: { name: 'left' },
      orderedColumnIds: ['operation', 'name', 'status'],
    })
  })

  it('keeps one visible column and supports reset, ordering, and fixed sides', () => {
    let preferences = createDefaultColumnPreferences(columns)
    preferences = updateAllColumnPreferenceVisibility(preferences, false, columns)
    expect([...preferences.visibleColumnIds]).toEqual(['name'])
    preferences = updateColumnPreferenceVisibility(preferences, 'name', false, columns)
    expect([...preferences.visibleColumnIds]).toEqual(['name'])
    preferences = updateColumnPreferenceVisibility(preferences, 'status', true, columns)
    preferences = moveColumnPreference(preferences, 'status', 'name', columns)
    expect(preferences.orderedColumnIds).toEqual(['status', 'name', 'operation'])
    preferences = updateColumnPreferenceFixedSide(preferences, 'operation', 'right', columns)
    expect(preferences.fixedColumnIds).toEqual({ operation: 'right' })
    preferences = updateColumnPreferenceFixedSide(preferences, 'operation', 'right', columns)
    expect(preferences.fixedColumnIds).toEqual({})
  })

  it('isolates explicit table keys and validates persisted density', () => {
    const userPreferences = updateColumnPreferenceVisibility(
      createDefaultColumnPreferences(columns),
      'status',
      false,
      columns,
    )
    expect(writeColumnPreferences('table.user', userPreferences)).toBe(true)
    expect([...readColumnPreferences('table.user', columns).visibleColumnIds]).toEqual([
      'name',
      'operation',
    ])
    expect([...readColumnPreferences('table.role', columns).visibleColumnIds]).toEqual(columns)

    expect(writeDensity('table.density', 'small')).toBe(true)
    expect(readDensity('table.density', 'middle')).toBe('small')
    window.localStorage.setItem('table.density', JSON.stringify('invalid'))
    expect(readDensity('table.density', 'middle')).toBe('middle')
  })
})
