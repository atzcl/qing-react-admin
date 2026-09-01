import { spawn } from 'node:child_process'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { copyFiles, ensureEmptyOrForced, listFiles } from './files.mjs'
import { kebabCase, parsePackageName } from './names.mjs'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const templateRoot = resolve(packageRoot, 'templates/admin')

/**
 * @param {string} command
 * @param {string[]} arguments_
 * @param {string} cwd
 * @returns {Promise<void>}
 */
function run(command, arguments_, cwd) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, arguments_, { cwd, stdio: 'inherit' })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolvePromise()
      else reject(new Error(`${command} ${arguments_.join(' ')} exited with code ${code}`))
    })
  })
}

/** @param {{ force: boolean, install: boolean, name?: string, target: string }} input */
export async function createProject({ force, install, name, target }) {
  const targetRoot = resolve(target)
  const projectName = parsePackageName(
    name ?? kebabCase(basename(targetRoot)) ?? 'qing-react-admin',
  )
  const workspacePackageName = projectName.includes('/') ? projectName : `@${projectName}/web-admin`
  await ensureEmptyOrForced(targetRoot, force)

  const files = await listFiles(templateRoot)
  await copyFiles({
    files,
    force,
    replacements: {
      '%%PROJECT_NAME%%': projectName.replace('@', '').replace('/', '-'),
      __PACKAGE_NAME__: workspacePackageName,
      __PROJECT_NAME__: projectName.replace('@', '').replace('/', '-'),
    },
    sourceRoot: templateRoot,
    targetRoot,
  })

  process.stdout.write(`\nCreated ${projectName} in ${targetRoot}\n`)
  if (install) await run('pnpm', ['install'], targetRoot)
  process.stdout.write(
    `\nNext steps:\n  cd ${target}\n${install ? '' : '  pnpm install\n'}  pnpm dev\n`,
  )
  return { projectName, targetRoot }
}

/** @param {{ force: boolean, target: string }} input */
export async function installSkills({ force, target }) {
  const targetRoot = resolve(target)
  const files = (await listFiles(templateRoot)).filter(
    (file) => file === 'AGENTS.md' || file.startsWith('.agents/skills/'),
  )
  await copyFiles({ files, force, sourceRoot: templateRoot, targetRoot })
  process.stdout.write(`Installed ${files.length} Agent Skill files in ${targetRoot}\n`)
  return { files, targetRoot }
}
