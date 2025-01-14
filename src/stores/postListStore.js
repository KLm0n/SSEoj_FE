import { defineStore } from 'pinia';
import { getPostListAPI, getHotPostAPI, getMyPostAPI, getSubscribePostAPI } from '@/apis/postList'; // 假设你有一个获取帖子的 API 方法
import { ref } from "vue";

export const usePostListStore = defineStore('postList', () => {
  const postList = ref([]); // 存储帖子列表
  const count = ref(0); // 存储帖子的总数
  const has_next = ref(true); // 是否已获取所有的数据

  // 获取帖子列表的异步函数
  const getPostList = async (params) => {
    const res = await getPostListAPI(params); // 获取帖子数据
    count.value = res.data.count; // 更新帖子总数
    // 对每个 post 的 avatar 进行解码处理
    console.log(res.data.post_list); // 查看整个数据结构，确认 avatar 字段的值
    postList.value = res.data.post_list.map(post => {
      return {
        ...post, // 保留其他字段不变
        avatar: `data:image/png;base64, ${post.avatar}`, // 对 avatar 字段进行解码
      };
    });
    console.log( postList.value); // 查看整个数据结构，确认 avatar 字段的值
  };

  const getMyPost = async () => {
    if (!has_next.value) return;
    const res = await getMyPostAPI(); // 获取帖子数据
    count.value += res.data.posts.length; // 更新帖子总数
    has_next.value = res.data.has_next;
    // 对每个 post 的 avatar 进行解码处理
    postList.value = res.data.posts.map(post => {
      return {
        ...post, // 保留其他字段不变
        avatar: `data:image/png;base64, ${post.avatar}`, // 对 avatar 字段进行解码
      };
    });
  }

  const getHotPost = async () => {
    if (!has_next.value) return;
    const res = await getHotPostAPI({page_num: Math.floor(count.value / 30) + 1, page_size: 30}); // 获取帖子数据
    count.value += res.data.posts.length; // 更新帖子总数
    has_next.value = res.data.has_next;
    // 对每个 post 的 avatar 进行解码处理
    let tmp = res.data.posts.map(post => {
      return {
        ...post, // 保留其他字段不变
        avatar: `data:image/png;base64, ${post.avatar}`, // 对 avatar 字段进行解码
      };
    });
    postList.value.push(...tmp);
  }

  const getSubscribePost = async () => {
    if (!has_next.value) return;
    const res = await getSubscribePostAPI(); // 获取帖子数据
    count.value += res.data.posts.length; // 更新帖子总数
    has_next.value = res.data.has_next;
    // 对每个 post 的 avatar 进行解码处理
    postList.value = res.data.posts.map(post => {
      return {
        ...post, // 保留其他字段不变
        avatar: `data:image/png;base64, ${post.avatar}`, // 对 avatar 字段进行解码
      };
    });
  }

  const clearPostList = () => {
    postList.value = [];
    has_next.value = true;
    count.value = 0;
  }

  return {
    has_next,
    count,
    postList,
    getPostList,
    getHotPost,
    getMyPost,
    getSubscribePost,
    clearPostList,
  };
});

