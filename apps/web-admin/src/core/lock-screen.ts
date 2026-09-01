import { z } from 'zod'

import { readPersisted, removePersisted, writePersisted } from './persisted-storage'

const lockScreenStorageKey = 'qing-admin:lock-screen:v1'
const lockScreenStateSchema = z.object({
  password: z.string().min(1).max(72),
  username: z.string().min(1),
})

export type LockScreenState = z.infer<typeof lockScreenStateSchema>

export function readLockScreenState(username: string): LockScreenState | null {
  if (typeof window === 'undefined') return null

  const state = readPersisted(
    window.sessionStorage,
    lockScreenStorageKey,
    lockScreenStateSchema,
    null,
  )
  if (!state || state.username === username) return state

  removePersisted(window.sessionStorage, lockScreenStorageKey)
  return null
}

export function persistLockScreenState(username: string, password: string) {
  if (typeof window === 'undefined') return false
  return writePersisted(window.sessionStorage, lockScreenStorageKey, { password, username })
}

export function clearLockScreenState() {
  if (typeof window === 'undefined') return false
  return removePersisted(window.sessionStorage, lockScreenStorageKey)
}
