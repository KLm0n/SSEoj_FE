import { defineStore } from "pinia";
import { getPrimaryCommentAPI,likeCommentAPI } from "@/apis/comment";
import { ref } from "vue";

export const useCommentStore = defineStore('comment', () => {
  const comments = ref([])
  const count = ref(0)

  const getComments = async (params) => {
    const res = await getPrimaryCommentAPI(params);
    count.value = res.data.count; // 更新 .value
    comments.value = res.data.comments.map(comment => {
      return {
        ...comment, // 保留其他字段不变
        avatar: `data:image/png;base64, ${comment.avatar}`, // 对 avatar 字段进行解码
      };
    });

  };

  // 点赞
  const likeComment = async (params) => {
    const res = await likeCommentAPI(params);
    console.log(params);
  };

  return {
      count,
      comments,
      getComments,
      likeComment,
  }
})
