import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { generatePage } from '../src/generator.mjs'
import { createProject } from '../src/scaffold.mjs'

const temporaryRoots = []

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { force: true, recursive: true })),
  )
})

async function temporaryTarget() {
  const root = await mkdtemp(join(tmpdir(), 'qing-react-cli-'))
  temporaryRoots.push(root)
  return resolve(root, 'generated-admin')
}

describe('project scaffold', () => {
  it('creates a token-free project with Agent Skills', async () => {
    const target = await temporaryTarget()
    await createProject({ force: false, install: false, name: 'acme-admin', target })

    const rootPackage = await readFile(resolve(target, 'package.json'), 'utf8')
    const appPackage = await readFile(resolve(target, 'apps/web-admin/package.json'), 'utf8')
    const lockfile = await readFile(resolve(target, 'pnpm-lock.yaml'), 'utf8')
    const readme = await readFile(resolve(target, 'README.md'), 'utf8')
    const viteConfig = await readFile(resolve(target, 'apps/web-admin/vite.config.ts'), 'utf8')
    const virtualTable = await readFile(
      resolve(target, 'apps/web-admin/react-compiler-excluded/virtual-table-example.tsx'),
      'utf8',
    )
    const skill = await readFile(
      resolve(target, '.agents/skills/qing-react-admin/SKILL.md'),
      'utf8',
    )
    const registryTest = await readFile(
      resolve(target, 'apps/web-admin/src/core/page-registry.test.ts'),
      'utf8',
    )
    const playwrightConfig = await readFile(resolve(target, 'playwright.config.ts'), 'utf8')
    const adminConsoleTest = await readFile(
      resolve(target, 'tests/e2e/admin-console.spec.ts'),
      'utf8',
    )
    const explicitDynamicRoute = await readFile(
      resolve(target, 'apps/web-admin/src/routes/_app.demos.features.detail.$id.tsx'),
      'utf8',
    )
    const catalog = await readFile(
      resolve(target, 'apps/web-admin/src/core/showcase-catalog.tsx'),
      'utf8',
    )
    const genericFallback = await readFile(
      resolve(target, 'apps/web-admin/src/pages/showcase-pages.tsx'),
      'utf8',
    ).catch(() => null)
    const coverageArtifact = await readFile(
      resolve(target, 'apps/web-admin/coverage/index.html'),
      'utf8',
    ).catch(() => null)
    const logo = await readFile(resolve(target, 'apps/web-admin/public/favicon.svg'), 'utf8')
    const avatar = await readFile(resolve(target, 'apps/web-admin/public/avatar-super.svg'), 'utf8')
    expect(rootPackage).toContain('"name": "acme-admin"')
    expect(rootPackage).toContain('"zod": "catalog:"')
    expect(rootPackage).toContain('"test:e2e": "playwright test"')
    expect(rootPackage).toContain(
      '"test:coverage": "pnpm --filter @acme-admin/web-admin test:coverage"',
    )
    expect(appPackage).toContain('"name": "@acme-admin/web-admin"')
    expect(appPackage).not.toContain('@tippyjs/react')
    expect(appPackage).not.toContain('echarts-for-react')
    expect(appPackage).not.toContain('"echarts"')
    expect(lockfile).not.toContain('echarts@')
    expect(appPackage).not.toContain('react-countup')
    expect(rootPackage).not.toContain('__PROJECT_NAME__')
    expect(readme).toContain('# acme-admin')
    expect(readme).not.toContain('%%PROJECT_NAME%%')
    expect(readme).not.toContain('__PROJECT_NAME__')
    expect(viteConfig).toContain("sources: ['/apps/web-admin/src/']")
    expect(virtualTable).toContain('@tanstack/react-virtual')
    expect(skill).toContain('name: qing-react-admin')
    expect(skill).toContain('89 standalone feature pages')
    expect(registryTest).toContain('demoPages: 41, examplePages: 41, totalPages: 82')
    expect(playwrightConfig).toContain("testDir: './tests/e2e'")
    expect(adminConsoleTest).toContain("test.describe('standalone 89-page application scope'")
    expect(explicitDynamicRoute).toContain(
      "staticData: { adminPagePath: '/demos/features/detail/:id' }",
    )
    expect(catalog).toContain('throw new Error(`Missing showcase demo page: ${path}`)')
    expect(genericFallback).toBeNull()
    expect(coverageArtifact).toBeNull()
    expect(logo).toContain('<svg')
    expect(avatar).toContain('<svg')
  })

  it('generates one self-registering feature slice and its protected route', async () => {
    const target = await temporaryTarget()
    await createProject({ force: false, install: false, name: 'generator-fixture', target })
    const registryPath = resolve(target, 'apps/web-admin/src/core/page-registry.tsx')
    const i18nPath = resolve(target, 'apps/web-admin/src/core/i18n.ts')
    const [registryBefore, i18nBefore] = await Promise.all([
      readFile(registryPath, 'utf8'),
      readFile(i18nPath, 'utf8'),
    ])
    const result = await generatePage({
      cwd: target,
      dryRun: false,
      group: 'system',
      name: 'order-audit',
      roles: 'admin',
      route: '/business/order-audit',
      title: '订单审计',
      titleEn: 'Order audit',
      titleTw: '訂單稽核',
    })

    expect(result.changedFiles).toHaveLength(3)
    const feature = await readFile(
      resolve(target, 'apps/web-admin/src/features/business/order-audit/feature.ts'),
      'utf8',
    )
    const page = await readFile(
      resolve(target, 'apps/web-admin/src/features/business/order-audit/page.tsx'),
      'utf8',
    )
    const route = await readFile(
      resolve(target, 'apps/web-admin/src/routes/_app.business.order-audit.tsx'),
      'utf8',
    )
    const [registryAfter, i18nAfter] = await Promise.all([
      readFile(registryPath, 'utf8'),
      readFile(i18nPath, 'utf8'),
    ])
    expect(feature).toContain('defineAdminFeature({')
    expect(feature).toContain('group: "system"')
    expect(feature).toContain('path: "/business/order-audit"')
    expect(feature).toContain('roles: ["admin"]')
    expect(feature).toContain('\'zh-CN\': "订单审计"')
    expect(feature).toContain('\'zh-TW\': "訂單稽核"')
    expect(page).toContain('<PageContainer>')
    expect(route).toContain('beforeLoadAdminPage("/business/order-audit", context.user)')
    expect(route).toContain('staticData: { adminPagePath: "/business/order-audit" }')
    expect(registryAfter).toBe(registryBefore)
    expect(i18nAfter).toBe(i18nBefore)
  })

  it('supports the examples group and super role', async () => {
    const target = await temporaryTarget()
    await createProject({ force: false, install: false, name: 'examples-fixture', target })
    await generatePage({
      cwd: target,
      dryRun: false,
      group: 'examples',
      name: 'schema-lab',
      roles: 'super',
      route: '/examples/schema-lab',
      title: 'Schema 实验室',
      titleEn: 'Schema lab',
    })

    const feature = await readFile(
      resolve(target, 'apps/web-admin/src/features/examples/schema-lab/feature.ts'),
      'utf8',
    )
    const route = await readFile(
      resolve(target, 'apps/web-admin/src/routes/_app.examples.schema-lab.tsx'),
      'utf8',
    )
    expect(feature).toContain('group: "examples"')
    expect(feature).toContain('roles: ["super"]')
    expect(route).toContain('beforeLoadAdminPage("/examples/schema-lab", context.user)')
  })
})
