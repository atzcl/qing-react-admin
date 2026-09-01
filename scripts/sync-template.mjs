import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const templateRoot = resolve(repositoryRoot, 'packages/create-qing/templates/admin')
const checkOnly = process.argv.includes('--check')

/** @type {Map<string, Buffer>} */
const expectedFiles = new Map()
/** @type {Set<string>} */
const managedRoots = new Set()

async function listFiles(root, prefix = '') {
  const entries = await readdir(resolve(root, prefix), { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      if (entry.name === '.DS_Store') return []
      const child = prefix ? `${prefix}/${entry.name}` : entry.name
      if (entry.isDirectory()) return listFiles(root, child)
      return entry.isFile() ? [child] : []
    }),
  )
  return files.flat()
}

function replaceText(content, replacements) {
  const tokens = Object.keys(replacements)
  if (!tokens.some((token) => content.includes(Buffer.from(token)))) return content
  let result = content.toString('utf8')
  for (const [token, value] of Object.entries(replacements))
    result = result.replaceAll(token, value)
  return Buffer.from(result)
}

async function addTree({ exclude = () => false, replacements = {}, source, target }) {
  const sourceRoot = resolve(repositoryRoot, source)
  const targetRoot = resolve(templateRoot, target)
  managedRoots.add(targetRoot)
  const files = (await listFiles(sourceRoot)).filter((file) => !exclude(file))
  const contents = await Promise.all(files.map((file) => readFile(resolve(sourceRoot, file))))
  files.forEach((file, index) => {
    const content = contents[index]
    if (!content) throw new Error(`Could not read canonical template file: ${file}`)
    expectedFiles.set(resolve(targetRoot, file), replaceText(content, replacements))
  })
}

async function addFile({ replacements = {}, source, target = source }) {
  const content = await readFile(resolve(repositoryRoot, source))
  expectedFiles.set(resolve(templateRoot, target), replaceText(content, replacements))
}

await Promise.all([
  addTree({
    exclude: (file) =>
      file.startsWith('.tanstack/') ||
      file.startsWith('coverage/') ||
      file.startsWith('dist/') ||
      file.startsWith('node_modules/'),
    replacements: { '"name": "@qing-react-admin/web-admin"': '"name": "__PACKAGE_NAME__"' },
    source: 'apps/web-admin',
    target: 'apps/web-admin',
  }),
  addTree({ source: '.agents/skills', target: '.agents/skills' }),
  addTree({ source: 'tests/e2e', target: 'tests/e2e' }),
  addTree({
    exclude: (file) => file === 'sync-template.mjs',
    source: 'scripts',
    target: 'scripts',
  }),
  addTree({
    source: 'packages/create-qing/src',
    target: 'tools/generator/src',
    exclude: (file) => file === 'cli.mjs' || file === 'scaffold.mjs',
  }),
  addTree({
    source: 'packages/create-qing/bin',
    target: 'tools/generator/bin',
    exclude: (file) => file !== 'qing-react-generate.mjs',
  }),
])

await Promise.all([
  ...[
    '.editorconfig',
    '.gitignore',
    '.node-version',
    '.nvmrc',
    '.oxfmtrc.json',
    'AGENTS.md',
    'LICENSE',
    'playwright.config.ts',
    'pnpm-lock.yaml',
    'pnpm-workspace.yaml',
    'tsconfig.base.json',
  ].map((source) => addFile({ source })),
  addFile({ source: '.oxlintrc.json', target: '.oxlintrc.json.template-file' }),
  addFile({
    source: 'README.md',
    replacements: {
      '# Qing React Admin': '# %%PROJECT_NAME%%',
      '**在线演示：** [https://qing-react-admin.qrunai.com](https://qing-react-admin.qrunai.com)\n\n':
        '',
    },
  }),
])

const rootPackage = JSON.parse(await readFile(resolve(repositoryRoot, 'package.json'), 'utf8'))
rootPackage.name = '__PROJECT_NAME__'
delete rootPackage.scripts['create:admin']
delete rootPackage.scripts['deploy:cloudflare']
delete rootPackage.scripts['template:check']
delete rootPackage.scripts['template:sync']
rootPackage.scripts.check = rootPackage.scripts.check.replace('pnpm template:check && ', '')
rootPackage.scripts.generate = 'node tools/generator/bin/qing-react-generate.mjs'
for (const script of ['build', 'dev', 'preview', 'test:coverage']) {
  rootPackage.scripts[script] = rootPackage.scripts[script].replace(
    '@qing-react-admin/web-admin',
    '__PACKAGE_NAME__',
  )
}
rootPackage.devDependencies.zod = 'catalog:'
expectedFiles.set(
  resolve(templateRoot, 'package.json'),
  Buffer.from(`${JSON.stringify(rootPackage, null, 2)}\n`),
)

const generatorPackage = {
  name: '@qing-react-admin/generator',
  version: '0.1.0',
  private: true,
  type: 'module',
  scripts: {
    typecheck:
      'tsc6 --allowJs --checkJs --noEmit --module NodeNext --moduleResolution NodeNext --target ES2023 --types node src/*.mjs bin/*.mjs',
  },
  dependencies: { zod: 'catalog:' },
  devDependencies: { '@types/node': 'catalog:', typescript: 'catalog:' },
}
expectedFiles.set(
  resolve(templateRoot, 'tools/generator/package.json'),
  Buffer.from(`${JSON.stringify(generatorPackage, null, 2)}\n`),
)

const managedFiles = await Promise.all(
  [...managedRoots].map(async (managedRoot) => ({
    files: await listFiles(managedRoot).catch(() => []),
    managedRoot,
  })),
)
const staleFiles = managedFiles.flatMap(({ files, managedRoot }) =>
  files
    .map((file) => resolve(managedRoot, file))
    .filter((absoluteFile) => !expectedFiles.has(absoluteFile)),
)

const changedFiles = (
  await Promise.all(
    [...expectedFiles].map(async ([file, expected]) => {
      const current = await readFile(file).catch(() => null)
      if (current?.equals(expected)) return undefined
      if (!checkOnly) {
        await mkdir(dirname(file), { recursive: true })
        await writeFile(file, expected)
      }
      return file
    }),
  )
).filter((file) => file !== undefined)

if (!checkOnly) {
  await Promise.all(staleFiles.map((file) => rm(file)))
} else if (changedFiles.length || staleFiles.length) {
  const files = [...changedFiles, ...staleFiles]
  throw new Error(
    `Scaffold template drift detected:\n${files
      .map((file) => `  - ${relative(repositoryRoot, file)}`)
      .join('\n')}\nRun pnpm template:sync.`,
  )
}

process.stdout.write(
  `${checkOnly ? 'Verified' : 'Synchronized'} ${expectedFiles.size} scaffold files${staleFiles.length ? ` and removed ${staleFiles.length} stale files` : ''}.\n`,
)
