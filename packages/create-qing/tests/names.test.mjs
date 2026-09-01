import { describe, expect, it } from 'vitest'

import { parseArguments } from '../src/arguments.mjs'
import { camelCase, kebabCase, parsePackageName, parseRoute, pascalCase } from '../src/names.mjs'

describe('CLI names and arguments', () => {
  it('normalizes page names deterministically', () => {
    expect(kebabCase('Order Audit')).toBe('order-audit')
    expect(camelCase('order-audit')).toBe('orderAudit')
    expect(pascalCase('order-audit')).toBe('OrderAudit')
  })

  it('validates npm names and routes', () => {
    expect(parsePackageName('@acme/admin')).toBe('@acme/admin')
    expect(parseRoute('/business/order-audit')).toBe('/business/order-audit')
    expect(() => parseRoute('Business Orders')).toThrow(/absolute lowercase path/u)
  })

  it('parses positional, boolean, and value options', () => {
    const parsed = parseArguments([
      'generate',
      '--',
      'page',
      'orders',
      '--dry-run',
      '--group=system',
    ])
    expect(parsed.positionals).toEqual(['generate', 'page', 'orders'])
    expect(parsed.flags.get('dry-run')).toBe(true)
    expect(parsed.flags.get('group')).toBe('system')
  })
})
