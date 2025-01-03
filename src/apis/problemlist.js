import request from '@/utils/http'

// 获取公开题单列表
export const getProblemListAPI = (params) => {
    return request({
        url: '/api/problemlist/',
        params,
    })
}

// 获取题单信息
export const getProblemListDetailAPI = (id) => {
    return request({
        url: `/api/problemlist/${id}/`
    })
}

// 收藏题单
export const starProblemListAPI = (id, is_star) => {
    return request({
        url: '/api/problemlist/star/',
        method: 'POST',
        data: {
            problem_id: id,
            is_star: is_star
        }
    })
}

//转存题单
export const transferProblemListAPI = (id) => {
    return request({
        url: '/api/problemlist/transfer/',
        method: 'POST',
        data: {
            id: id
        }
    })
}