import { AreaChartOutlined } from '@ant-design/icons'

import { defineAdminFeature } from '~/core/admin-feature'

export default defineAdminFeature({
  affix: true,
  descriptionKey: 'page.analytics.description',
  group: 'dashboard',
  icon: AreaChartOutlined,
  loadPage: () => import('./page'),
  order: 10,
  path: '/dashboard/analytics',
  titleKey: 'menu.analytics',
})
