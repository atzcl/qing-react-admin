import { z } from 'zod'

import { readPersisted, removePersisted, writePersisted } from './persisted-storage'
import type { AppUser } from './types'

const loginSchema = z.object({
  password: z.string().min(6).max(72),
  remember: z.boolean(),
  username: z.string().min(3).max(32),
})

const loginCodeSchema = z.object({ phone: z.string().min(6).max(24) })
const storedSessionSchema = z.object({ username: z.enum(['admin', 'super', 'user']) })
const optionalStoredSessionSchema = storedSessionSchema.nullable()

const persistentSessionKey = 'qing-admin:auth:persistent'
const transientSessionKey = 'qing-admin:auth:transient'

const demoUsers: Record<'admin' | 'super' | 'user', AppUser & { password: string }> = {
  admin: {
    avatar: '/favicon.svg',
    email: 'admin@example.com',
    homePath: '/dashboard/workspace',
    id: 'usr_admin',
    password: '123456',
    realName: 'Administrator',
    roles: ['admin'],
    username: 'admin',
  },
  super: {
    avatar: '/favicon.svg',
    email: 'super@example.com',
    homePath: '/dashboard/workspace',
    id: 'usr_super',
    password: '123456',
    realName: 'Super Admin',
    roles: ['super'],
    username: 'super',
  },
  user: {
    avatar: '/favicon.svg',
    email: 'user@example.com',
    homePath: '/dashboard/analytics',
    id: 'usr_user',
    password: '123456',
    realName: 'Demo User',
    roles: ['user'],
    username: 'user',
  },
}

function isDemoUsername(username: string): username is keyof typeof demoUsers {
  return username in demoUsers
}

function publicUser(user: AppUser & { password: string }): AppUser {
  const { password, ...result } = user
  void password
  return result
}

function readUsername(storage: Storage, key: string) {
  return readPersisted(storage, key, optionalStoredSessionSchema, null)?.username ?? null
}

function clearSessionStorage() {
  if (typeof window === 'undefined') return
  removePersisted(window.localStorage, persistentSessionKey)
  removePersisted(window.sessionStorage, transientSessionKey)
}

export function getCurrentUser(): AppUser | null {
  if (typeof window === 'undefined') return null

  const username =
    readUsername(window.sessionStorage, transientSessionKey) ??
    readUsername(window.localStorage, persistentSessionKey)
  return username ? publicUser(demoUsers[username]) : null
}

export function login(input: unknown) {
  const data = loginSchema.parse(input)
  const user = isDemoUsername(data.username) ? demoUsers[data.username] : undefined
  if (!user || user.password !== data.password) {
    return { message: '账号或密码错误', success: false } as const
  }

  clearSessionStorage()
  const storage = data.remember ? window.localStorage : window.sessionStorage
  const key = data.remember ? persistentSessionKey : transientSessionKey
  writePersisted(storage, key, { username: user.username })
  return { success: true, user: publicUser(user) } as const
}

export function logout() {
  clearSessionStorage()
  return { success: true } as const
}

export function sendLoginCode(input: unknown) {
  const data = loginCodeSchema.parse(input)
  return { maskedPhone: data.phone.replace(/.(?=.{4})/g, '*'), success: true } as const
}
