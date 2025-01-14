import axios from 'axios'
import 'element-plus/theme-chalk/el-message.css';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/userStore';
import router from '@/router';
import Cookies from 'js-cookie';


const httpInstance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000,
    withCredentials: true,
})

httpInstance.interceptors.request.use(config => {
    const token = Cookies.get('csrftoken')
    config.headers['X-CSRFToken'] = token
    console.log("request url:", config.url)
    return config
}, e => Promise.reject(e))

httpInstance.interceptors.response.use(
    res => {
        if (res.data.err != null) {
            ElMessage({
                type: 'warning',
                message: res.data.msg
            })
            return Promise.reject(res)
        }
        else {
            // console.log(res.data)
            return res.data
        }
    },
    e => {
        const useStore = useUserStore()
        // console.log(e.response)
        ElMessage({
            type: 'warning',
            message: e.response.data.msg
        })
        if (e.response.state === 401) {
            useStore.clearUserInfo()
            router.push('/')
        }
        return Promise.reject(e)
    })

export default httpInstance
