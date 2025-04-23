import request from '@/utils/request'

//停车场列表
export function parkingList(data) {
  return request({
    url: '/system/lot/list',
    method: 'get',
    params: data

  })
}

//停车场详情
export function parkingInfo(data) {
  return request({
    url: '/system/lot/getInfo',
    method: 'get',
    params: data

  })
}

//地址树
export function treeList() {
  return request({
    url: '/system/area/treeList',
    method: 'get',
  })
}

//停车场名称校验
export function checkName(data) {
  return request({
    url: '/system/lot/checkName',
    method: 'post',
    data
  })
}

//新增停车场
export function parkingAdd(data) {
  return request({
    url: '/system/lot',
    method: 'post',
    data
  })
}

//编辑停车场
export function parkingUpadte(data) {
  return request({
    url: '/system/lot/update',
    method: 'post',
    data
  })
}

//删除停车场
export function parkingDelete(data) {
  return request({
    url: '/system/lot/' + data,
    method: 'post',
  })
}

//车位分页
export function parkingSpaceList(data) {
  return request({
    url: '/system/parkingSpace/list',
    method: 'post',
    data

  })
}

//删除泊位
export function parkingSpaceBatchDelete(data) {
  return request({
    url: '/system/parkingSpace/batchDelete',
    method: 'post',
    data

  })
}

//检查地磁ID和车位ID
export function parkingSpaceCheckId(data) {
  return request({
    url: '/system/parkingSpace/checkId',
    method: 'post',
    data

  })
}

//新增车位
export function parkingSpaceInsert(data) {
  return request({
    url: '/system/parkingSpace/insert',
    method: 'post',
    data

  })
}

//编辑车位
export function parkingSpaceUpdate(data) {
  return request({
    url: '/system/parkingSpace/update',
    method: 'post',
    data

  })
}

//获取单个车位信息
export function parkingSpaceDetail(data) {
  return request({
    url: '/system/parkingSpace/detail',
    method: 'post',
    data

  })
}

//状态监控列表
export function monitorSpace(data) {
  return request({
    url: '/system/lot/monitorSpace',
    method: 'post',
    data

  })
}
//获取车场下拉框
export function lotSelect() {
  return request({
    url: '/system/lot/select',
    method: 'get',

  })
}
//获取长租规则
export function ruleParkingLeasesListNoPage() {
  return request({
    url: '/system/ruleParkingLeases/listNoPage',
    method: 'get',

  })
}
//获取临停规则
export function ruleTemporaryParkingList(data) {
  return request({
    url: '/system/ruleTemporaryParking/list',
    method: 'POST',
    data
  })
}
