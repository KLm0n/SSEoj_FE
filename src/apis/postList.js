import request from '@/utils/http'
export const getPostListAPI = (params) => {
  return request({
      url: '/api/post/list/',
      params,
  })
}

export const getHotPostAPI = (params) => {
  return request({
    url: '/api/post/hot_post/',
    params,
  })
}

export const getSubscribePostAPI = () => {
  return request({
    url: '/api/post/subscribe_post/',
  })
}

export const getMyPostAPI = () => {
  return request({
    url: '/api/post/my_post/',
})
}
