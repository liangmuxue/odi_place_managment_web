import request from '@/utils/request'
//限免车列表
export function vehicleWaiverList(data) {
  return request({
    url: 'system/vehicleWaiver/list',
    method: 'post',
    data
  })
}
//限免车新增
export function vehicleWaiverInsert(data) {
  return request({
    url: 'system/vehicleWaiver/insert',
    method: 'post',
    data

  })
}
//限免车牌重复校验
export function vehicleWaiverCheckPlate(data) {
  return request({
    url: 'system/vehicleWaiver/checkPlate',
    method: 'post',
    data

  })
}
//限免车修改
export function vehicleWaiverUpdate(data) {
  return request({
    url: 'system/vehicleWaiver/update',
    method: 'post',
    data

  })
}
//限免车详情
export function vehicleWaiverDetail(data) {
  return request({
    url: 'system/vehicleWaiver/detail',
    method: 'post',
    data

  })
}
//限免车批量删除
export function vehicleWaiverBatchDelete(data) {
  return request({
    url: 'system/vehicleWaiver/batchDelete',
    method: 'post',
    data

  })
}


//白名单列表
export function vehicleWhiteList(data) {
  return request({
    url: 'system/vehicleWhitelist/list',
    method: 'post',
    data
  })
}
//白名单新增
export function vehicleWhitelistInsert(data) {
  return request({
    url: 'system/vehicleWhitelist/insert',
    method: 'post',
    data

  })
}
//白名单牌重复校验
export function vehicleWhitelistCheckPlate(data) {
  return request({
    url: 'system/vehicleWhitelist/checkPlate',
    method: 'post',
    data

  })
}
//白名单修改
export function vehicleWhitelistUpdate(data) {
  return request({
    url: 'system/vehicleWhitelist/update',
    method: 'post',
    data

  })
}
//白名单详情
export function vehicleWhitelistDetail(data) {
  return request({
    url: 'system/vehicleWhitelist/detail',
    method: 'post',
    data

  })
}
//白名单批量删除
export function vehicleWhitelistBatchDelete(data) {
  return request({
    url: 'system/vehicleWhitelist/deleteBatch',
    method: 'post',
    data

  })
}
//黑名单列表
export function vehicleBlacklist(data) {
  return request({
    url: 'system/vehicleBlacklist/list',
    method: 'post',
    data
  })
}
//黑名单新增
export function vehicleBlacklistInsert(data) {
  return request({
    url: 'system/vehicleBlacklist/insert',
    method: 'post',
    data

  })
}
//黑名单牌重复校验
export function vehicleBlacklistCheckPlate(data) {
  return request({
    url: 'system/vehicleBlacklist/checkPlate',
    method: 'post',
    data

  })
}
//黑名单修改
export function vehicleBlacklistUpdate(data) {
  return request({
    url: 'system/vehicleBlacklist/update',
    method: 'post',
    data

  })
}
//黑名单详情
export function vehicleBlacklistDetail(data) {
  return request({
    url: 'system/vehicleBlacklist/detail',
    method: 'post',
    data

  })
}
//黑名单批量删除
export function vehicleBlacklistBatchDelete(data) {
  return request({
    url: 'system/vehicleBlacklist/deleteBatch',
    method: 'post',
    data

  })
}
