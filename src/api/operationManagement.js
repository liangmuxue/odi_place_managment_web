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

//申诉时查是否有认证的
export function listByVehicle(data) {
  return request({
    url: 'system/certification/listByVehicle',
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
//月租车辆审核/批量审核
export function vehiclesToExamine(data) {
  return request({
    url: 'system/vehicles/toExamine',
    method: 'post',
    data

  })
}
//出入记录分页
export function vehicleEntryList(data) {
  return request({
    url: 'system/vehicleEntry/list',
    method: 'post',
    data

  })
}
//出入记录导出
export function vehicleEntryExport(data) {
  return request({
    url: '/system/vehicleEntry/export',
    method: 'post',
    data,
    responseType: 'blob' // 表明返回服务器返回的数据类型

  })
}
//出入记录详情
export function vehicleEntryDetail(data) {
  return request({
    url: '/system/vehicleEntry/detail',
    method: 'post',
    data

  })
}
//删除出入记录
export function vehicleEntryDelete(data) {
  return request({
    url: '/system/vehicleEntry/delete',
    method: 'post',
    data

  })
}
//出入记录批量删除
export function vehicleEntryDeleteBatch(data) {
  return request({
    url: '/system/vehicleEntry/deleteBatch',
    method: 'post',
    data

  })
}
//修改车牌
export function vehicleEntryUpdatePlate(data) {
  return request({
    url: '/system/vehicleEntry/updatePlate',
    method: 'post',
    data

  })
}
//手动开闸分页
export function manualSwitchRecordList(data) {
  return request({
    url: 'system/manualSwitchRecord/list',
    method: 'get',
    params: data

  })
}
//手动开闸导出
export function manualSwitchRecordExport(data) {
  return request({
    url: '/system/manualSwitchRecord/export',
    method: 'get',
    params: data,
    responseType: 'blob' // 表明返回服务器返回的数据类型

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
//临停批量修改
export function ruleTemporaryParkingUpdate(data) {
  return request({
    url: 'system/ruleTemporaryParking/update',
    method: 'post',
    data

  })
}

//优惠规则分页查询
export function rulePreferentialPage(data) {
  return request({
    url: 'system/rulePreferential/page',
    method: 'post',
    data

  })
}
//优惠规则检查规则名是否重复
export function rulePreferentialCheckName(data) {
  return request({
    url: 'system/rulePreferential/checkName',
    method: 'post',
    data

  })
}
//优惠规则详情
export function rulePreferentialDetail(data) {
  return request({
    url: 'system/rulePreferential/detail',
    method: 'post',
    data

  })
}
//优惠规则新增
export function rulePreferentialInsert(data) {
  return request({
    url: 'system/rulePreferential/insert',
    method: 'post',
    data

  })
}
//优惠规则批量删除
export function rulePreferentialdeleteBatch(data) {
  return request({
    url: 'system/rulePreferential/deleteBatch',
    method: 'post',
    data

  })
}
//优惠规则修改
export function rulePreferentialUpdate(data) {
  return request({
    url: 'system/rulePreferential/update',
    method: 'post',
    data

  })
}
//优惠规则切换禁用状态
export function rulePreferentialSwitchBan(data) {
  return request({
    url: 'system/rulePreferential/switchBan',
    method: 'post',
    data

  })
}
//意见反馈分页查询
export function feedbcakList(data) {
  return request({
    url: 'system/feedbcak/list',
    method: 'post',
    data

  })
}
//意见反馈回复
export function feedbcakReply(data) {
  return request({
    url: 'system/feedbcak/reply',
    method: 'post',
    data

  })
}
//意见反馈详情
export function feedbcakDetail(data) {
  return request({
    url: 'system/feedbcak/detail',
    method: 'post',
    data

  })
}
//小程序资讯分页
export function consultList(data) {
  return request({
    url: 'system/consult/list',
    method: 'get',
    params: data
  })
}
//consultAdd
export function consultAdd(data) {
  return request({
    url: 'system/consult',
    method: 'post',
    data

  })
}
//小程序资讯修改
export function consultUpdate(data) {
  return request({
    url: 'system/consult/update',
    method: 'post',
    data

  })
}
//小程序资讯详情
export function consultGetInfo(data) {
  return request({
    url: 'system/consult/getInfo',
    method: 'get',
    params: data
  })
}

//小程序资讯删除
export function consultDel(data) {
  return request({
    url: '/system/consult/' + data,
    method: 'post',
  })
}
//小程序页面列表
export function htmlList(data) {
  return request({
    url: 'system/html/list',
    method: 'get',
    params: data
  })
}
