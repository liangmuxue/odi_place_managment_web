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
