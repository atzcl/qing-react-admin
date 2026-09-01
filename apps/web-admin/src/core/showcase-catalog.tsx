import { SettingOutlined, TeamOutlined } from '@ant-design/icons'
import { Icon as IconifyIcon } from '@iconify/react'
import { lazy } from 'react'
import type { ComponentProps, ComponentType } from 'react'

import type { AdminPageDefinition, NavigationFolder, NavigationNode } from './page-registry'
import { folderLabel, routeLabel } from './route-labels'
import type { UserRole } from './types'

type CatalogIcon = ComponentType

function iconify(icon: string): CatalogIcon {
  return function CatalogIcon(props: Omit<ComponentProps<typeof IconifyIcon>, 'icon'>) {
    return <IconifyIcon {...props} icon={icon} />
  }
}

interface CatalogEntry {
  activeIcon?: CatalogIcon
  activePath?: string
  badge?: string
  badgeType?: 'dot' | 'normal'
  badgeVariant?: string
  externalUrl?: string
  forbidden?: boolean
  hideInMenu?: boolean
  icon?: CatalogIcon
  kind?: string
  menuHref?: string
  menuVisibleWithForbidden?: boolean
  openInNewWindow?: boolean
  page?: ComponentType
  path: string
  roles?: UserRole[]
  title: string
}

function createEntry({
  activeIcon,
  activePath,
  badge,
  badgeType,
  badgeVariant,
  externalUrl,
  forbidden,
  hideInMenu,
  icon,
  menuHref,
  menuVisibleWithForbidden,
  openInNewWindow,
  page,
  path,
  roles,
  title,
}: CatalogEntry): AdminPageDefinition {
  const translatedPage = page ?? demoComponentByPath[path] ?? exampleComponentByPath[path]
  if (!translatedPage) {
    throw new Error(`Missing translated showcase page: ${path}`)
  }
  return {
    ...(activeIcon ? { activeIcon } : {}),
    ...(activePath ? { activePath } : {}),
    ...(badge ? { badge } : {}),
    ...(badgeType ? { badgeType } : {}),
    ...(badgeVariant ? { badgeVariant } : {}),
    ...(externalUrl ? { externalUrl } : {}),
    ...(forbidden ? { forbidden } : {}),
    ...(hideInMenu ? { hideInMenu } : {}),
    ...(icon ? { icon } : {}),
    label: routeLabel(path, title),
    ...(menuHref ? { menuHref } : {}),
    ...(menuVisibleWithForbidden ? { menuVisibleWithForbidden } : {}),
    ...(openInNewWindow ? { openInNewWindow } : {}),
    page: translatedPage,
    path,
    ...(roles ? { roles } : {}),
    titleKey: path.startsWith('/examples') ? 'menu.examples' : 'menu.demos',
  }
}

function lazyNamed<Name extends string>(
  loader: () => Promise<Record<Name, ComponentType>>,
  name: Name,
) {
  return lazy(async () => {
    const module = await loader()
    return { default: module[name] }
  })
}

const accessModule = () => import('../pages/demos/access-pages')
const basicFeatureModule = () => import('../pages/demos/basic-feature-pages')
const navigationModule = () => import('../pages/demos/navigation-pages')
const fallbackModule = () => import('../pages/fallback-pages')

const demoComponentByPath: Record<string, ComponentType> = {
  '/demos/access/page-control': lazyNamed(accessModule, 'AccessPageControlDemo'),
  '/demos/access/button-control': lazyNamed(accessModule, 'AccessButtonControlDemo'),
  '/demos/access/menu-visible-403': lazyNamed(accessModule, 'AccessMenuVisible403Demo'),
  '/demos/access/super-visible': lazyNamed(accessModule, 'AccessSuperVisibleDemo'),
  '/demos/access/admin-visible': lazyNamed(accessModule, 'AccessAdminVisibleDemo'),
  '/demos/access/user-visible': lazyNamed(accessModule, 'AccessUserVisibleDemo'),
  '/demos/features/login-expired': lazyNamed(basicFeatureModule, 'LoginExpiredDemo'),
  '/demos/features/icons': lazyNamed(() => import('../pages/demos/icons-page'), 'IconsDemo'),
  '/demos/features/watermark': lazyNamed(basicFeatureModule, 'WatermarkDemo'),
  '/demos/features/preferences-extension': lazyNamed(
    () => import('../pages/demos/preferences-extension-page'),
    'PreferencesExtensionDemo',
  ),
  '/demos/features/tabs': lazyNamed(() => import('../pages/demos/tabs-pages'), 'FeatureTabsDemo'),
  '/demos/features/detail/:id': lazyNamed(
    () => import('../pages/demos/tabs-pages'),
    'FeatureTabDetailDemo',
  ),
  '/demos/features/hide-menu-children': lazyNamed(navigationModule, 'HideMenuChildrenParentDemo'),
  '/demos/features/hide-menu-children/children': lazyNamed(
    navigationModule,
    'HideMenuChildrenChildDemo',
  ),
  '/demos/features/full-screen': lazyNamed(basicFeatureModule, 'FullScreenDemo'),
  '/demos/features/file-download': lazyNamed(basicFeatureModule, 'FileDownloadDemo'),
  '/demos/features/clipboard': lazyNamed(basicFeatureModule, 'ClipboardDemo'),
  '/demos/features/menu-query': lazyNamed(navigationModule, 'MenuQueryDemo'),
  '/demos/features/new-window': lazyNamed(navigationModule, 'NewWindowDemo'),
  '/demos/features/tanstack-query': lazyNamed(
    () => import('../pages/demos/query-page'),
    'TanStackQueryDemo',
  ),
  '/demos/features/request-params-serializer': lazyNamed(
    basicFeatureModule,
    'RequestParamsSerializerDemo',
  ),
  '/demos/features/json-bigint': lazyNamed(basicFeatureModule, 'JsonBigIntDemo'),
  '/demos/breadcrumb/lateral': lazyNamed(navigationModule, 'BreadcrumbLateralDemo'),
  '/demos/breadcrumb/lateral-detail': lazyNamed(navigationModule, 'BreadcrumbLateralDetailDemo'),
  '/demos/breadcrumb/level/detail': lazyNamed(navigationModule, 'BreadcrumbLevelDetailDemo'),
  '/demos/fallback/403': lazyNamed(fallbackModule, 'ForbiddenPage'),
  '/demos/fallback/404': lazyNamed(fallbackModule, 'NotFoundPage'),
  '/demos/fallback/500': lazyNamed(fallbackModule, 'InternalErrorPage'),
  '/demos/fallback/offline': lazyNamed(fallbackModule, 'OfflinePage'),
  '/demos/badge/dot': lazyNamed(navigationModule, 'BadgeDemo'),
  '/demos/badge/text': lazyNamed(navigationModule, 'BadgeDemo'),
  '/demos/badge/color': lazyNamed(navigationModule, 'BadgeDemo'),
  '/demos/active-icon/children': lazyNamed(navigationModule, 'ActiveIconDemo'),
  '/demos/outside/iframe/react-document': lazyNamed(navigationModule, 'ReactDocumentDemo'),
  '/demos/outside/iframe/tailwindcss': lazyNamed(navigationModule, 'TailwindDocumentDemo'),
  '/demos/outside/external-link/vite': lazyNamed(navigationModule, 'NestedMenuDemo'),
  '/demos/outside/external-link/react': lazyNamed(navigationModule, 'NestedMenuDemo'),
  '/demos/nested/menu1': lazyNamed(navigationModule, 'NestedMenuDemo'),
  '/demos/nested/menu2/menu2-1': lazyNamed(navigationModule, 'NestedMenuDemo'),
  '/demos/nested/menu3/menu3-1': lazyNamed(navigationModule, 'NestedMenuDemo'),
  '/demos/nested/menu3/menu3-2/menu3-2-1': lazyNamed(navigationModule, 'NestedMenuDemo'),
}

const basicFormModule = () => import('../pages/examples/forms/basic-form-examples')
const validationFormModule = () => import('../pages/examples/forms/validation-form-examples')
const apiFormModule = () => import('../pages/examples/forms/api-form-examples')
const advancedFormModule = () => import('../pages/examples/forms/advanced-form-examples')
const tableModule = () => import('../pages/examples/table-pages')
const captchaModule = () => import('../pages/examples/captcha-pages')
const modalExampleModule = () => import('../pages/examples/overlays/modal-example')
const drawerExampleModule = () => import('../pages/examples/overlays/drawer-example')
const layoutExamplesModule = () => import('../pages/examples/misc/layout-examples')
const tippyExampleModule = () => import('../pages/examples/misc/tippy-example')
const dataMotionExamplesModule = () => import('../pages/examples/misc/data-motion-examples')
const countExampleModule = () => import('../pages/examples/misc/count-example')
const interactionExamplesModule = () => import('../pages/examples/misc/interaction-examples')
const editorExamplesModule = () => import('../pages/examples/misc/editor-examples')

const exampleComponentByPath: Record<string, ComponentType> = {
  '/examples/form/basic': lazyNamed(basicFormModule, 'BasicFormExample'),
  '/examples/form/query': lazyNamed(basicFormModule, 'QueryFormExample'),
  '/examples/form/value-format': lazyNamed(basicFormModule, 'ValueFormatFormExample'),
  '/examples/form/rules': lazyNamed(validationFormModule, 'RulesFormExample'),
  '/examples/form/dynamic': lazyNamed(validationFormModule, 'DynamicFormExample'),
  '/examples/form/custom-layout': lazyNamed(validationFormModule, 'CustomLayoutFormExample'),
  '/examples/form/custom': lazyNamed(validationFormModule, 'CustomComponentFormExample'),
  '/examples/form/api': lazyNamed(apiFormModule, 'ApiFormExample'),
  '/examples/form/merge': lazyNamed(apiFormModule, 'MergeFormExample'),
  '/examples/form/scroll-to-error-test': lazyNamed(apiFormModule, 'ScrollToErrorFormExample'),
  '/examples/form/collapsible-test': lazyNamed(advancedFormModule, 'CollapsibleFormExample'),
  '/examples/form/label-width': lazyNamed(advancedFormModule, 'LabelWidthFormExample'),
  '/form-array-demo': lazyNamed(advancedFormModule, 'FormArrayDemo'),
  '/examples/pro-table/basic': lazyNamed(tableModule, 'BasicTableExample'),
  '/examples/pro-table/remote': lazyNamed(tableModule, 'RemoteTableExample'),
  '/examples/pro-table/tree': lazyNamed(tableModule, 'TreeTableExample'),
  '/examples/pro-table/fixed': lazyNamed(tableModule, 'FixedTableExample'),
  '/examples/pro-table/custom-cell': lazyNamed(tableModule, 'CustomCellTableExample'),
  '/examples/pro-table/form': lazyNamed(tableModule, 'TableFormExample'),
  '/examples/pro-table/edit-cell': lazyNamed(tableModule, 'EditCellTableExample'),
  '/examples/pro-table/edit-row': lazyNamed(tableModule, 'EditRowTableExample'),
  '/examples/pro-table/virtual': lazyNamed(tableModule, 'VirtualTableExample'),
  '/examples/pro-table/viewed': lazyNamed(tableModule, 'ViewedTableExample'),
  '/examples/captcha/slider': lazyNamed(captchaModule, 'SliderCaptchaExample'),
  '/examples/captcha/slider-rotate': lazyNamed(captchaModule, 'SliderRotateCaptchaExample'),
  '/examples/captcha/slider-translate': lazyNamed(captchaModule, 'SliderTranslateCaptchaExample'),
  '/examples/captcha/point-selection': lazyNamed(captchaModule, 'PointSelectionCaptchaExample'),
  '/examples/modal': lazyNamed(modalExampleModule, 'ModalExample'),
  '/examples/drawer': lazyNamed(drawerExampleModule, 'DrawerExample'),
  '/examples/ellipsis': lazyNamed(layoutExamplesModule, 'EllipsisExample'),
  '/examples/resize/basic': lazyNamed(layoutExamplesModule, 'ResizeExample'),
  '/examples/layout/col-page': lazyNamed(layoutExamplesModule, 'ColPageExample'),
  '/examples/tippy': lazyNamed(tippyExampleModule, 'TippyExample'),
  '/examples/json-viewer': lazyNamed(dataMotionExamplesModule, 'JsonViewerExample'),
  '/examples/motion': lazyNamed(dataMotionExamplesModule, 'MotionExample'),
  '/examples/count-to': lazyNamed(countExampleModule, 'CountToExample'),
  '/examples/loading': lazyNamed(interactionExamplesModule, 'LoadingExample'),
  '/examples/button-group': lazyNamed(interactionExamplesModule, 'ButtonGroupExample'),
  '/examples/context-menu': lazyNamed(interactionExamplesModule, 'ContextMenuExample'),
  '/examples/cropper': lazyNamed(editorExamplesModule, 'CropperExample'),
  '/examples/tiptap': lazyNamed(editorExamplesModule, 'TiptapExample'),
}

function folder(
  key: string,
  title: string,
  children: NavigationNode[],
  icon?: CatalogIcon,
  metadata: Pick<NavigationFolder, 'activeIcon' | 'badge' | 'badgeType' | 'badgeVariant'> = {},
): NavigationFolder {
  return {
    ...metadata,
    children,
    ...(icon ? { icon } : {}),
    key,
    label: folderLabel(key, title),
  }
}

const demoEntries: CatalogEntry[] = [
  {
    icon: iconify('mdi:page-previous-outline'),
    path: '/demos/access/page-control',
    title: '页面访问',
  },
  {
    icon: iconify('mdi:button-cursor'),
    path: '/demos/access/button-control',
    title: '按钮控制',
  },
  {
    forbidden: true,
    icon: iconify('mdi:button-cursor'),
    menuVisibleWithForbidden: true,
    path: '/demos/access/menu-visible-403',
    title: '菜单可见(403)',
  },
  {
    icon: iconify('mdi:button-cursor'),
    path: '/demos/access/super-visible',
    roles: ['super'],
    title: 'Super 可见',
  },
  {
    icon: iconify('mdi:button-cursor'),
    path: '/demos/access/admin-visible',
    roles: ['admin'],
    title: 'Admin 可见',
  },
  {
    icon: iconify('mdi:button-cursor'),
    path: '/demos/access/user-visible',
    roles: ['user'],
    title: 'User 可见',
  },
  {
    icon: iconify('mdi:encryption-expiration'),
    path: '/demos/features/login-expired',
    title: '登录过期',
  },
  { icon: iconify('lucide:annoyed'), path: '/demos/features/icons', title: '图标' },
  { icon: iconify('lucide:tags'), path: '/demos/features/watermark', title: '水印' },
  {
    icon: iconify('lucide:sliders-horizontal'),
    path: '/demos/features/preferences-extension',
    title: '偏好扩展示例',
  },
  { icon: iconify('lucide:app-window'), path: '/demos/features/tabs', title: '标签页' },
  {
    activePath: '/demos/features/tabs',
    hideInMenu: true,
    path: '/demos/features/detail/:id',
    title: '标签详情页',
  },
  {
    icon: iconify('ic:round-menu'),
    path: '/demos/features/hide-menu-children',
    title: '隐藏子菜单',
  },
  {
    activePath: '/demos/features/hide-menu-children',
    hideInMenu: true,
    path: '/demos/features/hide-menu-children/children',
    title: '隐藏子菜单',
  },
  { icon: iconify('lucide:fullscreen'), path: '/demos/features/full-screen', title: '全屏' },
  {
    icon: iconify('lucide:hard-drive-download'),
    path: '/demos/features/file-download',
    title: '文件下载',
  },
  { icon: iconify('lucide:copy'), path: '/demos/features/clipboard', title: '剪贴板' },
  {
    icon: iconify('lucide:curly-braces'),
    menuHref: '/demos/features/menu-query?id=1',
    path: '/demos/features/menu-query',
    title: '带参菜单',
  },
  {
    icon: iconify('lucide:app-window'),
    openInNewWindow: true,
    path: '/demos/features/new-window',
    title: '新窗口打开',
  },
  {
    icon: iconify('lucide:git-pull-request-arrow'),
    path: '/demos/features/tanstack-query',
    title: 'Tanstack Query',
  },
  {
    icon: iconify('lucide:git-pull-request-arrow'),
    path: '/demos/features/request-params-serializer',
    title: '参数序列化',
  },
  { icon: iconify('lucide:grape'), path: '/demos/features/json-bigint', title: 'JSON BigInt' },
  {
    icon: iconify('lucide:navigation'),
    path: '/demos/breadcrumb/lateral',
    title: '平级模式',
  },
  {
    activePath: '/demos/breadcrumb/lateral',
    hideInMenu: true,
    path: '/demos/breadcrumb/lateral-detail',
    title: '平级模式详情',
  },
  { path: '/demos/breadcrumb/level/detail', title: '层级模式详情' },
  { icon: iconify('mdi:do-not-disturb-alt'), path: '/demos/fallback/403', title: '403' },
  { icon: iconify('mdi:table-off'), path: '/demos/fallback/404', title: '404' },
  { icon: iconify('mdi:server-network-off'), path: '/demos/fallback/500', title: '500' },
  { icon: iconify('mdi:offline'), path: '/demos/fallback/offline', title: '离线' },
  {
    badgeType: 'dot',
    icon: iconify('lucide:square-dot'),
    path: '/demos/badge/dot',
    title: '点徽标',
  },
  {
    badge: '10',
    icon: iconify('lucide:square-dot'),
    path: '/demos/badge/text',
    title: '文本徽标',
  },
  {
    badge: 'Hot',
    badgeVariant: 'destructive',
    icon: iconify('lucide:square-dot'),
    path: '/demos/badge/color',
    title: '徽标颜色',
  },
  {
    activeIcon: iconify('fluent-emoji:radioactive'),
    icon: iconify('bi:radioactive'),
    path: '/demos/active-icon/children',
    title: '子级激活图标',
  },
  { icon: iconify('bx:bxl-react'), path: '/demos/outside/iframe/react-document', title: 'React' },
  {
    icon: iconify('devicon:tailwindcss'),
    path: '/demos/outside/iframe/tailwindcss',
    title: 'Tailwindcss',
  },
  {
    externalUrl: 'https://vitejs.dev/',
    icon: iconify('logos:vitejs'),
    path: '/demos/outside/external-link/vite',
    title: 'Vite',
  },
  {
    externalUrl: 'https://react.dev',
    icon: iconify('bx:bxl-react'),
    path: '/demos/outside/external-link/react',
    title: 'React',
  },
  { icon: iconify('ic:round-menu'), path: '/demos/nested/menu1', title: '菜单 1' },
  {
    icon: iconify('ic:round-menu'),
    path: '/demos/nested/menu2/menu2-1',
    title: '菜单 2-1',
  },
  {
    icon: iconify('ic:round-menu'),
    path: '/demos/nested/menu3/menu3-1',
    title: '菜单 3-1',
  },
  {
    icon: iconify('ic:round-menu'),
    path: '/demos/nested/menu3/menu3-2/menu3-2-1',
    title: '菜单 3-2-1',
  },
]

const exampleEntries: CatalogEntry[] = [
  { path: '/examples/form/basic', title: '基础表单' },
  { path: '/examples/form/query', title: '查询表单' },
  { path: '/examples/form/value-format', title: '值格式化' },
  { path: '/examples/form/rules', title: '表单校验' },
  { path: '/examples/form/dynamic', title: '动态表单' },
  { path: '/examples/form/custom-layout', title: '自定义布局' },
  { path: '/examples/form/custom', title: '自定义组件' },
  { path: '/examples/form/api', title: 'Api' },
  { path: '/examples/form/merge', title: '合并表单' },
  { path: '/examples/form/scroll-to-error-test', title: '滚动到错误字段' },
  { path: '/examples/form/collapsible-test', title: '单项表单折叠' },
  { path: '/examples/form/label-width', title: 'Label 自动宽度' },
  { icon: iconify('lucide:list-plus'), path: '/form-array-demo', title: '表单数组 Demo' },
  { path: '/examples/pro-table/basic', title: '基础表格' },
  { path: '/examples/pro-table/remote', title: '远程加载' },
  { path: '/examples/pro-table/tree', title: '树形表格' },
  { path: '/examples/pro-table/fixed', title: '固定表头/列' },
  { path: '/examples/pro-table/custom-cell', title: '自定义单元格' },
  { path: '/examples/pro-table/form', title: '搜索表单' },
  { path: '/examples/pro-table/edit-cell', title: '单元格编辑' },
  { path: '/examples/pro-table/edit-row', title: '行编辑' },
  { path: '/examples/pro-table/virtual', title: '虚拟滚动' },
  { path: '/examples/pro-table/viewed', title: '行标记' },
  { path: '/examples/captcha/slider', title: '滑块验证' },
  { path: '/examples/captcha/slider-rotate', title: '旋转验证' },
  { path: '/examples/captcha/slider-translate', title: '拼图滑块验证' },
  { path: '/examples/captcha/point-selection', title: '点选验证' },
  { icon: iconify('system-uicons:window-content'), path: '/examples/modal', title: '弹窗' },
  { icon: iconify('iconoir:drawer'), path: '/examples/drawer', title: '抽屉' },
  { icon: iconify('ion:ellipsis-horizontal'), path: '/examples/ellipsis', title: '文本省略' },
  { icon: iconify('material-symbols:resize'), path: '/examples/resize/basic', title: '拖动调整' },
  {
    badge: 'Alpha',
    badgeVariant: 'destructive',
    icon: iconify('material-symbols:horizontal-distribute'),
    path: '/examples/layout/col-page',
    title: '双列布局',
  },
  { icon: iconify('mdi:message-settings-outline'), path: '/examples/tippy', title: 'Tippy' },
  { icon: iconify('tabler:json'), path: '/examples/json-viewer', title: 'JsonViewer' },
  { icon: iconify('mdi:animation-play'), path: '/examples/motion', title: 'Motion' },
  { icon: iconify('mdi:animation-play'), path: '/examples/count-to', title: 'CountTo' },
  { icon: iconify('mdi:circle-double'), path: '/examples/loading', title: 'Loading' },
  { icon: iconify('mdi:check-circle'), path: '/examples/button-group', title: '按钮组' },
  { icon: iconify('mdi:menu'), path: '/examples/context-menu', title: '上下文菜单' },
  { icon: iconify('mdi:crop'), path: '/examples/cropper', title: '图片裁剪' },
  { icon: iconify('lucide:square-pen'), path: '/examples/tiptap', title: '富文本编辑器' },
]

export const showcaseDemoPages = demoEntries.map(createEntry)
export const showcaseExamplePages = exampleEntries.map(createEntry)

const demoByPath = new Map(showcaseDemoPages.map((page) => [page.path, page]))
const exampleByPath = new Map(showcaseExamplePages.map((page) => [page.path, page]))

function demo(path: string) {
  const page = demoByPath.get(path)
  if (!page) throw new Error(`Missing showcase demo page: ${path}`)
  return page
}

function example(path: string) {
  const page = exampleByPath.get(path)
  if (!page) throw new Error(`Missing showcase example page: ${path}`)
  return page
}

export const showcaseDemoMenu: NavigationNode[] = [
  folder(
    'demos-access',
    '前端权限',
    [
      demo('/demos/access/page-control'),
      demo('/demos/access/button-control'),
      demo('/demos/access/menu-visible-403'),
      demo('/demos/access/super-visible'),
      demo('/demos/access/admin-visible'),
      demo('/demos/access/user-visible'),
    ],
    iconify('mdi:shield-key-outline'),
  ),
  folder(
    'demos-features',
    '功能',
    [
      demo('/demos/features/login-expired'),
      demo('/demos/features/icons'),
      demo('/demos/features/watermark'),
      demo('/demos/features/preferences-extension'),
      demo('/demos/features/tabs'),
      demo('/demos/features/hide-menu-children'),
      demo('/demos/features/full-screen'),
      demo('/demos/features/file-download'),
      demo('/demos/features/clipboard'),
      demo('/demos/features/menu-query'),
      demo('/demos/features/new-window'),
      demo('/demos/features/tanstack-query'),
      demo('/demos/features/request-params-serializer'),
      demo('/demos/features/json-bigint'),
    ],
    iconify('mdi:feature-highlight'),
  ),
  folder(
    'demos-breadcrumb',
    '面包屑导航',
    [
      demo('/demos/breadcrumb/lateral'),
      demo('/demos/breadcrumb/lateral-detail'),
      folder(
        'demos-breadcrumb-level',
        '层级模式',
        [demo('/demos/breadcrumb/level/detail')],
        iconify('lucide:navigation'),
      ),
    ],
    iconify('lucide:navigation'),
  ),
  folder(
    'demos-fallback',
    '缺省页',
    [
      demo('/demos/fallback/403'),
      demo('/demos/fallback/404'),
      demo('/demos/fallback/500'),
      demo('/demos/fallback/offline'),
    ],
    iconify('mdi:lightbulb-error-outline'),
  ),
  folder(
    'demos-badge',
    '菜单徽标',
    [demo('/demos/badge/dot'), demo('/demos/badge/text'), demo('/demos/badge/color')],
    iconify('lucide:circle-dot'),
    { badgeType: 'dot', badgeVariant: 'destructive' },
  ),
  folder(
    'demos-active-icon',
    '菜单激活图标',
    [demo('/demos/active-icon/children')],
    iconify('bi:radioactive'),
    { activeIcon: iconify('fluent-emoji:radioactive') },
  ),
  folder(
    'demos-outside',
    '外部页面',
    [
      folder(
        'demos-iframe',
        '内嵌',
        [demo('/demos/outside/iframe/react-document'), demo('/demos/outside/iframe/tailwindcss')],
        iconify('mdi:newspaper-variant-outline'),
      ),
      folder(
        'demos-external',
        '外链',
        [demo('/demos/outside/external-link/vite'), demo('/demos/outside/external-link/react')],
        iconify('mdi:newspaper-variant-multiple-outline'),
      ),
    ],
    iconify('ic:round-settings-input-composite'),
  ),
  folder(
    'demos-nested',
    '嵌套菜单',
    [
      demo('/demos/nested/menu1'),
      folder(
        'demos-menu2',
        '菜单 2',
        [demo('/demos/nested/menu2/menu2-1')],
        iconify('ic:round-menu'),
      ),
      folder(
        'demos-menu3',
        '菜单 3',
        [
          demo('/demos/nested/menu3/menu3-1'),
          folder(
            'demos-menu32',
            '菜单 3-2',
            [demo('/demos/nested/menu3/menu3-2/menu3-2-1')],
            iconify('ic:round-menu'),
          ),
        ],
        iconify('ic:round-menu'),
      ),
    ],
    iconify('ic:round-menu'),
  ),
]

export const showcaseExampleMenu: NavigationNode[] = [
  folder(
    'examples-form',
    '表单',
    exampleEntries
      .filter(
        (entry) => entry.path.startsWith('/examples/form/') || entry.path === '/form-array-demo',
      )
      .map((entry) => example(entry.path)),
    iconify('mdi:form-select'),
  ),
  folder(
    'examples-table',
    'Pro 表格',
    exampleEntries
      .filter((entry) => entry.path.startsWith('/examples/pro-table/'))
      .map((entry) => example(entry.path)),
    iconify('lucide:table'),
  ),
  folder(
    'examples-captcha',
    '验证码',
    exampleEntries
      .filter((entry) => entry.path.startsWith('/examples/captcha/'))
      .map((entry) => example(entry.path)),
    iconify('logos:recaptcha'),
  ),
  ...[
    '/examples/modal',
    '/examples/drawer',
    '/examples/ellipsis',
    '/examples/resize/basic',
    '/examples/layout/col-page',
    '/examples/tippy',
    '/examples/json-viewer',
    '/examples/motion',
    '/examples/count-to',
    '/examples/loading',
    '/examples/button-group',
    '/examples/context-menu',
    '/examples/cropper',
    '/examples/tiptap',
  ].map(example),
]

export const showcaseStats = {
  demoPages: showcaseDemoPages.length,
  examplePages: showcaseExamplePages.length,
  totalPages: showcaseDemoPages.length + showcaseExamplePages.length,
}

export const showcaseGroupIcons = {
  demos: iconify('ic:baseline-view-in-ar'),
  examples: iconify('ion:layers-outline'),
  system: SettingOutlined,
  team: TeamOutlined,
}
