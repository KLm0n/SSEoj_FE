<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <div class="wrapper">
    <div class="container">
      <div class="filter">
        <el-menu
          :default-active="'1'"
          class="menu_sort"
          mode="vertical"
          @select="handleSelect"
          background-color="rgb(200, 200, 200);"
          text-color="grey"
          active-text-color="black"
          :ellipsis="false"
        >
          <el-menu-item index="1">按热度</el-menu-item>
          <el-menu-item index="2">按时间</el-menu-item>
        </el-menu>
        <el-button plain type="info" @click="postDiscussion">发布帖子</el-button>
      </div>
      <div class="postList">
        <div class="infinite-list-wrapper" style="overflow: auto">
          <ul v-infinite-scroll="load" class="list">
            <li v-for="post in filteredPosts" :key="post.post_id" class="list-item" @click="goToDiscussion(post.post_id)">
              <ListItemContent
                :avatar="post.avatar"
                :title="post.post_title"
                :username="post.username"
                :time="post.create_time"
                :commentCount="post.comment_count"
                :likeCount="post.like_count"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="pagination">
      <el-pagination layout="prev, pager, next, jumper" v-model:current-page="currentPage" :total="postListStore.count" :background="true" :page-size="pageSize" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { usePostListStore } from '@/stores/postListStore';
import ListItemContent from './ListItemContent.vue';
import { useRouter } from 'vue-router';

const postListStore = usePostListStore();
const router = useRouter();

const count = ref(0);
const loadedCount = ref(0);
const loading = ref(false);
const noMore = computed(() => loadedCount.value >= count.value);
const disabled = computed(() => loading.value || noMore.value);

const currentPage = ref(1);
const pageSize = ref(30);
const sortType = ref('likeDesc'); // 默认按热度排序

const load = async () => {
  if (disabled.value) return;
  loading.value = true;

  try {
    await postListStore.getPostList(params.value);
    loadedCount.value = postListStore.postList.length;
  } catch (err) {
    console.error('Error loading data:', err);
  } finally {
    loading.value = false;
  }
};

const params = computed(() => ({
  page_num: currentPage.value || 1,
  page_size: pageSize.value || 30,
  sort_type: sortType.value,
  keyword: ''
}));

// 处理排序菜单点击
const handleSelect = (index) => {
  if (index === '2') {
    // 如果当前是按时间排序
    if (sortType.value === 'timeDesc') {
      sortType.value = 'timeAsc'; // 切换为升序
    } else {
      sortType.value = 'timeDesc'; // 切换为降序
    }
  }
};

// 根据排序类型过滤帖子
const filteredPosts = computed(() => {
  let sortedPosts = [...postListStore.postList];

  if (sortType.value === 'likeDesc') {
    // 按点赞数降序排序
    sortedPosts.sort((a, b) => b.like_count - a.like_count);
  } else if (sortType.value === 'timeDesc') {
    // 按时间降序排序
    sortedPosts.sort((a, b) => new Date(b.create_time) - new Date(a.create_time));
  } else if (sortType.value === 'timeAsc') {
    // 按时间升序排序
    sortedPosts.sort((a, b) => new Date(a.create_time) - new Date(b.create_time));
  }

  return sortedPosts;
});

const handleCurrentChange = (val) => {
  postListStore.getPostList(params.value);
};

const goToDiscussion = (postId) => {
  router.replace(`/discussion/${postId}`);
};

const postDiscussion = () => {
  const url = '/discussion/create';
  window.open(url, '_blank');
};

onMounted(async () => {
  await postListStore.getPostList(params.value); // 等待数据加载
  count.value = postListStore.count; // 更新总数
});
</script>

<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: auto;
    width: 85%;
    margin-bottom: 20px;
    min-width: 800px;
}

.filter {
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
    min-width: 150px;
    height: 200px;
    margin-right: 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    z-index: 1000;
    flex-shrink: 1;
}

.filter .el-button{
  margin-top: 20px;
  margin-right: 10px;
  align-self: flex-end;
}

.container {
    display: flex;
    padding: 0px auto;
    box-sizing: border-box;
    margin-bottom: 20px;
}


.postList {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 99%;
    max-height: 700px;
    padding: 0px auto;
    margin-bottom:50px ;
    background:transparent;
    border-radius: 6px;
    backdrop-filter: blur(20px);
    box-shadow:0 0 5px rgba(0, 0, 0, .5);
    align-items: center; /* 水平居中对齐 */
}

.infinite-list-wrapper {
position: relative;
margin-top: 25px; /* 与菜单之间的间距 */
width: 95%; /* 与 menu_main 的宽度一致 */
text-align: center;
height: 90%; /* 自动根据内容调整高度 */
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

.menu_sort{
position: relative;
top: 5px;
width: 90%;
border-radius: 12px;
border:none;
overflow: hidden;
align-items: center;
justify-content: center;

}

.menu_sort .el-menu-item{
text-align: center; /* 居中显示 */
font-size:16px;      /* 可选：设置字体大小 */
font-weight: 800;
margin: auto;
}
.menu_sort .el-menu-item:hover {
background-color: white;  /* 鼠标悬浮时的背景颜色 */
}
.menu_sort .el-menu-item.is-active {
background-color: white;  /* 选中项的背景色 */
}

.pagination {
    align-self: flex-end;
}
</style>
