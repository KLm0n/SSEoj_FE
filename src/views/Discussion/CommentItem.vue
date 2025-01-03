<template>
  <div class="comments-container">
    <!-- 渲染一级评论 -->
    <div v-for="comment in comments" :key="comment.comment_id" class="comment">
      <!-- 一级评论内容 -->
      <div class="comment-header">
        <img :src="comment.avatar" class="avatar" />
        <span class="username">{{ comment.user_name }}</span>
        <span class="time">{{ comment.create_time }}</span>
        <div class="likeContainer">
          <span v-if="comment.is_good" class="iconfont icon-BxsLike" @click="handleLike(comment)"></span>
          <span v-else class="iconfont icon-BxLike" @click="handleLike(comment)"></span>
          <label class="likeCount">{{ comment.like_count }}</label>
        </div>
      </div>
      <div class="comment-content">
        <p>{{ comment.comment_content }}</p>
        <button class="reply-btn" @click="setReplyBox(comment.comment_id, comment.user_name)">回复</button>
      </div>

      <div class="replies-container">
        <!-- 渲染二级评论 -->
        <div v-for="reply in comment.replies" :key="reply.comment_id" class="reply-item">
          <div class="reply-header">
            <img :src="reply.avatar" class="avatar" />
            <span class="username">{{ reply.user_name }}</span>
            <span class="reply-to" v-if="reply.reply_to_name">Reply to: {{ reply.reply_to_name }}</span>
            <span class="time">{{ reply.create_time }}</span>
            <div class="likeContainer">
              <span v-if="reply.is_good" class="iconfont icon-BxsLike" @click="handleLike(reply)"></span>
              <span v-else class="iconfont icon-BxLike" @click="handleLike(reply)"></span>
              <label class="likeCount">{{ reply.like_count }}</label>
            </div>
          </div>
          <div class="reply-content">
            <p>{{ reply.comment_content }}</p>
            <button class="reply-btn" @click="setReplyBox(reply.comment_id, reply.user_name)">回复</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 全局回复框 -->
    <div v-if="activeReplyBoxId" class="reply-box">
      <textarea
        v-model="replyInput"
        :placeholder="`Reply to ${activeReplyUserName}`"
        class="reply-input"
      ></textarea>
      <button class="submit-btn" @click="submitReply">发布</button>
      <button class="cancel-btn" @click="clearReplyBox">取消</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useCommentStore } from '@/stores/commentStore';

const commentStore = useCommentStore()

const props = defineProps({
  commentsData: {
    type: Array,
    required: true
  }
});

const comments = ref([]);
const activeReplyBoxId = ref(null); // 当前激活的评论ID
const activeReplyUserName = ref(''); // 当前的回复用户名
const replyInput = ref(''); // 回复框的输入内容

const processComments = () => {
  const topLevelComments = []; // 存储一级评论
  const allCommentsMap = {}; // 用于快速查找所有评论

  // 遍历所有评论，分类并存储
  props.commentsData.forEach((item) => {
    allCommentsMap[item.comment_id] = item;

    if (!item.reply_to_id && !topLevelComments.includes(item.comment_id)) {
      // 一级评论，添加到 topLevelComments
      topLevelComments.push(item);
    }
  });

  // 按时间排序
  topLevelComments.sort((a, b) => new Date(a.create_time) - new Date(b.create_time));

  topLevelComments.forEach(comment => {
    const replies = props.commentsData.filter(reply => reply.under_comment_id === comment.comment_id);
    replies.sort((a, b) => new Date(a.create_time) - new Date(b.create_time));
    comment.replies = replies;
  });

  comments.value = topLevelComments;
};

watch(
  () => props.commentsData,
  processComments,
  { immediate: true }
);

const setReplyBox = (commentId, userName) => {
  activeReplyBoxId.value = commentId;
  activeReplyUserName.value = userName;
  replyInput.value = `Reply to ${userName}`; // 设置默认内容
};

const submitReply = () => {
  if (!replyInput.value.trim()) return;

  console.log(`Reply to comment ${activeReplyBoxId.value}: ${replyInput.value}`);
  // 提交回复逻辑（API调用）
  clearReplyBox();
};

const clearReplyBox = () => {
  activeReplyBoxId.value = null;
  activeReplyUserName.value = '';
  replyInput.value = '';
};

const handleLike= (params) => {
  const is_good=params.is_good;
  const comment_id=params.comment_id;
  commentStore.likeComment({is_good, comment_id})
}

</script>

<style scoped>
.comments-container {
  margin: 0;
  padding: 0;
}

.comment {
  margin-bottom: 20px;
  background: transparent;
  border-radius: 6px;
  backdrop-filter: blur(20px);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  align-items: center;
  padding: 5px;
}

.comment-header {
  font-weight: bold;
  border-bottom: grey solid;
  display: flex;

}

.likeContainer{
 align-self: flex-end;
 margin: auto;
 margin-left: 50px;
 margin-top:10px;
 cursor: pointer;
}


.comment-content {
  display: flex;
  margin: 0;
}

.comment-content p {
  width: 92%;
  margin-bottom: 0px;
  margin-top: 10px;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
}

.reply-header{
  display: flex;
}

.reply-item .avatar {
  width: 30px;
  height: 30px;
}


.reply-item .username {
  margin-left: 5px;
  margin-top: 10px;
}

.reply-item .time {
  margin-left: 10px;
  margin-top: 14px;
  text-align: center;
  color: #888;
  font-size: 12px;
}

.reply-to{
  margin-left: 5px;
  margin-top: 10px;
}

.comment-header .username {
  margin-left: 10px;
  margin-top: 10px;
  font-weight: bold;
}

.comment-header .time {
  margin-left: 10px;
  margin-top: 14px;
  text-align: center;
  color: #888;
  font-size: 12px;
}


.reply-btn {
  color: black;
  background: transparent;
  border: none;
  cursor: pointer;
  font-weight: bold;
  margin: auto;
  margin-top: 10px;
}

.replies-container {
  margin-top: 10px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.reply-content .reply-btn{
  position: relative;
  display: flex;
  margin-right: 10px;
}

.reply-content p {
  margin-top:5px;
}

.reply-item {
  margin-bottom: 10px;
  margin-top: 10px;
}

.reply-item .username {
  font-weight: bold;
}

.reply-to {
  font-style: italic;
  margin-right: 10px;
}

.reply-box {
  margin-top: 20px;
  background: #fff;
  padding: 10px;
  border-radius: 6px;
  backdrop-filter: blur(20px);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  margin-bottom: 20px;
}

.reply-input {
  width: calc(100% - 20px);
  height: 60px;
  margin-bottom: 10px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
}

.reply-input:focus{
  outline: none;
}

.submit-btn,
.cancel-btn {
  margin-right: 10px;
  padding: 5px 10px;
  font-size: 14px;
  color: #fff;
  background: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background: #888;
}
</style>
