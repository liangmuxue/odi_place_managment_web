/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const merchantManagement = {
  path: '/merchantManagement',
  component: Layout,
  redirect: '/merchantManagement',
  name: 'MerchantManagement',
  meta: {
    title: '商户管理',
    icon: 'merchantManagement'
  },
  children: [{
      path: 'merchantList',
      component: () => import('@/views/merchantManagement/merchantList/index'),
      name: 'MerchantList',
      meta: {
        title: '商户列表',
        icon: 'merchantList',
        keepAlive: false
      },
    },
    {
      path: 'merchantRechargeRecord',
      component: () => import('@/views/merchantManagement/merchantRechargeRecord/index'),
      name: 'MerchantRechargeRecord',
      meta: {
        title: '充值记录',
        icon: 'merchantRechargeRecord',
        keepAlive: false
      },
    },
    {
      path: 'merchantRefundRecord',
      component: () => import('@/views/merchantManagement/merchantRefundRecord/index'),
      name: 'MerchantRefundRecord',
      meta: {
        title: '退费记录',
        icon: 'merchantRefundRecord',
        keepAlive: false
      },
    },
    {
      path: 'merchantDeductionRules',
      component: () => import('@/views/merchantManagement/merchantDeductionRules/index'),
      name: 'MerchantDeductionRules',
      meta: {
        title: '抵扣规则',
        icon: 'merchantDeductionRules'
      },
    },
    {
      path: 'merchantDeductAndIssue',
      component: () => import('@/views/merchantManagement/merchantDeductAndIssue/index'),
      name: 'MerchantDeductAndIssue',
      meta: {
        title: '抵扣发放',
        icon: 'merchantDeductAndIssue'
      },
    },
    {
      path: 'merchantDistributionRecord',
      component: () => import('@/views/merchantManagement/merchantDistributionRecord/index'),
      name: 'MerchantDistributionRecord',
      meta: {
        title: '发放记录',
        icon: 'merchantDistributionRecord'
      },
    },
    {
      path: 'merchantDeductionRecord',
      component: () => import('@/views/merchantManagement/merchantDeductionRecord/index'),
      name: 'MerchantDeductionRecord',
      meta: {
        title: '抵扣记录',
        icon: 'merchantDeductionRecord'
      },
    },
  ]
}

export default merchantManagement
