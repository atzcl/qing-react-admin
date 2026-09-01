export interface PageManifestEntry {
  group: 'dashboard' | 'demos' | 'examples' | 'profile' | 'system'
  path: string
}

function entries(group: PageManifestEntry['group'], paths: readonly string[]): PageManifestEntry[] {
  return paths.map((path) => ({ group, path }))
}

const dashboard = entries('dashboard', ['/dashboard/analytics', '/dashboard/workspace'])

const demos = entries('demos', [
  '/demos/access/page-control',
  '/demos/access/button-control',
  '/demos/access/menu-visible-403',
  '/demos/access/super-visible',
  '/demos/access/admin-visible',
  '/demos/access/user-visible',
  '/demos/features/login-expired',
  '/demos/features/icons',
  '/demos/features/watermark',
  '/demos/features/preferences-extension',
  '/demos/features/tabs',
  '/demos/features/detail/:id',
  '/demos/features/hide-menu-children',
  '/demos/features/hide-menu-children/children',
  '/demos/features/full-screen',
  '/demos/features/file-download',
  '/demos/features/clipboard',
  '/demos/features/menu-query',
  '/demos/features/new-window',
  '/demos/features/tanstack-query',
  '/demos/features/request-params-serializer',
  '/demos/features/json-bigint',
  '/demos/breadcrumb/lateral',
  '/demos/breadcrumb/lateral-detail',
  '/demos/breadcrumb/level/detail',
  '/demos/fallback/403',
  '/demos/fallback/404',
  '/demos/fallback/500',
  '/demos/fallback/offline',
  '/demos/badge/dot',
  '/demos/badge/text',
  '/demos/badge/color',
  '/demos/active-icon/children',
  '/demos/outside/iframe/react-document',
  '/demos/outside/iframe/tailwindcss',
  '/demos/outside/external-link/vite',
  '/demos/outside/external-link/react',
  '/demos/nested/menu1',
  '/demos/nested/menu2/menu2-1',
  '/demos/nested/menu3/menu3-1',
  '/demos/nested/menu3/menu3-2/menu3-2-1',
])

const examples = entries('examples', [
  '/examples/form/basic',
  '/examples/form/query',
  '/examples/form/value-format',
  '/examples/form/rules',
  '/examples/form/dynamic',
  '/examples/form/custom-layout',
  '/examples/form/custom',
  '/examples/form/api',
  '/examples/form/merge',
  '/examples/form/scroll-to-error-test',
  '/examples/form/collapsible-test',
  '/examples/form/label-width',
  '/form-array-demo',
  '/examples/pro-table/basic',
  '/examples/pro-table/remote',
  '/examples/pro-table/tree',
  '/examples/pro-table/fixed',
  '/examples/pro-table/custom-cell',
  '/examples/pro-table/form',
  '/examples/pro-table/edit-cell',
  '/examples/pro-table/edit-row',
  '/examples/pro-table/virtual',
  '/examples/pro-table/viewed',
  '/examples/captcha/slider',
  '/examples/captcha/slider-rotate',
  '/examples/captcha/slider-translate',
  '/examples/captcha/point-selection',
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
])

const system = entries('system', ['/system/user', '/system/role', '/system/menu', '/system/dept'])

const profile = entries('profile', ['/profile'])

/** The standalone browser application route contract. */
export const pageManifest = [...dashboard, ...demos, ...examples, ...system, ...profile]

export const pageCountByGroup = {
  dashboard: dashboard.length,
  demos: demos.length,
  examples: examples.length,
  profile: profile.length,
  system: system.length,
}
