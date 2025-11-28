/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const operationManagement = {
  path: '/operationManagement',
  component: Layout,
  redirect: '/operationManagement',
  name: 'OperationManagement',
  meta: {
    title: '运营管理',
    icon: 'operationManagement'
  },
  children: [{
      path: 'weChatUsers',
      component: () => import('@/views/operationManagement/weChatUsers/index'),
      name: 'WeChatUsers',
      meta: {
        title: '小程序用户',
        icon: 'weChatUsers',
        keepAlive: false
      },
    },
    {
      path: 'bindVehicle',
      component: () => import('@/views/operationManagement/bindVehicle/index'),
      name: 'BindVehicle',
      meta: {
        title: '绑定车辆',
        icon: 'bindVehicle',
        keepAlive: false
      },
    },
    {
      path: 'vehicleCertificationAudit',
      component: () => import('@/views/operationManagement/vehicleCertificationAudit/index'),
      name: 'VehicleCertificationAudit',
      meta: {
        title: '车辆认证审核',
        icon: 'vehicleCertificationAudit',
        keepAlive: false
      },
    },
    // {
    //   path: 'monthlyRentalCarReview',
    //   component: () => import('@/views/operationManagement/monthlyRentalCarReview/index'),
    //   name: 'MonthlyRentalCarReview',
    //   meta: {
    //     title: '月租车审核',
    //     icon: 'monthlyRentalCarReview',
    //   }
    // },
    {
      path: 'monthlyRentalCarManagement',
      component: () => import('@/views/operationManagement/monthlyRentalCarManagement/index'),
      name: 'MonthlyRentalCarManagement',
      meta: {
        title: '长租车辆审核',
        icon: 'specificVehicleManagement'
      },
    },
    {
      path: 'refundApplicationReview',
      component: () => import('@/views/operationManagement/refundApplicationReview/index'),
      name: 'RefundApplicationReview',
      meta: {
        title: '退款申请审核',
        icon: 'refundRecord'
      },
    },
    {
      path: 'vehicleEntryAndExitRecords',
      component: () => import('@/views/operationManagement/vehicleEntryAndExitRecords/index'),
      name: 'VehicleEntryAndExitRecords',
      meta: {
        title: '车辆出入记录',
        icon: 'vehicleEntryAndExitRecords'
      },
    },
    {
      path: 'manualSwitchRecord',
      component: () => import('@/views/operationManagement/manualSwitchRecord/index'),
      name: 'ManualSwitchRecord',
      meta: {
        title: '手动开关闸记录',
        icon: 'manualSwitchRecord'
      },
    },
    {
      path: 'longTermRentalRules',
      component: () => import('@/views/operationManagement/longTermRentalRules/index'),
      name: 'LongTermRentalRules',
      meta: {
        title: '长租规则',
        icon: 'longTermRentalRules'

      },
    },
    {
      path: 'feeRules',
      component: () => import('@/views/operationManagement/feeRules/index'),
      name: 'FeeRules',
      meta: {
        title: '临停规则',
        icon: 'feeRules'
      },
    },
    {
      path: 'discountRules',
      component: () => import('@/views/operationManagement/discountRules/index'),
      name: 'DiscountRules',
      meta: {
        title: '优惠活动',
        icon: 'discountRules'

      },
    },
    {
      path: 'miniProgramInformation',
      component: () => import('@/views/operationManagement/miniProgramInformation/index'),
      name: 'MiniProgramInformation',
      meta: {
        title: '小程序资讯',
        icon: 'miniProgramInformation'
      },
    },
    {
      path: 'feedback',
      component: () => import('@/views/operationManagement/feedback/index'),
      name: 'Feedback',
      meta: {
        title: '意见反馈',
        icon: 'feedback'
      },
    },
  ]
}

export default operationManagement
