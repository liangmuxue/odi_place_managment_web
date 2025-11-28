/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const videoManagement = {
  path: '/videoManagement',
  component: Layout,
  redirect: '/videoManagement',
  name: 'VideoManagement',
  meta: {
    title: '视频管理',
    icon: 'videoManagement'
  },
  children: [{
      path: 'liveVideo',
      component: () => import('@/views/videoManagement/liveVideo/index'),
      name: 'LiveVideo',
      meta: {
        title: '实时视频',
        icon: 'liveVideo',
        keepAlive: false,
      },
    },
    {
      path: 'videoReplay',
      component: () => import('@/views/videoManagement/videoReplay/index'),
      name: 'VideoReplay',
      meta: {
        title: '视频回放',
        icon: 'videoReplay'
      }
    },
  ]
}

export default videoManagement
