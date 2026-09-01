const booleanFlags = new Set(['dry-run', 'force', 'help', 'no-install', 'version'])

/** @param {string[]} argv */
export function parseArguments(argv) {
  /** @type {Map<string, boolean | string>} */
  const flags = new Map()
  /** @type {string[]} */
  const positionals = []

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (!argument) continue
    if (argument === '--') continue
    if (argument === '-h') {
      flags.set('help', true)
      continue
    }
    if (!argument.startsWith('--')) {
      positionals.push(argument)
      continue
    }

    const [rawName, inlineValue] = argument.slice(2).split('=', 2)
    if (!rawName) throw new Error(`Invalid option: ${argument}`)
    if (booleanFlags.has(rawName)) {
      if (inlineValue !== undefined) throw new Error(`--${rawName} does not accept a value`)
      flags.set(rawName, true)
      continue
    }

    const value = inlineValue ?? argv[index + 1]
    if (!value || value.startsWith('--')) throw new Error(`--${rawName} requires a value`)
    flags.set(rawName, value)
    if (inlineValue === undefined) index += 1
  }

  return { flags, positionals }
}

/**
 * @param {Map<string, boolean | string>} flags
 * @param {string} name
 */
export function option(flags, name) {
  const value = flags.get(name)
  return typeof value === 'string' ? value : undefined
}

/**
 * @param {Map<string, boolean | string>} flags
 * @param {string} name
 */
export function enabled(flags, name) {
  return flags.get(name) === true
}
