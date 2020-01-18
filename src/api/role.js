import request from '@/utils/request'
export function fetchList() {
  return request({
    url: '/role/list',
    method: 'get'
  })
}
