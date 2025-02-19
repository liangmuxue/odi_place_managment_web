/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const systemSettings = {
  path: '/systemSettings',
  component: Layout,
  redirect: '/systemSettings',
  name: 'SystemSettings',
  meta: {
    title: '系统设置',
    icon: 'systemSettings'
  },
  children: [{
      path: 'userManagement',
      component: () => import('@/views/systemSettings/userManagement/index'),
      name: 'UserManagement',
      meta: {
        title: '用户管理',
        icon: 'userManagement',
        keepAlive: false
      },
    },
    {
      path: 'rolesManagement',
      component: () => import('@/views/systemSettings/rolesManagement/index'),
      name: 'RolesManagement',
      meta: {
        title: '角色管理',
        icon: 'rolesManagement'
      }
    },
  ]
}

export default systemSettings
