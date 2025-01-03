import { defineStore } from "pinia";
import { getPostAPI, createPostAPI, likePostAPI } from "@/apis/post";
import { ref } from "vue";

export const usePostStore = defineStore('post', () => {
    const post = ref({});
    const isPosting = ref(false); // 发布状态

    // 获取帖子详情
    const getPost = async (id) => {
        const res = await getPostAPI(id);
        post.value = {
          ...res.data,
          avatar: `data:image/png;base64, ${res.data.avatar}`, // 对 avatar 字段进行解码
        };
    };

    // 发布新帖子
    const createPost = async (params) => {
        try {
            isPosting.value = true; // 设置发布中状态
            const response = await createPostAPI(params);
            // console.log(params);
            return response.data.success;
        } catch (error) {
            console.error(error);
            throw new Error('发布失败');
        } finally {
            isPosting.value = false; // 恢复状态
        }
    };

    // 点赞
    const likePost = async (params) => {
        const res = await likePostAPI(params);
        console.log(params);
    };

    return {
        post,
        isPosting,
        getPost,
        createPost,
        likePost
    };
});
