import request from '@/utils/request'

//首页数据统计
export function homepageStatistics(data) {
  return request({
    url: '/system/collectionStatistics/homepageStatistics',
    method: 'get',
    params: data

  })
}
//监控指挥分页
export function monitoringCommandPage(data) {
  return request({
    url: '/system/monitoringCommand/monitoringCommandPage',
    method: 'post',
    data

  })
}
//车场车位平面图数据
export function monitoringCommand(data) {
  return request({
    url: '/system/monitoringCommand/monitoringCommand',
    method: 'post',
    data

  })
}
//路上的车辆信息
export function vehicleInformationOnRoad(data) {
  return request({
    url: '/system/monitoringCommand/vehicleInformationOnRoad',
    method: 'post',
    data
  })
}
//获取车牌号入场时间
export function licensePlate(data) {
  return request({
    url: '/system/monitoringCommand/licensePlate',
    method: 'post',
    data
  })
}
//车辆驻留
export function vehicleRetention(data) {
  return request({
    url: '/system/retention/vehicleRetention',
    method: 'get',
    params: data
  })
}
//设备树形列表
export function deviceListTree(data) {
  return request({
    url: '/system/monitoringCommand/deviceListTree',
    method: 'post',
    data

  })
}
