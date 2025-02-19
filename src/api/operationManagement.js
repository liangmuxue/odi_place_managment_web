import request from '@/utils/request'
//小程序角色列表
export function wxUserList(data) {
  return request({
    url: 'system/wxUser/list',
    method: 'post',
    data
  })
}
//小程序角色详情
export function wxUserDetail(data) {
  return request({
    url: 'system/wxUser/detail',
    method: 'post',
    data

  })
}
//绑定车辆列表
export function systemVehiclePage(data) {
  return request({
    url: 'system/vehicle/page',
    method: 'post',
    data

  })
}
//绑定车辆详情
export function systemVehicleDetail(data) {
  return request({
    url: 'system/vehicle/detail',
    method: 'post',
    data

  })
}
//取消绑定车辆
export function systemVehicleUnbinding(data) {
  return request({
    url: 'system/vehicle/unbinding',
    method: 'post',
    data

  })
}
//车辆认证分页查询
export function certificationList(data) {
  return request({
    url: 'system/certification/list',
    method: 'get',
    params: data

  })
}
//车辆认证详情
export function certificationGetInfo(data) {
  return request({
    url: 'system/certification/getInfo',
    method: 'get',
    params: data

  })
}
//车辆人证审批
export function certificationAudit(data) {
  return request({
    url: 'system/certification/audit',
    method: 'post',
    data

  })
}
//通过车牌号查原绑定手机号
export function getPhoneByVehicle(data) {
  return request({
    url: 'system/certification/getPhoneByVehicle',
    method: 'get',
    params: data
  })
}

//月租车辆列表
export function vehiclesList(data) {
  return request({
    url: 'system/vehicles/list',
    method: 'get',
    params: data

  })
}
//月租车辆详情
export function vehiclesGetInfo(data) {
  return request({
    url: 'system/vehicles/getInfo',
    method: 'get',
    params: data

  })
}
//月租车辆启停/批量启停
export function vehiclesUpdate(data) {
  return request({
    url: 'system/vehicles/update',
    method: 'post',
    data

  })
}
//长租分页查询
export function ruleParkingLeasesList(data) {
  return request({
    url: 'system/ruleParkingLeases/list',
    method: 'post',
    data

  })
}
//长租规则新增
export function ruleParkingLeasesInsert(data) {
  return request({
    url: 'system/ruleParkingLeases/insert',
    method: 'post',
    data

  })
}
//长租规则编辑
export function ruleParkingLeasesUpdate(data) {
  return request({
    url: 'system/ruleParkingLeases/update',
    method: 'post',
    data

  })
}
//长租规则检查规则名是否存在
export function ruleParkingLeasesCheckName(data) {
  return request({
    url: 'system/ruleParkingLeases/checkName',
    method: 'post',
    data

  })
}
//长租规则详情
export function ruleParkingLeasesDetail(data) {
  return request({
    url: 'system/ruleParkingLeases/detail',
    method: 'post',
    data

  })
}
//长租规则批量删除
export function ruleParkingLeasesDeleteBath(data) {
  return request({
    url: 'system/ruleParkingLeases/deleteBath',
    method: 'post',
    data

  })
}
//临停分页查询
export function ruleTemporaryParkingPage(data) {
  return request({
    url: 'system/ruleTemporaryParking/page',
    method: 'post',
    data

  })
}
//临停检查规则名是否重复
export function ruleTemporaryParkingCheckName(data) {
  return request({
    url: 'system/ruleTemporaryParking/checkName',
    method: 'post',
    data

  })
}
//临停详情
export function ruleTemporaryParkingDetail(data) {
  return request({
    url: 'system/ruleTemporaryParking/detail',
    method: 'post',
    data

  })
}
//临停新增
export function ruleTemporaryParkingInsert(data) {
  return request({
    url: 'system/ruleTemporaryParking/insert',
    method: 'post',
    data

  })
}
//临停批量删除
export function ruleTemporaryParkingdeleteBatch(data) {
  return request({
    url: 'system/ruleTemporaryParking/deleteBatch',
    method: 'post',
    data

  })
}
//临停批量删除
export function ruleTemporaryParkingUpdate(data) {
  return request({
    url: 'system/ruleTemporaryParking/update',
    method: 'post',
    data

  })
}
