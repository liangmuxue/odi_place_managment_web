import request from '@/utils/request'

//首页数据统计
export function homepageStatistics(data) {
  return request({
    url: '/system/collectionStatistics/homepageStatistics',
    method: 'get',
    params: data

  })
}
