import { enabled, option, parseArguments } from './arguments.mjs'
import { defaultPageOptions, generatePage } from './generator.mjs'
import { createProject, installSkills } from './scaffold.mjs'

export const VERSION = '0.1.0'

const help = `Qing React Admin generator ${VERSION}

Usage:
  create-qing create <target> [--name <package-name>] [--no-install] [--force]
  create-qing skills [target] [--force]
  create-qing generate page <name> [--route /path] [--title <label>]
                      [--title-tw <label>] [--title-en <label>]
                      [--group dashboard|demos|examples|system]
                      [--roles admin,super,user] [--cwd <root>] [--dry-run]

Examples:
  create-qing create my-admin
  create-qing generate page orders --route /business/orders --title 订单管理 --roles admin
`

/** @param {string[]} argv */
export async function runCli(argv) {
  const { flags, positionals } = parseArguments(argv)
  if (enabled(flags, 'version')) {
    process.stdout.write(`${VERSION}\n`)
    return
  }
  if (enabled(flags, 'help') || positionals.length === 0) {
    process.stdout.write(help)
    return
  }

  const command = positionals[0]
  if (command === 'create') {
    const target = positionals[1]
    if (!target) throw new Error('create requires a target directory')
    await createProject({
      force: enabled(flags, 'force'),
      install: !enabled(flags, 'no-install'),
      name: option(flags, 'name'),
      target,
    })
    return
  }

  if (command === 'skills') {
    await installSkills({ force: enabled(flags, 'force'), target: positionals[1] ?? process.cwd() })
    return
  }

  if (command === 'generate') {
    const kind = positionals[1]
    const name = positionals[2]
    if (kind !== 'page' || !name)
      throw new Error('generate currently supports: generate page <name>')
    await generatePage(
      defaultPageOptions(name, {
        cwd: option(flags, 'cwd'),
        dryRun: enabled(flags, 'dry-run'),
        group: option(flags, 'group'),
        roles: option(flags, 'roles'),
        route: option(flags, 'route'),
        title: option(flags, 'title'),
        titleEn: option(flags, 'title-en'),
        titleTw: option(flags, 'title-tw'),
      }),
    )
    return
  }

  throw new Error(`Unknown command: ${command}\n\n${help}`)
}
