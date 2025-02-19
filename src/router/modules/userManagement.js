/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const userManagement = {
  path: '/userManagement',
  component: Layout,
  redirect: '/userManagement/index',
  children: [
    {
      path: 'index',
      component: () => import('@/views/userManagement/index'),
      name: 'UserManagement',
      meta: { title: '用户管理',icon: 'userManagement' }
    }
  ]
}

export default userManagement
