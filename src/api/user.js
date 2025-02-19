import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: '/getInfo',
    method: 'get',
    data
  })
}

export function logout(data) {
  return request({
    url: '/logout',
    method: 'post',
    data
  })
}
