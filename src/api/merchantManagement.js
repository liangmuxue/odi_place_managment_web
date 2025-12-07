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

// 抵扣规则列表
export function merchantDeductionRuleList(data) {
  return request({
    url: '/merchant/merchantDeductionRule/list',
    method: 'post',
    data
  })
}

// 新增抵扣规则
export function merchantDeductionRuleInsert(data) {
  return request({
    url: '/merchant/merchantDeductionRule/insert',
    method: 'post',
    data
  })
}

// 修改抵扣规则
export function merchantDeductionRuleUpdate(data) {
  return request({
    url: '/merchant/merchantDeductionRule/update',
    method: 'post',
    data
  })
}

// 抵扣规则详情
export function merchantDeductionRuleDetail(data) {
  return request({
    url: '/merchant/merchantDeductionRule/detail',
    method: 'post',
    data
  })
}

// 抵扣券名称唯一性校验
export function checkDeductionNameUnique(data) {
  return request({
    url: '/merchant/merchantDeductionRule/checkDeductionNameUnique',
    method: 'post',
    data
  })
}

// 批量删除抵扣规则
export function merchantDeductionRuleBatchDelete(data) {
  return request({
    url: '/merchant/merchantDeductionRule/deleteBatch',
    method: 'post',
    data
  })
}
