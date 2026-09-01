import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

import { readFeaturePaths, readShowcasePaths } from '../../scripts/admin-route-contract.mjs'

interface PageManifestEntry {
  group: 'dashboard' | 'demos' | 'examples' | 'profile' | 'system'
  path: string
}

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const [featureEntries, showcaseEntries] = await Promise.all([
  readFeaturePaths(resolve(repositoryRoot, 'apps/web-admin/src/features')),
  readShowcasePaths(resolve(repositoryRoot, 'apps/web-admin/src/core/showcase-catalog.tsx')),
])

function manifestGroup(group: string): PageManifestEntry['group'] {
  if (group === 'utility') return 'profile'
  if (group === 'dashboard' || group === 'demos' || group === 'examples' || group === 'system') {
    return group
  }
  throw new Error(`Unknown standalone feature group: ${group}`)
}

const pageManifest: PageManifestEntry[] = [
  ...featureEntries.map((entry) => ({
    group: manifestGroup(entry.group),
    path: entry.path,
  })),
  ...showcaseEntries.map((entry) => ({ group: manifestGroup(entry.group), path: entry.path })),
]
const pageCountByGroup = Object.fromEntries(
  ['dashboard', 'demos', 'examples', 'profile', 'system'].map((group) => [
    group,
    pageManifest.filter((entry) => entry.group === group).length,
  ]),
)

async function completeSliderCaptcha(page: Page) {
  const slider = page.getByLabel('滑动验证')
  await slider.fill('100')
  await slider.dispatchEvent('mouseup')
  await expect(page.getByText('验证成功')).toBeVisible()
  await expect(page.locator('.slider-captcha')).toHaveClass(/is-success/)
  await expect(page.locator('.slider-captcha')).toHaveCSS('border-color', 'rgba(0, 0, 0, 0)')
  await expect(page.locator('.slider-captcha > span:not(.slider-captcha__action)')).toHaveCSS(
    'color',
    'rgb(255, 255, 255)',
  )
}

async function loginAsSuper(page: Page) {
  await page.goto('/auth/login')
  await completeSliderCaptcha(page)
  await page.getByRole('button', { name: /^登\s*录$/ }).click()
  await expect(page).toHaveURL(/\/dashboard\/workspace$/)
}

test('fresh login page matches the application information architecture', async ({ page }) => {
  const iconifyRequests: string[] = []
  page.on('request', (request) => {
    if (request.url().startsWith('https://api.iconify.design/')) {
      iconifyRequests.push(request.url())
    }
  })
  await page.goto('/auth/login')

  await expect(page.getByRole('heading', { name: '欢迎回来 👋🏻' })).toBeVisible()
  await expect(page.getByText('清晰掌握每一步进展。')).toBeVisible()
  await expect(page.getByText('专注当下，自然高效。')).toBeVisible()
  await expect(page.getByRole('combobox')).toBeVisible()
  await expect(page.getByText('Super', { exact: true })).toBeVisible()
  await expect(page.getByLabel('滑动验证')).toBeVisible()
  await expect(page.getByRole('button', { name: '手机号登录' })).toBeVisible()
  await expect(page.getByRole('button', { name: '扫码登录' })).toBeVisible()
  await expect(page.locator('.social-login button')).toHaveCount(4)
  await expect(page.locator('.auth-toolbar svg')).toHaveCount(4)
  expect(iconifyRequests).toEqual([])
  await expect(page).toHaveScreenshot('auth-login-1440x900.png', {
    animations: 'disabled',
    fullPage: true,
  })

  const glassScene = page.locator('.auth-glass-scene')
  const restingTransform = await glassScene.evaluate(
    (element) => getComputedStyle(element).transform,
  )
  await glassScene.hover()
  await page.waitForTimeout(80)
  const transitioningTransform = await glassScene.evaluate(
    (element) => getComputedStyle(element).transform,
  )
  await page.waitForTimeout(500)
  const hoveredTransform = await glassScene.evaluate(
    (element) => getComputedStyle(element).transform,
  )
  expect(transitioningTransform).not.toBe(restingTransform)
  expect(transitioningTransform).not.toBe(hoveredTransform)
})

test('shell geometry stays compact while diagnostics remain opt-in', async ({ page }) => {
  await loginAsSuper(page)
  await page.waitForTimeout(800)

  const queryDevtools = page.getByRole('button', { name: 'Open Tanstack query devtools' })
  const routerDevtools = page.getByRole('button', { name: 'Open TanStack Router Devtools' })
  const sidebarCollapse = page.getByRole('button', { name: '收起侧边栏' })
  await expect(queryDevtools).toHaveCount(0)
  await expect(routerDevtools).toHaveCount(0)
  await expect(sidebarCollapse).toBeVisible()
  await expect(page.locator('.project-grid svg')).toHaveCount(6)
  await expect(page.locator('.quick-nav-grid svg')).toHaveCount(6)

  const geometry = await page.evaluate(() => {
    const bounds = (selector: string) => document.querySelector(selector)?.getBoundingClientRect()
    const header = bounds('.admin-header')
    const sider = bounds('.admin-sider')
    const tabbar = bounds('.tabbar')
    return {
      header: header ? { height: header.height } : null,
      sider: sider ? { width: sider.width } : null,
      tabbar: tabbar ? { height: tabbar.height } : null,
    }
  })

  expect(geometry.header?.height).toBe(50)
  expect(geometry.sider?.width).toBe(216)
  expect(geometry.tabbar?.height).toBe(40)

  await expect(page).toHaveScreenshot('workspace-shell-1440x900.png', {
    animations: 'disabled',
    fullPage: true,
  })

  await page.goto('/dashboard/workspace?debug=1')
  await expect(queryDevtools).toBeVisible()
  await expect(routerDevtools).toBeVisible()
})

test('header tools stay available and the lock screen survives a refresh', async ({ page }) => {
  await loginAsSuper(page)

  await Promise.all(
    ['搜索', '切换语言', '设置时区', '切换全屏'].map((name) =>
      expect(page.getByRole('button', { name })).toBeVisible(),
    ),
  )
  await expect(page.getByRole('button', { name: '刷新当前页面' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: '刷新当前标签页' })).toBeVisible()
  await expect(page.getByRole('button', { name: '全屏当前页面' })).toBeVisible()

  await page.getByRole('button', { name: '通知' }).click()
  await expect(page.getByText('消息通知', { exact: true })).toBeVisible()
  await expect(page.locator('.notification-popup > ul > li')).toHaveCount(6)
  await expect(page.locator('.notification-popup > ul > li').first()).toHaveCSS(
    'min-height',
    '64px',
  )
  await expect(page.locator('.ant-popover-container')).toHaveCSS('padding', '0px')
  const notificationMetaGeometry = await page
    .locator('.notification-popup__meta')
    .first()
    .evaluate((element) => {
      const action = element.querySelector('button')?.getBoundingClientRect()
      const time = element.querySelector('time')?.getBoundingClientRect()
      return { actionTop: action?.top, timeBottom: time?.bottom }
    })
  expect(notificationMetaGeometry.timeBottom).toBeLessThanOrEqual(
    notificationMetaGeometry.actionTop ?? 0,
  )
  await page.getByRole('button', { name: '通知' }).click()

  await page.getByRole('button', { name: '用户菜单' }).click()
  await page.getByRole('menuitem', { name: '锁屏' }).click()
  await page.getByPlaceholder('请输入锁屏密码').fill('123456')
  await page.getByRole('button', { name: '锁定屏幕' }).click()

  const lockScreen = page.locator('.lock-screen')
  await expect(lockScreen).toBeVisible()
  await expect(page.locator('.admin-content')).toBeVisible()
  await expect(lockScreen).toHaveCSS('background-color', 'rgba(15, 23, 42, 0.72)')
  await expect(page.locator('.lock-screen__form')).toHaveCount(0)
  const lockGeometry = await lockScreen.evaluate((element) => {
    const bounds = element.getBoundingClientRect()
    return {
      height: bounds.height,
      parent: element.parentElement?.tagName,
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
      width: bounds.width,
      zIndex: getComputedStyle(element).zIndex,
    }
  })
  expect(lockGeometry).toMatchObject({
    parent: 'BODY',
    zIndex: '2147483647',
  })
  expect(lockGeometry.width).toBe(lockGeometry.viewportWidth)
  expect(lockGeometry.height).toBe(lockGeometry.viewportHeight)

  await page.reload()
  await expect(lockScreen).toBeVisible()

  await page.getByRole('button', { name: '解锁' }).click()
  await page.getByPlaceholder('请输入锁屏密码').fill('123456')
  await page.getByRole('button', { name: '进入系统' }).click()
  await expect(lockScreen).toBeHidden()

  await page.getByRole('button', { name: '搜索' }).click()
  const searchModal = page.locator('.global-search-modal')
  await expect(searchModal).toBeVisible()
  await expect(searchModal.locator('.ant-modal-title')).toHaveCount(0)
  await expect(searchModal.locator('.ant-modal-close')).toHaveCount(0)
  await expect(searchModal.locator('.global-search-input')).toHaveCSS('border', /0px/)
  await expect(searchModal.locator('.ant-modal-container')).toHaveCSS('border', /0px/)
})

test('system user tree and profile keep the intended desktop proportions', async ({ page }) => {
  await loginAsSuper(page)

  await page.goto('/system/user')
  const departmentTree = page.locator('.system-department-filter .ant-tree')
  await expect(departmentTree).toBeVisible()
  await expect
    .poll(() =>
      departmentTree.evaluate((tree) => ({
        indent: getComputedStyle(tree).getPropertyValue('--ant-tree-indent-size').trim(),
        unitWidth: tree.querySelector('.ant-tree-indent-unit')
          ? getComputedStyle(tree.querySelector('.ant-tree-indent-unit')!).width
          : null,
      })),
    )
    .toEqual({ indent: '16px', unitWidth: '16px' })

  await page.goto('/profile')
  const profilePage = page.locator('.profile-page')
  await expect(profilePage).toBeVisible()
  await expect(profilePage).toHaveCSS('display', 'grid')
  await expect(profilePage).toHaveCSS('grid-template-columns', /240px/)
  await expect(profilePage.locator('.profile-sidebar')).toHaveCSS('width', '240px')
})

test('sidebar collapse button keeps a polished fixed collapsed rail', async ({ page }) => {
  await loginAsSuper(page)

  await page.getByRole('button', { name: '打开偏好设置' }).click()
  const preferenceDrawer = page.locator('.preference-drawer')
  await expect(preferenceDrawer).toBeVisible()
  await preferenceDrawer.getByText('布局', { exact: true }).click()
  await expect(preferenceDrawer.getByText('悬停展开')).toHaveCount(0)
  await preferenceDrawer.locator('.ant-drawer-close').click()
  await expect(preferenceDrawer).not.toBeVisible()

  const sider = page.locator('.admin-sider')
  const collapseButton = page.getByRole('button', { name: '收起侧边栏' })
  await expect(sider).toHaveCSS('width', '216px')

  await collapseButton.click()
  const expandButton = page.getByRole('button', { name: '展开侧边栏' })
  await expect(expandButton).toBeVisible()
  await expect(sider).toHaveClass(/ant-layout-sider-collapsed/)
  await expect(sider).toHaveCSS('width', '60px')
  await expect(expandButton).toHaveCSS('width', '44px')

  await page.mouse.move(20, 200)
  await expect(sider).toHaveClass(/ant-layout-sider-collapsed/)
  await expect(sider).toHaveCSS('width', '60px')

  const collapsedItem = sider.locator('.ant-menu-submenu-title').first()
  await expect
    .poll(async () =>
      collapsedItem.evaluate((item) => {
        const itemBounds = item.getBoundingClientRect()
        const iconBounds = item.querySelector('.ant-menu-item-icon')?.getBoundingClientRect()
        return {
          centerDelta: iconBounds
            ? Math.abs(
                iconBounds.left + iconBounds.width / 2 - (itemBounds.left + itemBounds.width / 2),
              )
            : null,
          itemWidth: itemBounds.width,
        }
      }),
    )
    .toEqual({ centerDelta: 0, itemWidth: 44 })
  await page.mouse.move(600, 400)
  await expect(sider).toHaveScreenshot('sidebar-collapsed-60x900.png', {
    animations: 'disabled',
  })

  await expandButton.click()
  await expect(sider).not.toHaveClass(/ant-layout-sider-collapsed/)
  await expect(sider).toHaveCSS('width', '216px')

  await page.getByRole('button', { name: '切换明暗主题' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await collapseButton.click()
  await expect(sider).toHaveClass(/ant-layout-sider-collapsed/)
  await page.mouse.move(600, 400)
  await expect(sider).toHaveCSS('background-color', 'rgb(20, 20, 20)')
  await expect(sider).toHaveScreenshot('sidebar-collapsed-dark-60x900.png', {
    animations: 'disabled',
  })
})

test('collapsed sidebar submenu popup keeps visible titles and deliberate spacing', async ({
  page,
}) => {
  await loginAsSuper(page)

  const sider = page.locator('.admin-sider')
  const examplesMenuTitle = sider.locator('.ant-menu-submenu-title').filter({ hasText: '示例' })
  await expect(examplesMenuTitle).toBeVisible()
  await page.getByRole('button', { name: '收起侧边栏' }).click()
  await expect(sider).toHaveCSS('width', '60px')

  await examplesMenuTitle.hover()
  const popup = page.locator('.ant-menu-submenu-popup:visible')
  await expect(popup).toBeVisible()
  const formTitle = popup.locator('.ant-menu-submenu-title').filter({ hasText: '表单' })
  const titleContent = formTitle.locator('.admin-menu-label')
  await expect(titleContent).toBeVisible()
  await expect(titleContent).toHaveCSS('opacity', '1')

  const modalTitle = popup
    .locator('.ant-menu-item')
    .filter({ hasText: '弹窗' })
    .locator('.ant-menu-title-content')
  await expect(modalTitle).toBeVisible()
  await expect(modalTitle).toHaveCSS('opacity', '1')
  const modalText = modalTitle.locator('.admin-menu-label > span:first-child')
  await expect(modalText).toBeVisible()

  const modalTextFitsItem = await modalText.evaluate((text) => {
    const itemBounds = text.closest('.ant-menu-item')?.getBoundingClientRect()
    const textBounds = text.getBoundingClientRect()
    return itemBounds
      ? textBounds.top >= itemBounds.top && textBounds.bottom <= itemBounds.bottom
      : false
  })
  expect(modalTextFitsItem).toBe(true)

  await expect
    .poll(() =>
      formTitle.evaluate((item) => {
        const iconBounds = item
          .querySelector(':scope > .ant-menu-item-icon, :scope > svg')
          ?.getBoundingClientRect()
        const titleBounds = item.querySelector('.admin-menu-label')?.getBoundingClientRect()
        return iconBounds && titleBounds ? titleBounds.left - iconBounds.right : null
      }),
    )
    .toBeGreaterThanOrEqual(10)
  await expect(popup).toHaveScreenshot('sidebar-collapsed-submenu-popup.png', {
    animations: 'disabled',
    maxDiffPixels: 10,
  })
})

test('analytics overview keeps a clear desktop hierarchy', async ({ page }) => {
  await page.clock.setFixedTime('2026-08-31T08:30:00+08:00')
  await loginAsSuper(page)
  await page.goto('/dashboard/analytics')
  await page.evaluate(() => window.localStorage.removeItem('qing-react-admin:tabs:v2'))
  await page.reload()

  await expect(page.getByRole('heading', { name: '运营数据' })).toBeVisible()
  await expect(page.getByRole('img', { name: '今日访问与深度互动趋势' })).toBeVisible()
  await expect(page.getByRole('img', { name: '访问来源分布' })).toBeVisible()
  await expect(page).toHaveScreenshot('analytics-overview-1440x900.png', {
    animations: 'disabled',
    fullPage: true,
  })

  await page.setViewportSize({ height: 844, width: 390 })
  await expect(page.getByRole('heading', { name: '运营数据' })).toBeVisible()
  await expect(page).toHaveScreenshot('analytics-overview-390x844.png', {
    animations: 'disabled',
    fullPage: true,
  })
})

test('system management uses asynchronous loading and complete action surfaces', async ({
  page,
}) => {
  await loginAsSuper(page)
  await page.goto('/system/user')

  await expect(page.getByText('用户列表')).toBeVisible()
  await expect(page.getByRole('button', { name: '创建用户' })).toBeVisible()
  await expect(page.getByPlaceholder('请输入部门名称')).toBeVisible()
  await expect(page.getByText('USR-0001')).toBeVisible()
  await page.getByRole('button', { name: '创建用户' }).click()
  await expect(page.getByText('创建用户', { exact: true }).last()).toBeVisible()
  await expect(page.getByLabel('用户名称')).toBeVisible()
  await expect(page.getByLabel('所属部门')).toBeVisible()
})

test('modal and drawer examples preserve their distinct contracts', async ({ page }) => {
  await loginAsSuper(page)
  await page.goto('/examples/modal')
  await page.getByRole('button', { name: '打开表单弹窗' }).click()
  await expect(page.getByText('内嵌表单示例', { exact: true })).toBeVisible()
  await expect(page.getByLabel('字段3')).toBeVisible()
  await page.getByRole('button', { name: /^取\s*消$/ }).click()

  const dynamicCard = page.locator('.ant-card').filter({ hasText: '动态配置示例' })
  await dynamicCard.getByRole('button', { name: '打开弹窗' }).last().click()
  await page.getByRole('button', { name: '打开全屏' }).click()
  const fullscreenModal = page.locator('.app-modal-fullscreen .ant-modal-container')
  await expect(fullscreenModal).toBeVisible()
  await expect
    .poll(() =>
      fullscreenModal.evaluate((element) => {
        const bounds = element.getBoundingClientRect()
        return {
          height: Math.round(bounds.height),
          viewportHeight: window.innerHeight,
          viewportWidth: window.innerWidth,
          width: Math.round(bounds.width),
        }
      }),
    )
    .toEqual({ height: 900, viewportHeight: 900, viewportWidth: 1440, width: 1440 })
  await page.getByRole('button', { name: '退出全屏' }).click()
  await page.getByRole('button', { name: /^取\s*消$/ }).click()

  await page.goto('/examples/drawer')
  await page.getByRole('button', { name: '打开抽屉并设置表单schema以及数据' }).click()
  await expect(page.getByText('内嵌表单示例', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: /^确\s*认$/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /^取\s*消$/ })).toBeVisible()
})

test('React 19 animation and rich-editor examples mount without compatibility crashes', async ({
  page,
}) => {
  await loginAsSuper(page)
  await page.goto('/examples/count-to')
  await expect(page.locator('.app-count-preview')).toContainText('￥')

  await page.goto('/examples/tiptap')
  await expect(page.locator('.app-tiptap')).toBeVisible()
  await expect(page.locator('.tiptap.ProseMirror')).toBeVisible()
  await expect(page.getByRole('button', { name: /link 链接/ })).toBeVisible()
  await expect(page.getByRole('button', { name: '代码块' })).toBeVisible()
  await expect(page.getByRole('button', { name: '预览' })).toBeVisible()
  await expect(page.locator('.app-tiptap__toolbar .ant-color-picker-trigger')).toHaveCount(2)
  await expect(page.locator('.app-tiptap-html')).toBeVisible()
})

test('requested component parity stays intact', async ({ page }) => {
  await loginAsSuper(page)

  await page.goto('/examples/form/query')
  const queryNumber = page.locator('.query-form .ant-input-number').first()
  await expect(queryNumber).toBeVisible()
  await expect
    .poll(() =>
      queryNumber.evaluate((element) => {
        const control = element.closest('.ant-form-item-control-input-content')
        return control
          ? Math.abs(element.getBoundingClientRect().width - control.getBoundingClientRect().width)
          : Number.POSITIVE_INFINITY
      }),
    )
    .toBeLessThanOrEqual(1)

  async function expectQueryTableGap(path: string) {
    await page.goto(path)
    const queryCard = page.locator('.query-form-card').first()
    const table = page.locator('.pro-table').first()
    await expect(queryCard).toBeVisible()
    await expect(table).toBeVisible()
    await expect
      .poll(async () => {
        const [queryBox, tableBox] = await Promise.all([
          queryCard.boundingBox(),
          table.boundingBox(),
        ])
        return queryBox && tableBox ? Math.round(tableBox.y - queryBox.y - queryBox.height) : 0
      })
      .toBeGreaterThanOrEqual(16)
  }
  await expectQueryTableGap('/examples/pro-table/form')
  await expectQueryTableGap('/system/role')

  await page.goto('/examples/captcha/slider-translate')
  await expect(page.locator('.app-translate-captcha canvas')).toHaveCount(2)
  await expect(page.locator('.app-translate-captcha .ant-slider')).toHaveCount(0)

  await page.goto('/examples/cropper')
  await page
    .locator('input[type=file]')
    .setInputFiles('apps/web-admin/public/admin-illustration.svg')
  await expect(page.locator('.v-cropper__resize-handle')).toHaveCount(8)
  await expect(page.locator('.v-cropper__zoom')).toHaveCount(0)

  await page.goto('/examples/tiptap')
  const latestPreviewText = `latest-preview-${Date.now()}`
  const editor = page.locator('.tiptap.ProseMirror')
  await editor.click()
  await page.keyboard.press('ControlOrMeta+A')
  await page.keyboard.type(latestPreviewText)
  await page.getByRole('button', { name: '预览' }).click()
  await expect(page.getByRole('dialog', { name: '内容预览' })).toContainText(latestPreviewText)
})

test('watermark, value-format, department search and Activity regressions stay fixed', async ({
  page,
}) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.message))
  await loginAsSuper(page)

  await page.goto('/demos/features/watermark')
  await expect(page.locator('.app-page__title').getByText('水印', { exact: true })).toBeVisible()
  await page.waitForTimeout(300)
  expect(pageErrors).toEqual([])

  await page.goto('/examples/form/value-format')
  const codecCard = page.locator('.app-page__content > .ant-card').first()
  const codecGrid = page.locator('.app-codec-grid')
  await expect(codecCard).toBeVisible()
  await expect(codecGrid).toBeVisible()
  await expect
    .poll(async () => {
      const [cardBox, gridBox] = await Promise.all([
        codecCard.boundingBox(),
        codecGrid.boundingBox(),
      ])
      return cardBox && gridBox ? Math.round(gridBox.y - cardBox.y - cardBox.height) : 0
    })
    .toBeGreaterThanOrEqual(16)

  await page.goto('/system/user')
  const departmentCard = page.locator('.system-department-filter')
  const departmentLabel = departmentCard.locator('.ant-form-item-label')
  const departmentInput = page.getByPlaceholder('请输入部门名称')
  await expect(departmentInput).toBeVisible()
  const [labelBox, inputBox] = await Promise.all([
    departmentLabel.boundingBox(),
    departmentInput.boundingBox(),
  ])
  expect(
    labelBox && inputBox ? inputBox.y - labelBox.y - labelBox.height : -1,
  ).toBeGreaterThanOrEqual(0)
  await expect(departmentCard.getByRole('button', { name: /查询|重置/ })).toHaveCount(0)
  await departmentInput.fill('前端')
  await expect(departmentCard.getByText('前端研发部')).toBeVisible()
  await expect(departmentCard.getByText('产品设计部')).toHaveCount(0)

  const userNameInput = page.locator('.system-user-main').getByLabel('用户名称')
  await userNameInput.fill('123')
  await page
    .locator('.system-user-main')
    .getByRole('button', { name: /查\s*询/ })
    .click()
  await expect
    .poll(() =>
      page.evaluate(() =>
        new URLSearchParams(window.location.search).get('qf')?.includes('system-user'),
      ),
    )
    .toBe(true)
  const sider = page.locator('.admin-sider')
  await sider.locator('.ant-menu-item').filter({ hasText: '角色管理' }).click()
  await expect(page).toHaveURL(/\/system\/role$/)
  await expect(
    page.locator('.app-page__title').getByText('角色管理', { exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('tab', { name: '用户管理' })).toBeVisible()
  await expect(page.getByRole('tab', { name: '角色管理' })).toBeVisible()
  await sider.locator('.ant-menu-item').filter({ hasText: '用户管理' }).click()
  await expect(page).toHaveURL(/\/system\/user(?:\?|$)/)
  await expect(page.locator('.activity-page[data-page-path="/system/user"]')).toHaveCount(1)
  await expect(
    page
      .locator('.activity-page[data-page-path="/system/user"]')
      .getByPlaceholder('请输入部门名称'),
  ).toHaveValue('前端')
  await expect(page.locator('.system-user-main').getByLabel('用户名称')).toHaveValue('123')
  await page.reload()
  await expect(page.locator('.system-user-main').getByLabel('用户名称')).toHaveValue('123')
})

test('menu, tabs, route and retained page content stay aligned', async ({ page }) => {
  await loginAsSuper(page)

  const sider = page.locator('.admin-sider')
  await sider.locator('.ant-menu-submenu-title').filter({ hasText: '示例' }).click()
  await sider.locator('.ant-menu-item').filter({ hasText: '富文本编辑器' }).click()

  await expect(page).toHaveURL(/\/examples\/tiptap$/)
  await expect
    .poll(() =>
      page.evaluate(() => {
        const stored = window.localStorage.getItem('qing-react-admin:tabs:v2')
        if (!stored) return undefined
        const parsed: unknown = JSON.parse(stored)
        if (!Array.isArray(parsed)) return undefined
        for (const tab of parsed) {
          if (typeof tab !== 'object' || tab === null) continue
          if (!('path' in tab) || tab.path !== '/examples/tiptap') continue
          return 'definitionPath' in tab && typeof tab.definitionPath === 'string'
            ? tab.definitionPath
            : undefined
        }
        return undefined
      }),
    )
    .toBe('/examples/tiptap')
  await expect(page.getByRole('tab', { name: '富文本编辑器' })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await expect(page.locator('.activity-page[data-page-path="/examples/tiptap"]')).toBeVisible()
  await expect(page.locator('.app-tiptap')).toBeVisible()
  await expect(page.locator('.app-count-preview')).not.toBeVisible()

  await page.getByRole('tab', { name: '富文本编辑器' }).click({ button: 'right' })
  const contextMenu = page.locator('.tab-context-dropdown .ant-dropdown-menu')
  await expect(contextMenu).toBeVisible()
  await expect(contextMenu.locator('.ant-dropdown-menu-item')).toHaveText([
    '关闭',
    '固定',
    '最大化',
    '重新加载',
    '在新窗口打开',
    '关闭左侧标签页',
    '关闭右侧标签页',
    '关闭其他标签页',
    '关闭全部标签页',
  ])
  await page.keyboard.press('Escape')

  await page.getByRole('button', { name: '全屏当前页面' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-tab-maximized', '')
  await expect(page.locator('.admin-header')).toBeHidden()
  await page.getByRole('button', { name: '还原当前页面' }).click()
  await expect(page.locator('html')).not.toHaveAttribute('data-tab-maximized')
  await expect(page.locator('.admin-header')).toBeVisible()

  await sider.locator('.ant-menu-item').filter({ hasText: 'CountTo' }).click()
  await expect(page).toHaveURL(/\/examples\/count-to$/)
  await expect(page.getByRole('tab', { name: 'CountTo' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.activity-page[data-page-path="/examples/count-to"]')).toBeVisible()
  await expect(page.locator('.app-count-preview')).toBeVisible()
  await expect(page.locator('.app-tiptap')).not.toBeVisible()

  await page.getByRole('tab', { name: '富文本编辑器' }).click()
  await expect(page).toHaveURL(/\/examples\/tiptap$/)
  await expect(page.locator('.activity-page[data-page-path="/examples/tiptap"]')).toBeVisible()
  await expect(page.locator('.app-tiptap')).toBeVisible()
  await expect(page.locator('.app-count-preview')).not.toBeVisible()
})

test('component examples preserve their data and selection behavior', async ({ page }) => {
  await loginAsSuper(page)
  await page.goto('/examples/button-group')
  await expect(page.locator('.button-list').first()).toBeVisible()
  const singleGroup = page.locator('.app-check-button-group').first()
  await expect(page.getByText('单选：a', { exact: true })).toBeVisible()
  await singleGroup.getByRole('button', { name: /选项3/ }).click()
  await expect(page.getByText('单选：c', { exact: true })).toBeVisible()

  await page.goto('/examples/ellipsis')
  const ellipsisTarget = page.locator('.app-ellipsis-text').first()
  await ellipsisTarget.hover()
  const ellipsisTooltip = page.locator('.ant-tooltip-container')
  await expect(ellipsisTooltip).toBeVisible()
  const ellipsisWidths = await Promise.all([
    ellipsisTarget.evaluate((element) => Math.round(element.getBoundingClientRect().width)),
    ellipsisTooltip.evaluate((element) => Math.round(element.getBoundingClientRect().width)),
  ])
  expect(ellipsisWidths[1]).toBeLessThanOrEqual(ellipsisWidths[0])

  await page.goto('/examples/layout/col-page')
  await expect(page.locator('.app-col-page')).toBeVisible()
  await expect(page.getByText('实验性的组件', { exact: true })).toBeVisible()
  await expect(page.getByText('这里是左侧内容')).toHaveCount(5)

  await page.goto('/examples/captcha/slider-translate')
  await expect(page.locator('.app-translate-captcha__canvas')).toHaveCSS('width', '420px')
  await expect(page.locator('.app-translate-captcha__canvas')).toHaveCSS('height', '420px')

  await page.goto('/examples/json-viewer')
  await expect(page.getByText('Description of Tool 4', { exact: true })).toBeVisible()
  await expect(page.getByText('chatgpt-123', { exact: true }).first()).toBeVisible()
  await page.locator('.app-json-viewer-boxed .w-rjv-object-key').filter({ hasText: /^id$/ }).click()
  await expect(page.getByText('点击了Key id')).toBeVisible()

  await page.goto('/examples/pro-table/viewed')
  const viewedCard = page.locator('.ant-card').filter({ hasText: '已查看行标记' }).first()
  await viewedCard.getByRole('button', { name: '手动标记' }).click()
  await expect(viewedCard.getByText('已查看', { exact: true })).toHaveCount(2)
  await page.reload()
  await expect(viewedCard.getByText('已查看', { exact: true })).toHaveCount(2)

  await page.goto('/examples/pro-table/form')
  await expect(page.locator('.query-form-card')).toBeVisible()
  await expect(page.locator('.pro-table').locator('.query-form')).toHaveCount(0)
  await expect(page.locator('.pro-table__card')).toBeVisible()
  await expect(page.locator('.query-form__item')).toHaveCount(3)
  await page.getByRole('button', { name: '展开' }).click()
  await expect(page.locator('.query-form__item')).toHaveCount(5)
  await expect(page.getByRole('button', { name: '表格密度' })).toBeVisible()
  await expect(page.getByRole('button', { name: '列显示' })).toBeVisible()

  await page.goto('/demos/features/icons')
  const svgIconRow = page.locator('.app-icon-row').nth(1)
  await expect(svgIconRow.locator('img')).toHaveCount(8)
  await expect(svgIconRow.locator('img').first()).toHaveAttribute('src', '/app-icons/avatar-1.svg')

  await page.goto('/dashboard/analytics')
  await expect(page.getByRole('img', { name: '今日访问与深度互动趋势' })).toBeVisible()
  await expect(page.getByRole('img', { name: '访问来源分布' })).toBeVisible()
})

const smokeGroups: PageManifestEntry['group'][] = [
  'dashboard',
  'demos',
  'examples',
  'system',
  'profile',
]

test.describe('standalone 89-page application scope', () => {
  test('manifest remains complete', () => {
    expect(pageManifest).toHaveLength(89)
    expect(pageCountByGroup).toEqual({
      dashboard: 2,
      demos: 41,
      examples: 41,
      profile: 1,
      system: 4,
    })
  })

  for (const group of smokeGroups) {
    test(`${group} routes render without a page crash`, async ({ page }) => {
      test.setTimeout(180_000)
      await loginAsSuper(page)
      const pageErrors: string[] = []
      page.on('pageerror', (error) => pageErrors.push(error.message))
      const entries = pageManifest.filter((item) => item.group === group)

      async function visitEntry(index: number): Promise<void> {
        const entry = entries[index]
        if (!entry) return
        const path = entry.path.replace(':id', '42')
        await test.step(path, async () => {
          pageErrors.length = 0
          await page.goto(path, { waitUntil: 'domcontentloaded' })
          await expect(page.locator('.admin-layout')).toBeVisible()
          await expect(page.getByText('页面加载失败')).toHaveCount(0)
          await page.waitForTimeout(40)
          expect(pageErrors, `${path} emitted a browser page error`).toEqual([])
        })
        await visitEntry(index + 1)
      }

      await visitEntry(0)
    })
  }
})
