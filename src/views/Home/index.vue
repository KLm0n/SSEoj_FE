<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <div class="wrapper">
    <div class="searchContainer">
      <el-input
        v-model="search_query"
        style="width: 80%; height: 50%; "
        placeholder="Type something"
        @keydown.enter="handleSearch"
      >
        <template #prefix>
          <span class="iconfont icon-sousuo" @click="handleSearch"></span>
        </template>
      </el-input>

      <el-radio-group v-model="searchType">
        <el-radio value="1" size="large">题目</el-radio>
        <el-radio value="2" size="large">帖子</el-radio>
      </el-radio-group>
    </div>
    <div class="mainContainer">
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
            v-infinite-scroll="postListStore.getHotPost"
            class="list"
          >
            <li
              v-for="post in postListStore.postList"
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
      <div class="rightContainer">
        <div class="noticeContainer">
          <label>NOTICE</label>
          <ul v-infinite-scroll="load" class="noticeBar" style="overflow: auto">
            <li v-for="noticeItem in notices" :key="noticeItem.id" class="infinite-list-item">
              <span class="noticeId">{{ noticeItem.id }}</span>
              <span class="noticeContent">{{ noticeItem.content }}</span>
            </li>
          </ul>
        </div>
        <div class="planContainer">
          <label>SCHEDULE</label>
          <label v-if="myPlan.length===0">Nothing here...</label>
          <ul v-else v-infinite-scroll="load" class="plans" style="overflow: auto">
            <li v-for="plan in myPlan" :key="plan.id" class="infinite-list-item">
              <span class="planId">{{ plan.id }}</span>
              <span class="planName">{{ plan.name }}</span>
              <span v-if="plan.problem_status" class="iconfont icon-duigou1" style="text-align: center; font-size: 20px;"></span>
            </li>
          </ul>
        </div>
      </div>

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
import { useUserStore } from '@/stores/userStore';
import { getStudyPlanAPI } from "@/apis/user";
import { getPostListAPI } from '@/apis/postList';


const userStore = useUserStore();
const search_query =ref("");
const count = ref(0)
const postListStore = usePostListStore();

const currentPage = ref(1);
const pageSize = ref(30);
const sortTpye = ref("likeDesc");
const searchType = ref('1')
const myPlan=ref([])

const searchParams = ref({
  keyword: search_query.value
})


// 当前选中的 menu index
const activeMenuIndex = ref('1');

const router = useRouter();

const testPlan=ref([
  {
    id: 1,
    name: 'Plan 1',
    problem_status: true
  },
  {
    id: 2,
    name: 'Plan 2',
    problem_status: false
  },
  {
    id: 1,
    name: 'Plan 1',
    problem_status: true
  },
  {
    id: 2,
    name: 'Plan 2',
    problem_status: false
  },{
    id: 1,
    name: 'Plan 1',
    problem_status: true
  },
  {
    id: 2,
    name: 'Plan 2',
    problem_status: false
  },
])


// 监听菜单切换
const handleSelect = async (index) => {
  activeMenuIndex.value = index; // 更新当前选中的 menu
  postListStore.clearPostList();
  if (index == '1') {
    await postListStore.getHotPost(); // 等待数据加载
  }
  else if (index == '2') {
    await postListStore.getSubscribePost(); // 等待数据加载
  }
  else {
    await postListStore.getMyPost(); // 等待数据加载
  }
};


// NOTICE数据
const notices = ref([
  { id: 1, content: 'Welcome to SSEOJ' },
  { id: 2, content: 'STAY COOL' },
  { id: 3, content: 'PROMOTE YOUSELF' },
  { id: 4, content: 'DO NOT ATTACK OUR WEB PLZZZZ' },

])

const goToDiscussion = (postId) => {
  router.replace(`/discussion/${postId}`);
};

// plan
const getStudyPlan= async(id) => {
  const res = await getStudyPlanAPI(userStore.userInfo.id)
  myPlan.value = res.data
}

const handleSearch = () => {
  if (search_query.value.trim()) {
    if(searchType==='2')
      // 将搜索内容作为查询参数传递到 /discussion 页面
      router.push({
        path: '/discussion',
        query: { keyword:search_query.value }
      });
    else{
      router.push({
      path: '/discussion',
      query: { keyword:search_query.value }
      });
    }
  } else {
    ElMessage.error('请输入搜索内容！');
  }
};

onMounted(async () => {
  postListStore.clearPostList();
  await postListStore.getHotPost(); // 等待数据加载
  await getStudyPlan(userStore.userInfo.id)

  count.value = postListStore.count; // 更新总数
});

</script>

<style scoped>
.wrapper{
  display: flex;
  flex-direction: column;
  width: 85%;
  min-width: 800px;
  justify-content: space-between;
  margin: auto;
  gap:20px
}

.searchContainer{
  display: flex;
  flex-direction: column;
  margin: auto;
  width:80%;
  height: 100px;
  /* background: green; */
}

.searchContainer .el-input{
  margin: auto;
}

.searchContainer .el-radio-group{
  margin: auto;
}

.mainContainer{
  gap:10px;
  width: 100%;
  margin: auto;
  display: flex;
  margin-bottom:20px;
}


.wrapper_post{
width: 75%;
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
text-align:left; /* 居中显示 */
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
min-height: 75px;
}
.infinite-list-wrapper .list-item + .list-item {
margin-top: 1px;
}

.rightContainer{
  display: flex;
  flex-direction: column;
  width: 25%;
  /* background: green; */
  height: 600px;
  gap:20px;
}

.noticeContainer{
  width: 100%;
  border-radius: 12px;
  backdrop-filter: blur(20px);
  box-shadow:0 0 5px rgba(0, 0, 0, .5);
  height: 300px;
  display: flex;
  flex-direction: column;
  gap:10px;
}

.noticeBar {
  height: 85%;
  padding: 0;
  margin: 0;
  list-style: none;
}
.noticeBar .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: left;
  min-height: 50px;
  box-shadow:0 0 5px rgba(0, 0, 0, .5);
  margin-bottom: 10px;
  margin: 10px;
  cursor: pointer;
  gap:10px;
}


.noticeContainer label{
  font-weight: bold;
  font-size: larger;
  color: rgb(160, 206, 99);
  margin-left: 10px;
  margin-top: 5px;
}

.noticeId{
  font-weight: bold;
  font-size: larger;
  color: black;
  margin-left: 10px;
  margin-top: 5px;
}

.noticeContent{
  font-weight: bold;
  font-size: large;
  color: black;
  margin-left: 10px;
  margin-top: 5px;
}

.planContainer{
  width: 100%;
  border-radius: 12px;
  backdrop-filter: blur(20px);
  box-shadow:0 0 5px rgba(0, 0, 0, .5);
  min-height: 100px;
  max-height: 300px;
  display: flex;
  flex-direction: column;
}

.planContainer label{
  font-weight: bold;
  font-size: larger;
  color: gray;
  margin-left: 10px;
  margin-top: 5px;
}

.plans {
  height: 85%;
  padding: 0;
  margin: 0;
  list-style: none;
}

.plans .infinite-list-item{
  display: flex;
  align-items: center;
  justify-content: left;
  height: 50px;
  box-shadow:0 0 5px rgba(0, 0, 0, .5);
  margin-bottom: 10px;
  margin: 10px;
  cursor: pointer;
  gap:10px;
}

.planId{
  font-weight: bold;
  font-size: larger;
  color: black;
  margin-left: 10px;
  margin-top: 5px;
}

.planName{
  font-weight: bold;
  font-size: large;
  color: black;
  margin-left: 10px;
  margin-top: 5px;
}

.icon-duigou1{
  color: grey;
  margin-top: 5px;
  margin-left: 10px;
}

</style>
