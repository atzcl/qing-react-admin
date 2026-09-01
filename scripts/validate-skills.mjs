import { readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const skillsRoot = resolve('.agents/skills')
const expectedSkills = ['qing-react-admin', 'qing-react-generator', 'qing-react-quality']

function fail(message) {
  process.stderr.write(`Skill validation failed: ${message}\n`)
  process.exitCode = 1
}

await Promise.all(
  expectedSkills.map(async (skillName) => {
    const skillRoot = resolve(skillsRoot, skillName)
    const [skillSource, agentSource] = await Promise.all([
      readFile(resolve(skillRoot, 'SKILL.md'), 'utf8'),
      readFile(resolve(skillRoot, 'agents/openai.yaml'), 'utf8'),
    ])
    const frontmatter = skillSource.match(/^---\n([\s\S]*?)\n---/u)?.[1]

    if (!frontmatter) fail(`${skillName}/SKILL.md has no frontmatter`)
    if (!frontmatter?.includes(`name: ${skillName}`)) fail(`${skillName} has the wrong name`)
    if (!frontmatter?.includes('description:')) fail(`${skillName} has no description`)
    if (skillSource.includes('[TODO:')) fail(`${skillName} still contains a TODO placeholder`)
    if (!agentSource.includes(`$${skillName}`))
      fail(`${skillName} default_prompt must name the skill`)
    if (!agentSource.includes('short_description:')) fail(`${skillName} has no UI description`)
  }),
)

const installed = (await readdir(skillsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

if (installed.length !== expectedSkills.length) {
  fail(`expected ${expectedSkills.length} skills, found ${installed.length}`)
}

if (!process.exitCode) process.stdout.write(`Validated ${expectedSkills.length} Agent Skills.\n`)
