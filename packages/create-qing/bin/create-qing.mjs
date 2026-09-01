#!/usr/bin/env node

import { runCli } from '../src/cli.mjs'

try {
  await runCli(process.argv.slice(2))
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  process.stderr.write(`\nError: ${message}\n`)
  process.exitCode = 1
}
