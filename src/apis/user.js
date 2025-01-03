import request from '@/utils/http'

// 登陆的api
export const loginAPI = ({ email, password }) => {
    return request({
        url: '/api/identity/login/',
        method: 'POST',
        data: {
            email:email,
            password:password
        }
    })
}

// 获取用户信息
export const getUserInfoAPI = (id) => {
    return request({
        url: `/api/user/${id}/info/`
    })
}

// 退出登录
export const logoutAPI = () => {
    return request({
        url: "/api/identity/logout/",
        method: 'GET',
    })
}

// 获取用户创建的题单
export const getCreateProblemListAPI = (id) => {
    return request({
        url: `/api/user/${id}/create_problemlist/`
    })
}

// 关注用户
export const subscribeUserAPI = (id, relationship) => {
    return request({
        url: '/api/user/subscribe/',
        method: 'POST',
        data: {
            id: id,
            relationship: relationship
        }
    })
}

export const proflieChangeAPI = (profile) => {
    return request({
        url: "/api/user/profile_change/",
        method: 'PUT',
        data:{
          profile: profile
        }
    })
}

export const usernameChangeAPI = (username) => {
    return request({
        url: "/api/user/user_name_change/",
        method: 'PUT',
        data:{
          username: username
        }
    })
}

export const avatarChangeAPI = (avatar) => {
    return request({
        url: "/api/user/avatar_change/",
        method: 'PUT',
        data:{
          avatar: avatar
        }
    })
}

export const passwordChangeAPI = ({id,password_before,password_new}) => {
    return request({
        url: "/api/user/password_change/",
        method: 'PUT',
        data: {
            id:id,
            password_before:password_before,
            password_new:password_new
        }
    })
}

export const passwordForgetAPI = ({email,password_new,verification_code}) => {
    return request({
        url: "/api/user/password_forget/",
        method: 'PUT',
        data: {
          email:email,
          password_new:password_new,
          verification_code:verification_code
      }
    })
}

export const getPracticeAPI= (id) =>{
    return request({
      url: `/api/user/${id}/practice/`,
      method: 'GET',
    })
}
