<template>
  <div class="list-item-content">
    <div class="user_content">
      <img :src="avatar" alt="Avatar" class="avatar" />
      <h3 class="username">{{ username }}</h3>
    </div>
    <div class="post_content">
      <p class="title">{{ title }}</p>
      <div class="like-container">
        <span class="time">{{ time }}</span>

        <span class="iconfont icon-BxLike" ></span>
        <span class="like-count">{{ likeCount }}</span>
        <span class="iconfont icon-comment"></span>
        <span class="comment-count">{{ commentCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';



defineProps({
  avatar: { type: String, required: true }, // 用户头像的 URL
  username: { type: String, required: true},
  title: { type: String, required: true },  // 标题
  time: { type: String, required: true},
  likeCount: { type: Number, required: true },
  commentCount:{ type: Number, required: true}
});

</script>


<style scoped>
.list-item-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 99%;
  cursor: pointer;

}

.user_content{
  width: 150px;
  height: 40px;
  margin: 0;
  margin-right:20px ;
  text-align: left;
  display: flex;
}

.avatar {
  left: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  position: relative;
  flex-grow: 1; /* 标题占据剩余空间 */
  margin-left: 5px;
  font-size: 16px;
  color: #333;
  text-align: left;
  max-width: 100px;
  margin-top:8px;
  font-weight: bold;
}

.post_content{
  margin-right:20px ;
  width: 400px;
}

.title {
  position: relative;
  flex-grow: 1; /* 标题占据剩余空间 */
  margin: 0;
  margin-right:20px ;
  font-size: 16px;
  color: #333;
  text-align: left;
}

.like-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.icon-BxLike {
  cursor: pointer;
  font-size: 20px;
  color: #888;
  transition: color 0.2s ease;
}


.like-count {
  font-size: 12px;
  color: grey;
  margin-right: 10px;
}

.icon-comment {
  cursor: pointer;
  font-size: 20px;
  color: #888;
}

.comment-count {
  font-size: 12px;
  color: grey;
}

.time{
  font-size:12px;
  color: grey;
  margin-right: 50px;
}
</style>
