import { ApartmentOutlined } from '@ant-design/icons'

import { defineAdminFeature } from '~/core/admin-feature'

export default defineAdminFeature({
  descriptionKey: 'page.departments.description',
  group: 'system',
  icon: ApartmentOutlined,
  loadPage: () => import('./page'),
  order: 40,
  path: '/system/dept',
  titleKey: 'menu.departments',
})
