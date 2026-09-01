import { z } from 'zod'

const packageNameSchema = z
  .string()
  .min(1)
  .max(214)
  .regex(
    /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/u,
    'must be a lowercase npm package name',
  )

const routeSchema = z
  .string()
  .regex(/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*)(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/u, {
    message: 'must be an absolute lowercase path such as /orders/list',
  })

/** @param {string} value */
export function kebabCase(value) {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/gu, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '')
    .toLowerCase()
}

/** @param {string} value */
export function camelCase(value) {
  return kebabCase(value).replace(/-([a-z0-9])/gu, (_match, character) => character.toUpperCase())
}

/** @param {string} value */
export function pascalCase(value) {
  const camel = camelCase(value)
  return camel ? camel[0].toUpperCase() + camel.slice(1) : ''
}

/** @param {string} value */
export function humanize(value) {
  return kebabCase(value)
    .split('-')
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ')
}

/** @param {string} value */
export function parsePackageName(value) {
  return packageNameSchema.parse(value)
}

/** @param {string} value */
export function parseRoute(value) {
  return routeSchema.parse(value)
}
