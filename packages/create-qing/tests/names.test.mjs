import { describe, expect, it, vi } from 'vitest'

import { parseArguments } from '../src/arguments.mjs'
import { runCli, VERSION } from '../src/cli.mjs'
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

  it('rejects misspelled options and honors a command-level separator', () => {
    expect(() => parseArguments(['generate', 'page', 'orders', '--titel', 'Orders'])).toThrow(
      'Unknown option: --titel',
    )
    expect(() => parseArguments(['generate', 'page', 'orders', '-x'])).toThrow('Unknown option: -x')
    expect(parseArguments(['generate', '--', '--literal'])).toEqual({
      flags: new Map(),
      positionals: ['generate', '--literal'],
    })
    expect(parseArguments(['generate', '--', '-h'])).toEqual({
      flags: new Map(),
      positionals: ['generate', '-h'],
    })
  })

  it('handles informational output and rejects incomplete commands', async () => {
    const write = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    await runCli(['--version'])
    expect(write).toHaveBeenCalledWith(`${VERSION}\n`)
    write.mockClear()
    await runCli(['--help'])
    expect(write).toHaveBeenCalledWith(expect.stringContaining('Usage:'))
    await expect(runCli(['create'])).rejects.toThrow('create requires a target directory')
    await expect(runCli(['generate', 'widget', 'orders'])).rejects.toThrow(
      'generate currently supports',
    )
    await expect(runCli(['unknown'])).rejects.toThrow('Unknown command: unknown')
    write.mockRestore()
  })
})
