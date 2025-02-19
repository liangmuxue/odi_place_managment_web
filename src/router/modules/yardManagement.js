/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const yardManagement = {
  path: '/yardManagement',
  component: Layout,
  redirect: '/yardManagement',
  name: 'YardManagement',
  meta: {
    title: '车场管理',
    icon: 'yardManagement'
  },
  children: [{
      path: 'parkingManagement',
      component: () => import('@/views/yardManagement/parkingManagement/index'),
      name: 'ParkingManagement',
      meta: {
        title: '车场管理',
        icon: 'yardManagement',
        keepAlive: false
      },
    },
    {
      path: 'berthManagement',
      component: () => import('@/views/yardManagement/berthManagement/index'),
      name: 'BerthManagement',
      meta: {
        title: '泊位管理',
        icon: 'berthManagement',
      }
    },
    {
      path: 'berthStatusMonitoring',
      component: () => import('@/views/yardManagement/berthStatusMonitoring/index'),
      name: 'BerthStatusMonitoring',
      meta: {
        title: '泊位状态监控',
        icon: 'berthStatusMonitoring',
      },
    },
  ]
}

export default yardManagement
