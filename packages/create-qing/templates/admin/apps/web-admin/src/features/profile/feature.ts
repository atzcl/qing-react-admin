import { UserOutlined } from '@ant-design/icons'

import { defineAdminFeature } from '~/core/admin-feature'

export default defineAdminFeature({
  descriptionKey: 'page.profile.description',
  group: 'utility',
  hideInMenu: true,
  icon: UserOutlined,
  loadPage: () => import('./page'),
  path: '/profile',
  titleKey: 'menu.profile',
})
