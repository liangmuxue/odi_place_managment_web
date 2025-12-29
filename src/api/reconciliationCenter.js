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
//停车缴费分页(新)
export function pageRecordList(data) {
  return request({
    url: 'system/order/pageRecordList',
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
//停车缴费：导出excel
export function export4RecordList(data) {
  return request({
    url: '/system/order/export4RecordList',
    method: 'get',
    params: data,
    responseType: 'blob' // 表明返回服务器返回的数据类型

  })
}
//停车缴费退款
export function orderRefund(data) {
  return request({
    url: '/system/order/refund',
    method: 'post',
    data,

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
//退款记录分页
export function refundRecordPageList(data) {
  return request({
    url: 'system/refundRecord/pageList',
    method: 'get',
    params: data

  })
}
//退款记录导出
export function refundRecordExport(data) {
  return request({
    url: '/system/refundRecord/export',
    method: 'get',
    params: data,
    responseType: 'blob' // 表明返回服务器返回的数据类型

  })
}
//优惠记录分页
export function discountRecordList(data) {
  return request({
    url: 'system/order/discountRecordList',
    method: 'get',
    params: data

  })
}
//优惠记录导出
export function discountRecordExport(data) {
  return request({
    url: '/system/order/discountRecordExport',
    method: 'get',
    params: data,
    responseType: 'blob' // 表明返回服务器返回的数据类型

  })
}

//收款统计分页
export function collectionStatisticsPageList(data) {
  return request({
    url: 'system/collectionStatistics/pageList',
    method: 'get',
    params: data

  })
}
//收款统计导出
export function collectionStatisticsExport(data) {
  return request({
    url: '/system/collectionStatistics/export',
    method: 'get',
    params: data,
    responseType: 'blob' // 表明返回服务器返回的数据类型

  })
}

//发票管理分页
export function invoicePage(data) {
  return request({
    url: 'system/invoice/page',
    method: 'post',
    data

  })
}


//欠费记录分页
export function arrearsRecordPageList(data) {
  return request({
    url: 'system/arrearsRecord/pageList',
    method: 'get',
    params: data

  })
}
//欠费记录导出
export function arrearsRecordExport(data) {
  return request({
    url: '/system/arrearsRecord/export',
    method: 'get',
    params: data,
    responseType: 'blob' // 表明返回服务器返回的数据类型

  })
}
//欠费记录分页按时间
export function arrearsRecordPageListByTime(data) {
  return request({
    url: 'system/arrearsRecord/pageListByTime',
    method: 'get',
    params: data

  })
}
//欠费记录导出按时间
export function arrearsRecordExportByTime(data) {
  return request({
    url: '/system/arrearsRecord/exportByTime',
    method: 'get',
    params: data,
    responseType: 'blob' // 表明返回服务器返回的数据类型

  })
}
//删除欠费记录
export function arrearsRecordRemoveById(data) {
  return request({
    url: '/system/arrearsRecord/removeById',
    method: 'post',
    data

  })
}
//欠费记录明细
export function arrearsRecordGetInfo(data) {
  return request({
    url: '/system/arrearsRecord/getInfo',
    method: 'get',
    params: data
  })
}
