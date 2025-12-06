import request from '@/utils/request'

// 商户列表
export function merchantList(data) {
  return request({
    url: '/merchant/merchant/list',
    method: 'post',
    data
  })
}

// 新增商户
export function merchantInsert(data) {
  return request({
    url: '/merchant/merchant/insert',
    method: 'post',
    data
  })
}

// 修改商户
export function merchantUpdate(data) {
  return request({
    url: '/merchant/merchant/update',
    method: 'post',
    data
  })
}

// 商户详情
export function merchantDetail(data) {
  return request({
    url: '/merchant/merchant/detail',
    method: 'post',
    data
  })
}

// 商户名称唯一性校验
export function checkMerchantNameUnique(data) {
  return request({
    url: '/merchant/merchant/checkMerchantNameUnique',
    method: 'post',
    data
  })
}

// 批量删除商户
export function merchantBatchDelete(data) {
  return request({
    url: '/merchant/merchant/deleteBatch',
    method: 'post',
    data
  })
}
