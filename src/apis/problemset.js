import request from '@/utils/http'

// 获取题库
export const getProblemSetAPI = (params) => {
    return request({
        url: '/api/problemset/',
        params,
    })
}

// 提交题解
export const createSolutionAPI = (data) => {
    return request({
        url: '/api/solution/create/',
        method: 'POST',
        data: data
    })
}

// 获取题单详细信息
export const getSolutionDetailAPI = (problem_id, solution_id) => {
    return request({
        url: `/api/problem/${problem_id}/solutions/${solution_id}/`
    })
}

