import request from '@/utils/request'
export function fetchTreeList() {
  return request({
    url: '/permission/treeList',
    method: 'get'
  })
}

export function createPermission(data) {
  return request({
    url: '/permission/create',
    method: 'post',
    data: data
  })
}

export function getPermission(id) {
  return request({
    url: '/permission/'+id,
    method: 'get'
  })
}

export function updatePermission(id, data) {
  return request({
    url: '/product/update/' + id,
    method: 'post',
    data: data
  })
}
