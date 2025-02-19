/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const equipmentManagement = {
  path: '/equipmentManagement',
  component: Layout,
  redirect: '/equipmentManagement',
  name: 'EquipmentManagement',
  meta: {
    title: '设备管理',
    icon: 'equipmentManagement'
  },
  children: [{
      path: 'barrierGateManagement',
      component: () => import('@/views/equipmentManagement/barrierGateManagement/index'),
      name: 'BarrierGateManagement',
      meta: {
        title: '道闸管理',
        icon: 'manualSwitchRecord',
        keepAlive: false,
      },
    },
    {
      path: 'barrierGateLog',
      component: () => import('@/views/equipmentManagement/barrierGateLog/index'),
      name: 'BarrierGateLog',
      meta: {
        title: '道闸日志',
        icon: 'longTermRentalRules'
      }
    },
  ]
}

export default equipmentManagement
