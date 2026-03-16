import request from '@/utils/request'
//数据报表分页
export function reportPage(data) {
  return request({
    url: 'system/report/page',
    method: 'post',
    data

  })
}
//数据报表导出
export function reportExport(data) {
  return request({
    url: '/system/report/export',
    method: 'post',
    data,
    responseType: 'blob' // 表明返回服务器返回的数据类型

  })
}
