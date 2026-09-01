import { TeamOutlined } from '@ant-design/icons'

import { defineAdminFeature } from '~/core/admin-feature'

export default defineAdminFeature({
  descriptionKey: 'page.roles.description',
  group: 'system',
  icon: TeamOutlined,
  loadPage: () => import('./page'),
  order: 20,
  path: '/system/role',
  titleKey: 'menu.roles',
})
