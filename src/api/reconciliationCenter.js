import request from '@/utils/request'

//用户充值分页
export function rechargeList(data) {
  return request({
    url: 'system/recharge/list',
    method: 'get',
    params: data

  })
}
//用户充值导出
export function rechargeExpor(data) {
  return request({
    url: '/system/recharge/export',
    method: 'get',
    params: data,
    responseType: 'blob' // 表明返回服务器返回的数据类型

  })
}
//停车缴费分页
export function orderPageList(data) {
  return request({
    url: 'system/order/pageList',
    method: 'get',
    params: data

  })
}
//停车缴费导出
export function orderExport(data) {
  return request({
    url: '/system/order/export',
    method: 'get',
    params: data,
    responseType: 'blob' // 表明返回服务器返回的数据类型

  })
}
//月租记录分页
export function recordPageList(data) {
  return request({
    url: 'system/record/pageList',
    method: 'get',
    params: data

  })
}
//月租记录导出
export function recordExport(data) {
  return request({
    url: '/system/record/export',
    method: 'get',
    params: data,
    responseType: 'blob' // 表明返回服务器返回的数据类型

  })
}
