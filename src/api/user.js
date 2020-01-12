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
