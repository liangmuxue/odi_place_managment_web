import request from '@/utils/request'

//道闸管理分页
export function gateList(data) {
  return request({
    url: '/system/gate/list',
    method: 'get',
    params: data

  })
}
//道闸详情
export function gateGetInfo(data) {
  return request({
    url: '/system/gate/getInfo',
    method: 'get',
    params: data

  })
}
//删除道闸
export function gateDelete(data) {
  return request({
    url: '/system/gate/' + data,
    method: 'post',
  })
}
//新增道闸
export function gateAdd(data) {
  return request({
    url: '/system/gate',
    method: 'post',
    data
  })
}

//编辑道闸
export function gateUpdate(data) {
  return request({
    url: '/system/gate/update',
    method: 'post',
    data
  })
}
//字段重复校验
export function gateCheckFive(data) {
  return request({
    url: '/system/gate/checkFive',
    method: 'post',
    data
  })
}
//道闸日志分页
export function logList(data) {
  return request({
    url: '/system/log/list',
    method: 'get',
    params: data

  })
}
//道闸日志导出
export function logExport(data) {
  return request({
    url: '/system/log/export',
    method: 'get',
    params: data,
    responseType: 'blob' // 表明返回服务器返回的数据类型

  })
}
//远程开闸
export function openGate(data) {
  return request({
    url: '/system/gate/openGate',
    method: 'post',
    data
  })
}
//监控设备分页
export function SsBaseDeviceList(data) {
  return request({
    url: '/system/SsBaseDevice/list',
    method: 'get',
    params: data

  })
}
//监控设备添加前校验参数
export function checkSsBaseDevice(data) {
  return request({
    url: '/system/SsBaseDevice/checkSsBaseDevice',
    method: 'post',
    data
  })
}
//监控设备添加设备
export function addEquipment(data) {
  return request({
    url: '/system/equipment',
    method: 'post',
    data
  })
}
//获取网关
export function ssBaseGateway(data) {
  return request({
    url: '/system/gateway/ssBaseGateway',
    method: 'post',
    data
  })
}
//监控设备编辑设备
export function SsBaseDeviceUpdate(data) {
  return request({
    url: '/system/SsBaseDevice/update',
    method: 'post',
    data
  })
}
//监控设备详情
export function SsBaseDeviceGetInfo(data) {
  return request({
    url: '/system/SsBaseDevice/getInfo',
    method: 'get',
    params: data

  })
}
//删除监控设备
export function SsBaseDevice(data) {
  return request({
    url: '/system/SsBaseDevice/' + data,
    method: 'post',
  })
}
