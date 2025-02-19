/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const statisticalAnalysis = {
  path: '/statisticalAnalysis',
  component: Layout,
  redirect: '/statisticalAnalysis',
  name: 'YardManagement',
  meta: {
    title: '统计分析',
    icon: 'statisticalAnalysis'
  },
  children: [{
    path: 'dataReport',
    component: () => import('@/views/statisticalAnalysis/dataReport/index'),
    name: 'DataReport',
    meta: {
      title: '数据报表',
      keepAlive: false
    },
  }, ]
}

export default statisticalAnalysis
