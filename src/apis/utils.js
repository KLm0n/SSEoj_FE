import request from '@/utils/http'

export const getTagsAPI = () => {
    return request ({
        url: '/api/tags/'
    })  
}