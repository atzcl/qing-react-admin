import type { ZodType } from 'zod'

export function readPersisted<T>(
  storage: Storage,
  key: string,
  schema: ZodType<T>,
  fallback: T,
): T {
  try {
    const serialized = storage.getItem(key)
    if (!serialized) return fallback
    const result = schema.safeParse(JSON.parse(serialized))
    if (result.success) return result.data
  } catch {
    // Invalid JSON and unavailable storage share the same safe fallback.
  }

  try {
    storage.removeItem(key)
  } catch {
    // Storage may be unavailable (for example, a restricted browser context).
  }
  return fallback
}

export function writePersisted(storage: Storage, key: string, value: unknown) {
  try {
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removePersisted(storage: Storage, key: string) {
  try {
    storage.removeItem(key)
    return true
  } catch {
    return false
  }
}
