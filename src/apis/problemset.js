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

// 获取题解详细信息
export const getSolutionDetailAPI = (problem_id, solution_id) => {
    return request({
        url: `/api/problem/${problem_id}/solutions/${solution_id}/`
    })
}

// 获取题解一级评论
export const getSolution1stCommentAPI = (solution_id, params) => {
    return request({
        url: `/api/problem/solutions/${solution_id}/comments/`,
        params: params
    })
}

// 获取题解二级评论
export const getSolution2ndCommentAPI = (solution_id, comment_id, page_num, page_size) => {
    return request({
        url: `/api/problem/solutions/${solution_id}/comments/${comment_id}/`,
        params: {
            page_num: page_num,
            page_size: page_size
        }
    })
}

// 新增题解评论
export const commentSolutionAPI = (data) => {
    return request({
        url: `/api/problem/solutions/comment/new/`,
        method: 'POST',
        data: data
    })
}

// 点赞题解评论
export const likeSolutionCommentAPI = (id, is_good) => {
    return request({
        url: `/api/solution/comment/good/`,
        method: 'POST',
        data: {
            is_good: is_good,
            id: id
        }
    })
}

// 发布题目
export const postProblemAPI = (data) => {
    return request({
        url: `/api/problem/create/`,
        method: 'POST',
        data: data
    })
}

// 获取每种难度的题目的数量
export const getProblemNumAPI = () => {
    return request({
        url: '/api/problemset/problem_num/'
    })
}