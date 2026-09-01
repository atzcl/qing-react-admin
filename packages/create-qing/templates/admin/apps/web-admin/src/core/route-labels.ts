import type { LocalizedPageLabel } from './types'

type RouteLabelOverride = Omit<LocalizedPageLabel, 'zh-CN'>

/** Route labels are path keyed so renamed or missing routes fail loudly. */
const pageLabelOverrides = {
  '/demos/access/admin-visible': { 'en-US': 'Visible to Admin', 'zh-TW': 'Admin 可見' },
  '/demos/access/button-control': { 'en-US': 'Button Control', 'zh-TW': '按鈕控制' },
  '/demos/access/menu-visible-403': {
    'en-US': 'Menu Visible(403)',
    'zh-TW': '選單可見(403)',
  },
  '/demos/access/page-control': { 'en-US': 'Page Access', 'zh-TW': '頁面訪問' },
  '/demos/access/super-visible': { 'en-US': 'Visible to Super', 'zh-TW': 'Super 可見' },
  '/demos/access/user-visible': { 'en-US': 'Visible to User', 'zh-TW': 'User 可見' },
  '/demos/active-icon/children': {
    'en-US': 'Children Active Icon',
    'zh-TW': '子級啟用圖示',
  },
  '/demos/badge/color': { 'en-US': 'Badge Color', 'zh-TW': '徽標顏色' },
  '/demos/badge/dot': { 'en-US': 'Dot Badge', 'zh-TW': '點徽標' },
  '/demos/badge/text': { 'en-US': 'Text Badge', 'zh-TW': '文本徽標' },
  '/demos/breadcrumb/lateral': { 'en-US': 'Lateral Mode', 'zh-TW': '平級模式' },
  '/demos/breadcrumb/lateral-detail': {
    'en-US': 'Lateral Mode Detail',
    'zh-TW': '平級模式詳情',
  },
  '/demos/breadcrumb/level/detail': {
    'en-US': 'Level Mode Detail',
    'zh-TW': '層級模式詳情',
  },
  '/demos/fallback/403': { 'en-US': '403', 'zh-TW': '403' },
  '/demos/fallback/404': { 'en-US': '404', 'zh-TW': '404' },
  '/demos/fallback/500': { 'en-US': '500', 'zh-TW': '500' },
  '/demos/fallback/offline': { 'en-US': 'Offline Page', 'zh-TW': '離線頁面' },
  '/demos/features/clipboard': { 'en-US': 'Clipboard', 'zh-TW': '剪貼簿' },
  '/demos/features/detail/:id': { 'en-US': 'Tab Detail Page', 'zh-TW': '標籤詳情頁' },
  '/demos/features/file-download': { 'en-US': 'File Download', 'zh-TW': '檔案下載' },
  '/demos/features/full-screen': { 'en-US': 'FullScreen', 'zh-TW': '全屏' },
  '/demos/features/hide-menu-children': {
    'en-US': 'Hide Menu Children',
    'zh-TW': '隱藏子選單',
  },
  '/demos/features/hide-menu-children/children': {
    'en-US': 'Hide Menu Children',
    'zh-TW': '隱藏子選單',
  },
  '/demos/features/icons': { 'en-US': 'Icons', 'zh-TW': '圖示' },
  '/demos/features/json-bigint': { 'en-US': 'JSON BigInt', 'zh-TW': 'JSON BigInt' },
  '/demos/features/login-expired': { 'en-US': 'Login Expired', 'zh-TW': '登入過期' },
  '/demos/features/menu-query': { 'en-US': 'Menu With Query', 'zh-TW': '帶參選單' },
  '/demos/features/new-window': { 'en-US': 'Open in New Window', 'zh-TW': '新視窗開啟' },
  '/demos/features/preferences-extension': {
    'en-US': 'Preferences Extension',
    'zh-TW': '偏好擴充套件示例',
  },
  '/demos/features/request-params-serializer': {
    'en-US': 'Request Params Serializer',
    'zh-TW': '引數序列化',
  },
  '/demos/features/tabs': { 'en-US': 'Tabs', 'zh-TW': '標籤頁' },
  '/demos/features/tanstack-query': { 'en-US': 'Tanstack Query', 'zh-TW': 'Tanstack Query' },
  '/demos/features/watermark': { 'en-US': 'Watermark', 'zh-TW': '水印' },
  '/demos/nested/menu1': { 'en-US': 'Menu 1', 'zh-TW': '選單 1' },
  '/demos/nested/menu2/menu2-1': { 'en-US': 'Menu 2-1', 'zh-TW': '選單 2-1' },
  '/demos/nested/menu3/menu3-1': { 'en-US': 'Menu 3-1', 'zh-TW': '選單 3-1' },
  '/demos/nested/menu3/menu3-2/menu3-2-1': {
    'en-US': 'Menu 3-2-1',
    'zh-TW': '選單 3-2-1',
  },
  '/demos/outside/external-link/vite': { 'en-US': 'Vite', 'zh-TW': 'Vite' },
  '/demos/outside/external-link/react': { 'en-US': 'React', 'zh-TW': 'React' },
  '/demos/outside/iframe/tailwindcss': { 'en-US': 'Tailwindcss', 'zh-TW': 'Tailwindcss' },
  '/demos/outside/iframe/react-document': { 'en-US': 'React', 'zh-TW': 'React' },
  '/examples/button-group': { 'en-US': 'Button Group', 'zh-TW': '按鈕組' },
  '/examples/captcha/point-selection': {
    'en-US': 'Point Selection Captcha',
    'zh-TW': '點選驗證',
  },
  '/examples/captcha/slider': { 'en-US': 'Slider Captcha', 'zh-TW': '滑塊驗證' },
  '/examples/captcha/slider-rotate': { 'en-US': 'Rotate Captcha', 'zh-TW': '旋轉驗證' },
  '/examples/captcha/slider-translate': {
    'en-US': 'Translate Captcha',
    'zh-TW': '拼圖滑塊驗證',
  },
  '/examples/context-menu': { 'en-US': 'Content Menu', 'zh-TW': '上下文選單' },
  '/examples/count-to': { 'en-US': 'CountTo', 'zh-TW': 'CountTo' },
  '/examples/cropper': { 'en-US': 'Cropper', 'zh-TW': '圖片裁剪' },
  '/examples/drawer': { 'en-US': 'Drawer', 'zh-TW': '抽屜' },
  '/examples/ellipsis': { 'en-US': 'EllipsisText', 'zh-TW': '文本省略' },
  '/examples/form/api': { 'en-US': 'Api', 'zh-TW': 'Api' },
  '/examples/form/basic': { 'en-US': 'Basic Form', 'zh-TW': '基礎表單' },
  '/examples/form/collapsible-test': {
    'en-US': 'Collapsible Form Field',
    'zh-TW': '單項表單摺疊',
  },
  '/examples/form/custom': { 'en-US': 'Custom Component', 'zh-TW': '自定義元件' },
  '/examples/form/custom-layout': { 'en-US': 'Custom Layout', 'zh-TW': '自定義佈局' },
  '/examples/form/dynamic': { 'en-US': 'Dynamic Form', 'zh-TW': '動態表單' },
  '/examples/form/label-width': { 'en-US': 'Label Auto Width', 'zh-TW': 'Label 自動寬度' },
  '/examples/form/merge': { 'en-US': 'Merge Form', 'zh-TW': '合併表單' },
  '/examples/form/query': { 'en-US': 'Query Form', 'zh-TW': '查詢表單' },
  '/examples/form/rules': { 'en-US': 'Form Rules', 'zh-TW': '表單校驗' },
  '/examples/form/scroll-to-error-test': {
    'en-US': 'Scroll to Error Field',
    'zh-TW': '滾動到錯誤欄位',
  },
  '/examples/form/value-format': { 'en-US': 'Value Format', 'zh-TW': '值格式化' },
  '/examples/json-viewer': { 'en-US': 'JsonViewer', 'zh-TW': 'JsonViewer' },
  '/examples/layout/col-page': { 'en-US': 'ColPage Layout', 'zh-TW': '雙列布局' },
  '/examples/loading': { 'en-US': 'Loading', 'zh-TW': 'Loading' },
  '/examples/modal': { 'en-US': 'Modal', 'zh-TW': '彈窗' },
  '/examples/motion': { 'en-US': 'Motion', 'zh-TW': 'Motion' },
  '/examples/resize/basic': { 'en-US': 'Resize', 'zh-TW': '拖動調整' },
  '/examples/tippy': { 'en-US': 'Tippy', 'zh-TW': 'Tippy' },
  '/examples/tiptap': { 'en-US': 'Rich Text Editor', 'zh-TW': '富文本編輯器' },
  '/examples/pro-table/basic': { 'en-US': 'Basic Table', 'zh-TW': '基礎表格' },
  '/examples/pro-table/custom-cell': { 'en-US': 'Custom Cell', 'zh-TW': '自定義單元格' },
  '/examples/pro-table/edit-cell': { 'en-US': 'Edit Cell', 'zh-TW': '單元格編輯' },
  '/examples/pro-table/edit-row': { 'en-US': 'Edit Row', 'zh-TW': '行編輯' },
  '/examples/pro-table/fixed': { 'en-US': 'Fixed Header/Column', 'zh-TW': '固定表頭/列' },
  '/examples/pro-table/form': { 'en-US': 'Form Table', 'zh-TW': '搜尋表單' },
  '/examples/pro-table/remote': { 'en-US': 'Remote Load', 'zh-TW': '遠端載入' },
  '/examples/pro-table/tree': { 'en-US': 'Tree Table', 'zh-TW': '樹形表格' },
  '/examples/pro-table/viewed': { 'en-US': 'Row Marker', 'zh-TW': '行標記' },
  '/examples/pro-table/virtual': { 'en-US': 'Virtual Scroll', 'zh-TW': '虛擬滾動' },
  '/form-array-demo': { 'en-US': '表单数组 Demo', 'zh-TW': '表单数组 Demo' },
} satisfies Record<string, RouteLabelOverride>

const folderLabelOverrides = {
  'demos-access': { 'en-US': 'Frontend Permissions', 'zh-TW': '前端許可權' },
  'demos-active-icon': { 'en-US': 'Active Menu Icon', 'zh-TW': '選單啟用圖示' },
  'demos-badge': { 'en-US': 'Menu Badge', 'zh-TW': '選單徽標' },
  'demos-breadcrumb': { 'en-US': 'Breadcrumb Navigation', 'zh-TW': '麵包屑導航' },
  'demos-breadcrumb-level': { 'en-US': 'Level Mode', 'zh-TW': '層級模式' },
  'demos-external': { 'en-US': 'External Link', 'zh-TW': '外鏈' },
  'demos-fallback': { 'en-US': 'Fallback Page', 'zh-TW': '預設頁' },
  'demos-features': { 'en-US': 'Features', 'zh-TW': '功能' },
  'demos-iframe': { 'en-US': 'Embedded', 'zh-TW': '內嵌' },
  'demos-menu2': { 'en-US': 'Menu 2', 'zh-TW': '選單 2' },
  'demos-menu3': { 'en-US': 'Menu 3', 'zh-TW': '選單 3' },
  'demos-menu32': { 'en-US': 'Menu 3-2', 'zh-TW': '選單 3-2' },
  'demos-nested': { 'en-US': 'Nested Menu', 'zh-TW': '巢狀選單' },
  'demos-outside': { 'en-US': 'External Pages', 'zh-TW': '外部頁面' },
  'examples-captcha': { 'en-US': 'Captcha', 'zh-TW': '驗證碼' },
  'examples-form': { 'en-US': 'Form', 'zh-TW': '表單' },
  'examples-table': { 'en-US': 'Pro Table', 'zh-TW': 'Pro 表格' },
} satisfies Record<string, RouteLabelOverride>

function localizedLabel(
  key: string,
  simplifiedChinese: string,
  overrides: Record<string, RouteLabelOverride>,
): LocalizedPageLabel {
  const localized = overrides[key]
  if (!localized) throw new Error(`Missing route locale label: ${key}`)
  return { ...localized, 'zh-CN': simplifiedChinese }
}

export function routeLabel(path: string, simplifiedChinese: string) {
  return localizedLabel(path, simplifiedChinese, pageLabelOverrides)
}

export function folderLabel(key: string, simplifiedChinese: string) {
  return localizedLabel(key, simplifiedChinese, folderLabelOverrides)
}

export const localizedPagePaths = Object.keys(pageLabelOverrides)
