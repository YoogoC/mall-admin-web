import request from '@/utils/request'
export function fetchTreeList(params) {
  return request({
    url: '/permission/treeList',
    method: 'get',
    params: params
  })
}
