/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const actionLog = {
  path: '/actionLog',
  component: Layout,
  redirect: '/actionLog/index',
  children: [
    {
      path: 'index',
      component: () => import('@/views/actionLog/index'),
      name: 'ActionLog',
      meta: { title: '系统日志',icon: 'actionLog' }
    }
  ]
}

export default actionLog
