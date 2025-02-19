/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const homePage = {
  path: '/',
  component: Layout,
  redirect: '/homePage',
  children: [{
    path: 'homePage',
    component: () => import('@/views/homePage/index'),
    name: 'HomePage',
    meta: {
      title: '首页',
      icon: 'homePage'
    }
  }]
}

export default homePage
