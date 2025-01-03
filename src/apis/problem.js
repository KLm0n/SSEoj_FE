import request from '@/utils/http'

// 获取问题详细描述 API
export const getProblemDescAPI = (id) => {
    return request({
        url: `/api/problem/${id}/description/`,
    })
}

// 获取题解列表 API
export const getSolutionListAPI = (id, params) => {
    return request({
        url: `/api/problem/${id}/solutions/`,
        params
    })
}

// 题解点赞 API
export const likeSolutionAPI = (id, is_good) => {
    return request({
        url: '/api/solution/good/',
        method: 'POST',
        data: {
            id: id,
            is_good: is_good
        }
    })
}

// 获取提交列表
export const getSubmissionsAPI = (id, params) => {
    return request({
        url: `/api/problem/${id}/submissions/`,
        params: params
    })
}

// 提交题目
export const submitProblemAPI = (data) => {
    return request({
        url: '/api/problem/submit/',
        method: 'POST',
        data: data
    })
}
