import { z } from 'zod'

import { readPersisted, writePersisted } from './persisted-storage'

export type StandardTableDensity = 'large' | 'middle' | 'small'
export type StandardTableColumnFixedSide = 'left' | 'right'

export interface StandardTableColumnPreferences {
  fixedColumnIds: Readonly<Record<string, StandardTableColumnFixedSide>>
  orderedColumnIds: readonly string[]
  visibleColumnIds: ReadonlySet<string>
}

const storedColumnPreferencesSchema = z.object({
  fixedColumnIds: z.record(z.string(), z.enum(['left', 'right'])),
  orderedColumnIds: z.array(z.string()),
  visibleColumnIds: z.array(z.string()),
})
const densitySchema = z.enum(['large', 'middle', 'small'])

export function createDefaultColumnPreferences(
  allColumnIds: readonly string[],
): StandardTableColumnPreferences {
  return {
    fixedColumnIds: {},
    orderedColumnIds: [...allColumnIds],
    visibleColumnIds: new Set(allColumnIds),
  }
}

export function normalizeColumnPreferences(
  input: unknown,
  allColumnIds: readonly string[],
): StandardTableColumnPreferences {
  if (Array.isArray(input)) {
    return normalizeColumnPreferences({ visibleColumnIds: input }, allColumnIds)
  }
  if (!isRecord(input)) return createDefaultColumnPreferences(allColumnIds)
  const allIds = new Set(allColumnIds)
  const ordered = normalizeStringList(input.orderedColumnIds).filter((id) => allIds.has(id))
  const orderedSet = new Set(ordered)
  const visible = normalizeStringList(input.visibleColumnIds).filter((id) => allIds.has(id))
  const fixed = Object.fromEntries(
    Object.entries(isRecord(input.fixedColumnIds) ? input.fixedColumnIds : {}).filter(
      (entry): entry is [string, StandardTableColumnFixedSide] =>
        allIds.has(entry[0]) && (entry[1] === 'left' || entry[1] === 'right'),
    ),
  )
  return {
    fixedColumnIds: fixed,
    orderedColumnIds: [...ordered, ...allColumnIds.filter((id) => !orderedSet.has(id))],
    visibleColumnIds: new Set(visible.length > 0 ? visible : allColumnIds),
  }
}

export function updateColumnPreferenceVisibility(
  current: StandardTableColumnPreferences,
  columnId: string,
  visible: boolean,
  allColumnIds: readonly string[],
): StandardTableColumnPreferences {
  const normalized = normalizeColumnPreferences(current, allColumnIds)
  const next = new Set(normalized.visibleColumnIds)
  if (visible) next.add(columnId)
  else if (next.size > 1) next.delete(columnId)
  return { ...normalized, visibleColumnIds: next }
}

export function updateAllColumnPreferenceVisibility(
  current: StandardTableColumnPreferences,
  visible: boolean,
  allColumnIds: readonly string[],
): StandardTableColumnPreferences {
  const normalized = normalizeColumnPreferences(current, allColumnIds)
  const first = allColumnIds[0]
  return {
    ...normalized,
    visibleColumnIds: new Set(visible ? allColumnIds : first ? [first] : []),
  }
}

export function moveColumnPreference(
  current: StandardTableColumnPreferences,
  sourceColumnId: string,
  targetColumnId: string,
  allColumnIds: readonly string[],
): StandardTableColumnPreferences {
  const normalized = normalizeColumnPreferences(current, allColumnIds)
  const order = [...normalized.orderedColumnIds]
  const sourceIndex = order.indexOf(sourceColumnId)
  const targetIndex = order.indexOf(targetColumnId)
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return normalized
  const [source] = order.splice(sourceIndex, 1)
  if (source) order.splice(targetIndex, 0, source)
  return { ...normalized, orderedColumnIds: order }
}

export function updateColumnPreferenceFixedSide(
  current: StandardTableColumnPreferences,
  columnId: string,
  side: StandardTableColumnFixedSide,
  allColumnIds: readonly string[],
): StandardTableColumnPreferences {
  const normalized = normalizeColumnPreferences(current, allColumnIds)
  if (!allColumnIds.includes(columnId)) return normalized
  const fixed = { ...normalized.fixedColumnIds }
  if (fixed[columnId] === side) {
    delete fixed[columnId]
    return { ...normalized, fixedColumnIds: fixed }
  }
  fixed[columnId] = side
  const rest = normalized.orderedColumnIds.filter((id) => id !== columnId)
  return {
    ...normalized,
    fixedColumnIds: fixed,
    orderedColumnIds: side === 'left' ? [columnId, ...rest] : [...rest, columnId],
  }
}

export function readColumnPreferences(
  storageKey: string | undefined,
  allColumnIds: readonly string[],
): StandardTableColumnPreferences {
  if (!storageKey || typeof window === 'undefined') {
    return createDefaultColumnPreferences(allColumnIds)
  }
  const fallback = { fixedColumnIds: {}, orderedColumnIds: [], visibleColumnIds: [] }
  const stored = readPersisted(
    window.localStorage,
    storageKey,
    storedColumnPreferencesSchema,
    fallback,
  )
  return normalizeColumnPreferences(stored, allColumnIds)
}

export function writeColumnPreferences(
  storageKey: string | undefined,
  preferences: StandardTableColumnPreferences,
) {
  if (!storageKey || typeof window === 'undefined') return false
  return writePersisted(window.localStorage, storageKey, {
    fixedColumnIds: preferences.fixedColumnIds,
    orderedColumnIds: preferences.orderedColumnIds,
    visibleColumnIds: [...preferences.visibleColumnIds],
  })
}

export function readDensity(
  storageKey: string,
  fallback: StandardTableDensity,
): StandardTableDensity {
  if (typeof window === 'undefined') return fallback
  return readPersisted(window.localStorage, storageKey, densitySchema, fallback)
}

export function writeDensity(storageKey: string, density: StandardTableDensity) {
  if (typeof window === 'undefined') return false
  return writePersisted(window.localStorage, storageKey, density)
}

function normalizeStringList(input: unknown): readonly string[] {
  if (input instanceof Set) {
    return [...input].filter((item): item is string => typeof item === 'string')
  }
  if (Array.isArray(input)) return input.filter((item): item is string => typeof item === 'string')
  return []
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input)
}
