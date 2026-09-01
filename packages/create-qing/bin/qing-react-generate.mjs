#!/usr/bin/env node

import { enabled, option, parseArguments } from '../src/arguments.mjs'
import { defaultPageOptions, generatePage } from '../src/generator.mjs'

const help = `Usage:
  pnpm generate -- page <name> [--route /path] [--title <label>]
                  [--title-tw <label>] [--title-en <label>]
                  [--group dashboard|demos|examples|system]
                  [--roles admin,super,user] [--dry-run]
`

try {
  const { flags, positionals } = parseArguments(process.argv.slice(2))
  if (enabled(flags, 'help') || positionals.length === 0) {
    process.stdout.write(help)
  } else {
    const [kind, name] = positionals
    if (kind !== 'page' || !name) throw new Error('Expected: page <name>')
    await generatePage(
      defaultPageOptions(name, {
        cwd: process.cwd(),
        dryRun: enabled(flags, 'dry-run'),
        group: option(flags, 'group'),
        roles: option(flags, 'roles'),
        route: option(flags, 'route'),
        title: option(flags, 'title'),
        titleEn: option(flags, 'title-en'),
        titleTw: option(flags, 'title-tw'),
      }),
    )
  }
} catch (error) {
  process.stderr.write(`Error: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
}
