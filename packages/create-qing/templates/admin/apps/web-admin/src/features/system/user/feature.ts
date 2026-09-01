import { UserOutlined } from '@ant-design/icons'

import { defineAdminFeature } from '~/core/admin-feature'

export default defineAdminFeature({
  descriptionKey: 'page.users.description',
  group: 'system',
  icon: UserOutlined,
  loadPage: () => import('./page'),
  order: 10,
  path: '/system/user',
  titleKey: 'menu.users',
})
