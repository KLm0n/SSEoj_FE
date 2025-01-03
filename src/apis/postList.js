import request from '@/utils/http'
export const getPostListAPI = (params) => {
  return request({
      url: '/api/post/list/',
      params,
  })
}
