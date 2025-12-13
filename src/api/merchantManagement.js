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

// 更新商户透支功能状态
export function updateMerchantOverdraftStatus(data) {
  return request({
    url: '/merchant/merchant/updateOverdraftStatus',
    method: 'post',
    data
  })
}

// 更新商户抵扣回收状态
export function updateMerchantRecycleStatus(data) {
  return request({
    url: '/merchant/merchant/updateRecycleStatus',
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

// 获取规则关联的商户信息
export function getMerchantsByRuleId(data) {
  return request({
    url: '/merchant/merchantDeductionRule/getMerchantsByRuleId',
    method: 'post',
    data
  })
}

// 保存规则与商户的关联关系
export function saveMerchantRuleRelation(data) {
  return request({
    url: '/merchant/merchantDeductionRule/saveMerchantRuleRelation',
    method: 'post',
    data
  })
}

// 根据商户ID获取抵扣规则列表
export function getDeductionsByMerchantId(data) {
  return request({
    url: '/merchant/merchantDeductionRule/getDeductionsByMerchantId',
    method: 'post',
    data
  })
}

// 更新商户抵扣规则启用/停用状态
export function updateMerchantDeductionState(data) {
  return request({
    url: '/merchant/merchantDeductionRule/updateState',
    method: 'post',
    data
  })
}

// 商户充值
export function merchantRecharge(data) {
  return request({
    url: '/merchant/merchant/recharge',
    method: 'post',
    data
  })
}

// 商户退费
export function merchantRefund(data) {
  return request({
    url: '/merchant/merchant/refund',
    method: 'post',
    data
  })
}

// 抵扣规则充次数
export function deductionRechargeTimes(data) {
  return request({
    url: '/merchant/merchantDeductionRule/rechargeTimes',
    method: 'post',
    data
  })
}

// 抵扣规则退次数
export function deductionRefundTimes(data) {
  return request({
    url: '/merchant/merchantDeductionRule/refundTimes',
    method: 'post',
    data
  })
}

// 商户充值记录分页
export function merchantRechargeRecordList(data) {
  return request({
    url: '/merchant/merchant/rechargeRecord/list',
    method: 'post',
    data
  })
}

// 商户充值记录详情
export function merchantRechargeRecordDetail(data) {
  return request({
    url: '/merchant/merchant/rechargeRecord/detail',
    method: 'post',
    data
  })
}

// 商户充值记录导出
export function merchantRechargeRecordExport(data) {
  return request({
    url: '/merchant/merchant/rechargeRecord/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 商户退费记录分页
export function merchantRefundRecordList(data) {
  return request({
    url: '/merchant/merchant/refundRecord/list',
    method: 'post',
    data
  })
}

// 商户退费记录详情
export function merchantRefundRecordDetail(data) {
  return request({
    url: '/merchant/merchant/refundRecord/detail',
    method: 'post',
    data
  })
}

// 商户退费记录导出
export function merchantRefundRecordExport(data) {
  return request({
    url: '/merchant/merchant/refundRecord/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 根据商户ID获取抵扣规则列表（不分页）
export function getDeductionsByMerchantIdNoPage(data) {
  return request({
    url: '/merchant/merchantDeductionRule/getDeductionsByMerchantIdNoPage',
    method: 'post',
    data
  })
}

// 人工发放抵扣券
export function manualSaveDistribution(data) {
  return request({
    url: '/merchant/merchantDeductionDistribution/manualSave',
    method: 'post',
    data
  })
}

// 二维码发放保存
export function qrcodeSave(data) {
  return request({
    url: '/merchant/merchantDeductionDistribution/qrcodeSave',
    method: 'post',
    data
  })
}

// 获取二维码
export function getQrcode(id) {
  return request({
    url: `/merchant/merchantDeductionDistribution/qrcode/${id}`,
    method: 'get'
  })
}

// 抵扣券发放记录分页
export function merchantDeductionDistributionList(data) {
  return request({
    url: '/merchant/merchantDeductionDistribution/list',
    method: 'post',
    data
  })
}

// 抵扣券发放记录导出
export function merchantDeductionDistributionExport(data) {
  return request({
    url: '/merchant/merchantDeductionDistribution/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 获取当天提醒开关状态
export function todayOnOff() {
  return request({
    url: '/merchant/alert/todayOnOff',
    method: 'post'
  })
}

// 切换当天提醒开关状态
export function toggleTodayOnOff() {
  return request({
    url: '/merchant/alert/toggleTodayOnOff',
    method: 'post'
  })
}

// 查询透支商户列表
export function negativeBalanceList(data) {
  return request({
    url: '/merchant/merchant/negativeBalance/list',
    method: 'post',
    data
  })
}
