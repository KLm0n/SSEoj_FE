import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI, logoutAPI, getUserInfoAPI, avatarChangeAPI, usernameChangeAPI, proflieChangeAPI, passwordChangeAPI, passwordForgetAPI,getPracticeAPI } from '@/apis/user'
// import { id } from 'element-plus/es/locale'

export const useUserStore = defineStore('user', () => {
    const userInfo = ref({})
    const practiceInfo = ref({})

    const getUserInfo = async (email, password) => {
        const res = await loginAPI({ email, password })
        const data = await getUserInfoAPI(res.data.id)
        userInfo.value = data.data
        console.log("get user info", userInfo.value)
    }

    const clearUserInfo = () => {
        logoutAPI()
        userInfo.value = {}
    }

    const isAuthenticated = () => {
        return !!userInfo.value && !!userInfo.value.id
    }

    const getAvatar = () => {
        return `data:image/png;base64, ${userInfo.value.avatar}`
    }

    // 修改用户信息的方法
    const updateUserInfo = async (updatedInfo) => {
        try {
            // 如果是修改用户名
            if (updatedInfo.username) {
                await usernameChangeAPI(updatedInfo.username)
                userInfo.value.username = updatedInfo.username
            }

            // 如果是修改简介
            if (updatedInfo.profile) {
                await proflieChangeAPI(updatedInfo.profile)
                userInfo.value.profile = updatedInfo.profile
            }

            // 如果是修改头像
            if (updatedInfo.avatar) {
                await avatarChangeAPI(updatedInfo.avatar)
                userInfo.value.avatar = updatedInfo.avatar
            }

            // 如果是修改密码（传入的是旧密码和新密码）
            if (updatedInfo.oldPassword && updatedInfo.newPassword) {
                await passwordChangeAPI(updateUserInfo.id,updatedInfo.oldPassword, updatedInfo.newPassword)
                alert('密码修改成功！')
            }
            console.log('User info updated successfully:', userInfo.value)
        } catch (error) {
            console.error('Error updating user info:', error)
            alert('用户信息更新失败！')
        }
    }

    const passwordForget = async (params) => {
        await passwordForgetAPI(params)
        alert('重置密码邮件已发送，请查收并修改您的新密码！')
        console.log('Password forget successfully:', params)
    }

    const getPractice = async (id) => {
      const res = await getPracticeAPI(id)
      practiceInfo.value = res.data.practices
      // console.log("get practice info", practiceInfo.value)
    }


    return {
        userInfo,
        practiceInfo,
        getUserInfo,
        clearUserInfo,
        isAuthenticated,
        getAvatar,
        updateUserInfo,  // 这里暴露 updateUserInfo 方法
        passwordForget,
        getPractice
    }
}, {
    persist: true,
})
