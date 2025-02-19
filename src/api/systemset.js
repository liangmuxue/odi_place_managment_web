import request from '@/utils/request'
//用户详情
export function uesrDetail(query, tenantId) {
  return request({
    url: '/user/getById',
    method: 'post',
    data: query,
    headers: {
      "Tenant-Id": tenantId
    }
  })
}

//查询当前的个性化设置信息
export function infoMap(query) {
  return request({
    url: '/syspara/infoMap',
    method: 'post',
    data: query,
  })
}
//分页查询图片
export function downloadImagePage(query) {
  return request({
    url: '/downloadImage/page',
    method: 'post',
    data: query,
  })
}

//用户列表
export function userList(data) {
  return request({
    url: '/sys/user/list',
    method: 'post',
    data

  })
}

//新增用户
export function userInsert(data) {
  return request({
    url: '/sys/user/insert',
    method: 'post',
    data

  })
}

//批量删除用户
export function userRemove(data) {
  return request({
    url: 'sys/user/remove',
    method: 'post',
    data

  })
}
//编辑用户
export function userUpdate(data) {
  return request({
    url: 'sys/user/update',
    method: 'post',
    data

  })
}
//检查用户名存在
export function userCheckLoginName(data) {
  return request({
    url: 'sys/user/checkLoginName',
    method: 'post',
    data

  })
}
//重置密码
export function userResetPwd(data) {
  return request({
    url: 'sys/user/resetPwd',
    method: 'post',
    data

  })
}

//修改密码
export function userUpdatePwd(data) {
  return request({
    url: 'sys/user/updatePwd',
    method: 'post',
    data

  })
}

//分页查询角色
export function roleList(data) {
  return request({
    url: 'role/list',
    method: 'post',
    data

  })
}
//检查角色名是否存在
export function roleCheckName(data) {
  return request({
    url: 'role/checkName',
    method: 'post',
    data

  })
}
//角色详情
export function roleDetail(data) {
  return request({
    url: 'role/detail',
    method: 'post',
    data

  })
}
//查询全部角色
export function roleGetAll(data) {
  return request({
    url: 'role/getAll',
    method: 'post',
    data

  })
}
//删除角色
export function roleDeleteRole(data) {
  return request({
    url: 'role/deleteRole',
    method: 'post',
    data

  })
}
//新建角色
export function roleInsert(data) {
  return request({
    url: 'role/insert',
    method: 'post',
    data

  })
}
//修改角色
export function roleUpdate(data) {
  return request({
    url: 'role/update',
    method: 'post',
    data

  })
}
//全部菜单树
export function resourceTree(data) {
  return request({
    url: 'resource/tree',
    method: 'post',
    data

  })
}
