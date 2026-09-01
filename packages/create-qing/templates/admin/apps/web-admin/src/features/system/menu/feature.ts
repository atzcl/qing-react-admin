import { MenuOutlined } from '@ant-design/icons'

import { defineAdminFeature } from '~/core/admin-feature'

export default defineAdminFeature({
  descriptionKey: 'page.menus.description',
  group: 'system',
  icon: MenuOutlined,
  loadPage: () => import('./page'),
  order: 30,
  path: '/system/menu',
  titleKey: 'menu.menus',
})
