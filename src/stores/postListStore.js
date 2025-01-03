import { defineStore } from 'pinia';
import { getPostListAPI } from '@/apis/postList'; // 假设你有一个获取帖子的 API 方法
import { ref } from "vue";

export const usePostListStore = defineStore('postList', () => {
  const postList = ref([]); // 存储帖子列表
  const count = ref(0); // 存储帖子的总数

  // 获取帖子列表的异步函数
  const getPostList = async (params) => {
    const res = await getPostListAPI(params); // 获取帖子数据
    count.value = res.data.count; // 更新帖子总数
    // 对每个 post 的 avatar 进行解码处理
    postList.value = res.data.post_list.map(post => {
      return {
        ...post, // 保留其他字段不变
        avatar: `data:image/png;base64, ${post.avatar}`, // 对 avatar 字段进行解码
      };
    });
  };

  return {
    count,
    postList,
    getPostList,
  };
});

