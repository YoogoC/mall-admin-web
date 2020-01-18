import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: params
  })
}

export function updateStatus(params) {
  return request({
    url: '/admin/update/status',
    method: 'post',
    params: params
  })
}

export function fetchPermissionList(userId) {
  return request({
    url: '/admin/permission/'+userId,
    method: 'get'
  })
}

export function updatePermissions(params) {
  return request({
    url: '/admin/permission/update',
    method: 'post',
    params: params
  })
}

export function resetPassword(userId) {
  return request({
    url: '/admin/resetPassword/' + userId,
    method: 'post'
  })
}

export function fetchRoleList(userId) {
  return request({
    url: '/admin/role/' + userId,
    method: 'get'
  })
}

export function updateRoleList(params) {
  return request({
    url: '/admin/role/update/',
    method: 'post',
    params: params
  })
}
