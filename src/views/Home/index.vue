<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <div class="wrapper_search">
    <div class="search_container">
      <input type="text" class="search_input" required v-model="search_query" />
      <span class="iconfont icon-sousuo" ></span>
    </div>
    <el-button class="btn_random" type="info" plain>随机来一题</el-button>
    <div class="notice_bar">
      <label class="btn_notice">NOTICE</label>
      <div class="notice_content">
        <span v-for="(item, index) in notices" :key="index" class="notice_item">
          {{ item }}
        </span>
      </div>
    </div >
  </div>
  <div class="wrapper_post">
    <div class="menuContainer">
      <el-menu
        :default-active="'1'"
        class="menu_main"
        mode="horizontal"
        @select="handleSelect"
        background-color="white"
        text-color="black"
        active-text-color="black"
        :ellipsis="false"
      >
        <el-menu-item index="1">热门讨论</el-menu-item>
        <el-menu-item index="2">你的关注</el-menu-item>
        <el-menu-item index="3">我的发布</el-menu-item>
      </el-menu>
    </div>
    <div class="infinite-list-wrapper" style="overflow: auto">
        <ul
          v-infinite-scroll="load"
          class="list"
        >
          <li
            v-for="post in filteredPosts"
            :key="post.post_id"
            class="list-item"
            @click="goToDiscussion(post.post_id)"
          >
            <ListItemContent
              :avatar="post.avatar"
              :title="post.post_title"
              :username="post.username"
              :time="post.create_time"
              :commentCount="post.comment_count"
              :likeCount="post.like_count"
              v-model="selectedPost"
            />
          </li>
        </ul>
      </div>
    </div>

    <!-- <div class="wrapper_feedback">
      <label class="feedback_label">有任何问题，欢迎反馈~</label>
      <input class="feedback_input" type="text" required placeholder="here!"/>
      <el-button class="btn_feedback" type="success" plain>Submit</el-button>
    </div> -->
</template>



<script setup>
import { ref, onMounted,computed } from 'vue';
import { usePostListStore } from '@/stores/postListStore';
import ListItemContent from '../Discussion/ListItemContent.vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const search_query =ref("");
const count = ref(0)
const postListStore = usePostListStore();

const currentPage = ref(1);
const pageSize = ref(30);
const sortTpye = ref("likeDesc");


// 当前选中的 menu index
const activeMenuIndex = ref('1');

const router = useRouter();

// 监听菜单切换
const handleSelect = (index) => {
  activeMenuIndex.value = index; // 更新当前选中的 menu
};

const load = async () => {
  await postListStore.getPostList(params.value);
  loadedCount.value = postListStore.postList.length; // 更新已加载数量

};

const params = computed(() => ({
  page_num: currentPage.value || 1,
  page_size: pageSize.value || 30,
  sort_type: sortTpye.value || "likeDesc",
  keyword: ""
}));

// 动态过滤帖子
const filteredPosts = computed(() => {
  // 根据 menu index 动态筛选帖子
  if (activeMenuIndex.value === '2') {
    return postListStore.postList.filter(post => post.post_id === 1);
  } else if (activeMenuIndex.value === '3') {
    return postListStore.postList.filter(post => post.post_id >= 3&&post.post_id<=6); // 示例
  } else if (activeMenuIndex.value === '1') {
    return postListStore.postList; // 或其他逻辑
  }
  return [];
});

const goToDiscussion = (postId) => {
  router.replace(`/discussion/${postId}`);
};


onMounted(async () => {
  await postListStore.getPostList(params.value); // 等待数据加载
  count.value = postListStore.count; // 更新总数
});

</script>

<style scoped>
.wrapper_search {
position: relative;
width: 85%; /* 或设置为具体的值，例如 400px */
height: 250px;
min-width: 800px;
margin: auto;
padding: 16px;
box-sizing: border-box; /* 确保 padding 不影响宽度 */
overflow: hidden; /* 防止内容溢出 */
display: flex;
flex-direction: column; /* 保证内部内容按列排列 */
gap: 16px; /* 设置子组件的间距 */
background:transparent;
border-radius: 12px;
backdrop-filter: blur(20px);
box-shadow:0 0 5px rgba(0, 0, 0, .5);
}

.search_container {
width: 20%;
max-width: 20%;
display: flex;
align-items: center;
gap: 8px;
flex-shrink: 0; /* 防止搜索框被压缩 */
position: relative;
top:30px;
left: 140px;
}
.search_input {
flex-grow: 1; /* 让输入框在可用空间内扩展 */
min-width: 0; /* 防止溢出 */
max-width: 100%; /* 防止输入框超过父容器 */
padding: 8px;
box-sizing: border-box;
border: none;
border-radius: 6px;
box-shadow: 0 0 4px rgba(0, 0, 0, .5);
outline: none;
}



.search_container .icon-sousuo {
position: absolute;
top: 6px;
left: 2px;
font-size: 1.2em;
color: #162938;
transition: .5s;
pointer-events: none; /* 使图标不可点击 */

}

/* 当输入框为空时显示搜索图标 */
.search_container input:focus~.icon-sousuo ,
.search_container input:valid~.icon-sousuo{
display: none;
}
.search_container:focus + .icon-sousuo{
display: none;
}

.btn_random {
align-self: flex-start; /* 防止按钮占满行 */
flex-shrink: 0; /* 确保按钮不会被压缩 */
position: relative;
top: 80px;
left: 140px;
}

.notice_bar {
flex-grow: 1; /* 让通知栏占用剩余空间 */
overflow-y: auto; /* 如果内容溢出，添加滚动条 */
padding: 8px;
box-sizing: border-box;
position: absolute;
width: 350px;
height: 190px;
top:30px;
right: 80px;
border: none;
border-radius: 6px;
box-shadow: 0 0 4px rgba(0, 0, 0, .5);
background-color: #f9f9f9;
padding: 10px;
border: 1px solid #ddd;
}

.notice_content {
display: flex;
gap: 8px;
flex-wrap: wrap; /* 内容换行，防止溢出 */
}

.notice_item {
font-size: 14px;
color: #333;
padding: 4px 8px;
background: #eee;
border-radius: 4px;
white-space: nowrap; /* 禁止文字换行 */
}



.wrapper_post{
margin: auto;
position: relative;
margin-top: 20px;
margin-bottom: 10px;
width: 85%;
min-width: 800px;
max-height: 800px;
background:transparent;
border-radius: 12px;
backdrop-filter: blur(20px);
box-shadow:0 0 5px rgba(0, 0, 0, .5);
display: flex;
flex-direction: column; /* 子元素按列排列 */
align-items: center; /* 水平居中对齐 */

}

.menuContainer{
  min-height: 60px;
  display: flex;
  width: 100%;
}

.menu_main{
display: flex;
position: relative;
top: 5px;
margin-left: 70px;
margin-right: 70px;
width: 100%;
/* border-radius: 12px; */
/* border:none; */
overflow: hidden;
/* gap:25%; */
justify-content: space-between;
min-height: 60px;
}

.menu_main .el-menu-item{
/* margin-right: 25%; */
text-align: center; /* 居中显示 */
font-size:16px;      /* 可选：设置字体大小 */
}
.menu_main .el-menu-item:hover {
background-color: white;  /* 鼠标悬浮时的背景颜色 */
}
.menu_main .el-menu-item.is-active {
background-color: white;  /* 选中项的背景色 */
}


.infinite-list-wrapper {
position: relative;
margin-top: 25px; /* 与菜单之间的间距 */
margin-bottom: 25px; /* 与菜单之间的间距 */
width: 95%; /* 与 menu_main 的宽度一致 */
text-align: center;
height: 80%; /* 自动根据内容调整高度 */
}
.infinite-list-wrapper .list {
padding: 0;
margin: 0;
list-style: none;
}

.infinite-list-wrapper .list-item {
display: flex;
align-items: center;
justify-content: center;
height: 75px;
}
.infinite-list-wrapper .list-item + .list-item {
margin-top: 1px;
}





.wrapper_feedback{
  width: 84%; /* 或设置为具体的值，例如 400px */
  margin: auto;
  margin-top:80px;
  padding: 10px;
  position: relative;
  backdrop-filter: blur(20px);
  box-shadow:0 0 5px rgba(0, 0, 0, .5);
  border-radius: 6px;
  min-width: 800px;
  margin-bottom: 20px;
}

.wrapper_feedback label{
  position: absolute;
  margin-top: -35px;
  color: white;
  background-color: #57bc75;
  backdrop-filter: blur(20px);
  box-shadow:0 0 5px rgba(0, 0, 0, .5);
  border-radius: 6px;
}

.wrapper_feedback input{
  width: 80%;
  margin-right: 70px;
  /* border: none; */
  outline: none;
}

.btn_feedback{
  margin: auto;
}

</style>
