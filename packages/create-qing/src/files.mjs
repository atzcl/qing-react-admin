import { chmod, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'

const binaryExtensions = new Set([
  '.avif',
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.png',
  '.webp',
  '.woff',
  '.woff2',
])

/** @param {string} file */
function isBinaryFile(file) {
  const extensionIndex = file.lastIndexOf('.')
  return extensionIndex >= 0 && binaryExtensions.has(file.slice(extensionIndex).toLowerCase())
}

/** @param {string} file */
function destinationFile(file) {
  return file.endsWith('.template-file') ? file.slice(0, -'.template-file'.length) : file
}

/** @param {string} path */
async function pathExists(path) {
  try {
    await stat(path)
    return true
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT')
      return false
    throw error
  }
}

/**
 * @param {string} root
 * @param {string} [prefix]
 * @returns {Promise<string[]>}
 */
export async function listFiles(root, prefix = '') {
  const directory = resolve(root, prefix)
  const entries = await readdir(directory, { withFileTypes: true })
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      if (entry.name === '.DS_Store') return []
      const child = prefix ? `${prefix}/${entry.name}` : entry.name
      if (entry.isDirectory()) return listFiles(root, child)
      return entry.isFile() ? [child] : []
    }),
  )
  return nestedFiles.flat()
}

/**
 * @param {string} target
 * @param {boolean} force
 */
export async function ensureEmptyOrForced(target, force) {
  if (!(await pathExists(target))) return
  const entries = await readdir(target)
  if (entries.length && !force) {
    throw new Error(
      `Target directory is not empty: ${target}. Pass --force to overwrite collisions.`,
    )
  }
}

/**
 * @param {{ files: string[], force: boolean, replacements?: Record<string, string>, sourceRoot: string, targetRoot: string }} input
 */
export async function copyFiles({ files, force, replacements = {}, sourceRoot, targetRoot }) {
  const collisionCandidates = await Promise.all(
    files.map(async (file) => {
      const target = resolve(targetRoot, destinationFile(file))
      return !force && (await pathExists(target)) ? relative(process.cwd(), target) : undefined
    }),
  )
  const collisions = collisionCandidates.filter((file) => file !== undefined)
  if (collisions.length) {
    throw new Error(
      `Refusing to overwrite existing files:\n${collisions.map((file) => `  - ${file}`).join('\n')}`,
    )
  }

  await Promise.all(
    files.map(async (file) => {
      const source = resolve(sourceRoot, file)
      const target = resolve(targetRoot, destinationFile(file))
      const [sourceStat, sourceContent] = await Promise.all([stat(source), readFile(source)])
      /** @type {Uint8Array | string} */
      let content = sourceContent
      if (!isBinaryFile(file)) {
        let textContent = sourceContent.toString('utf8')
        for (const [token, value] of Object.entries(replacements)) {
          textContent = textContent.replaceAll(token, value)
        }
        content = textContent
      }
      await mkdir(dirname(target), { recursive: true })
      await writeFile(target, content)
      await chmod(target, sourceStat.mode)
    }),
  )
}

/** @param {string} path */
export async function fileExists(path) {
  return pathExists(path)
}
