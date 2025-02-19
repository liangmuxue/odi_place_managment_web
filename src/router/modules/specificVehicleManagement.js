/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const specificVehicleManagement = {
  path: '/specificVehicleManagement',
  component: Layout,
  redirect: '/specificVehicleManagement',
  name: 'SpecificVehicleManagement',
  meta: {
    title: '特定车管理',
    icon: 'specificVehicleManagement'
  },
  children: [{
      path: 'freeCodeManagement',
      component: () => import('@/views/specificVehicleManagement/freeCodeManagement/index'),
      name: 'FreeCodeManagement',
      meta: {
        title: '免费码管理',
        icon: 'freeCodeManagement',
        keepAlive: false
      },
    },
    {
      path: 'whiteList',
      component: () => import('@/views/specificVehicleManagement/whiteList/index'),
      name: 'WhiteList',
      meta: {
        title: '白名单',
        icon: 'whiteList'
      }
    },
    {
      path: 'blackList',
      component: () => import('@/views/specificVehicleManagement/blackList/index'),
      name: 'BlackList',
      meta: {
        title: '黑名单',
        icon: 'blackList'
      },
    },
  ]
}

export default specificVehicleManagement
