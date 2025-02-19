/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const reconciliationCenter = {
  path: '/reconciliationCenter',
  component: Layout,
  redirect: '/reconciliationCenter',
  name: 'ReconciliationCenter',
  meta: {
    title: '对账中心',
    icon: 'reconciliationCenter'
  },
  children: [{
      path: 'userRecharge',
      component: () => import('@/views/reconciliationCenter/userRecharge/index'),
      name: 'UserRecharge',
      meta: {
        title: '用户充值',
        icon: 'userRecharge',
        keepAlive: false
      },
    },
    {
      path: 'parkingPayment',
      component: () => import('@/views/reconciliationCenter/parkingPayment/index'),
      name: 'ParkingPayment',
      meta: {
        title: '停车缴费',
        icon: 'parkingPayment',

      }
    },
    {
      path: 'monthlyRentalRecord',
      component: () => import('@/views/reconciliationCenter/monthlyRentalRecord/index'),
      name: 'MonthlyRentalRecord',
      meta: {
        title: '月租记录',
        icon: 'monthlyRentalRecord',

      },
    },
    {
      path: 'refundRecord',
      component: () => import('@/views/reconciliationCenter/refundRecord/index'),
      name: 'RefundRecord',
      meta: {
        title: '退款记录',
        icon: 'refundRecord',

      },
    },
    {
      path: 'discountRecord',
      component: () => import('@/views/reconciliationCenter/discountRecord/index'),
      name: 'DiscountRecord',
      meta: {
        title: '优惠记录',
        icon: 'discountRecord',

      },
    },
    {
      path: 'collectionStatistics',
      component: () => import('@/views/reconciliationCenter/collectionStatistics/index'),
      name: 'CollectionStatistics',
      meta: {
        title: '收款统计',
        icon: 'feeRules',

      },
    },
    {
      path: 'invoicesManagement',
      component: () => import('@/views/reconciliationCenter/invoicesManagement/index'),
      name: 'InvoicesManagement',
      meta: {
        title: '发票管理',
        icon: 'invoicesManagement',

      },
    },
    {
      path: 'outstandingFeesRecord',
      component: () => import('@/views/reconciliationCenter/outstandingFeesRecord/index'),
      name: 'OutstandingFeesRecord',
      meta: {
        title: '欠费记录',
        icon: 'outstandingFeesRecord',
      },
    },
  ]
}

export default reconciliationCenter
