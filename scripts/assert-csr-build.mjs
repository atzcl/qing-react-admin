import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const outputDirectory = resolve(process.argv[2] ?? 'apps/web-admin/dist')
const indexPath = resolve(outputDirectory, 'index.html')

if (!existsSync(indexPath)) {
  throw new Error(`CSR build is missing ${indexPath}`)
}

for (const forbiddenPath of ['server', '_shell.html']) {
  const absolutePath = resolve(outputDirectory, forbiddenPath)
  if (existsSync(absolutePath)) {
    throw new Error(`CSR build contains forbidden SSR output: ${absolutePath}`)
  }
}

const indexHtml = readFileSync(indexPath, 'utf8')
if (!indexHtml.includes('id="root"') || !indexHtml.includes('type="module"')) {
  throw new Error('CSR index.html must contain the React mount point and a module entry script.')
}

console.log(`Verified pure CSR output at ${outputDirectory}`)
