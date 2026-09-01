import { DashboardOutlined } from '@ant-design/icons'

import { defineAdminFeature } from '~/core/admin-feature'

export default defineAdminFeature({
  descriptionKey: 'page.workspace.description',
  group: 'dashboard',
  icon: DashboardOutlined,
  loadPage: () => import('./page'),
  order: 20,
  path: '/dashboard/workspace',
  titleKey: 'menu.workspace',
})
