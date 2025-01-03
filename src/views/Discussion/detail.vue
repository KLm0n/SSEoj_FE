<template>
  <layoutNav />
  <div class="wrapper">
    <div class="containerLeft">
      <div class="information">
        <div class="authorContainer">
          <label>作者</label>
          <img :src="postStore.post.avatar"  class="avatar" />
          <p class="authorName">{{ postStore.post.name }}</p>
        </div>
        <div class="timeContainer">
          <label>发布时间</label>
          <p>{{ postStore.post.create_time }}</p>
        </div>
        <el-button type="info" plain class="replyBtn" @click="isReplyVisible = true">回复贴主</el-button>

      </div>
      <!-- 回复贴主 -->
      <div v-if="isReplyVisible" class="replyContainer">
        <div class="replyHeader">
          <label>编辑回复</label>
          <span class="iconfont icon-qingkong" @click="isReplyVisible = false"></span>
        </div>
        <el-input v-model="input"  placeholder="请输入"  type="textarea" :autosize="{ minRows: 2, maxRows: 20 }" resize=none class="replyInput" />
        <el-button type="info" plain class="btnSubmit" @click="isReplyVisible = false">发布</el-button>

      </div>
    </div>

    <div class="containerRight">
      <div class="postContainer">
        <!-- 标题 -->
        <div class="titleContainer">
          <label>{{ postStore.post.post_title }}</label>
          <div class="likeContainer">
            <span v-if="!postStore.post.is_good" class="iconfont icon-BxLike" @click="handleLike()"></span>
            <span v-else class="iconfont icon-BxsLike" @click="handleLike()"></span>
            <label class="likeCount">{{ postStore.post.like_count }}</label>
          </div>
        </div>

        <!-- 内容容器 -->
        <div class="contentContainer">
          <!-- 使用 v-html 来渲染 HTML 内容 -->
          <div v-html="postStore.post.post_content"></div>
        </div>
      </div>
        <!--评论容器-->
      <div class="commentsContainer">
        <div class="sortContainer">
          <label>{{ postStore.post.comment_count }}</label>
          <el-dropdown v-model="selectedItem">
            <span class="el-dropdown-link">
              {{ selectedItem || '排序' }}
            <!-- <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon> -->
            </span>
            <template #dropdown>
              <el-dropdown-menu >
                <el-dropdown-item @click="selectItem('按热度排序')">123</el-dropdown-item>
                <el-dropdown-item @click="selectItem('按时间排序')">456</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="commentsList">
          <CommentItem :commentsData="commentStore.comments" @reply="handleReply" />
        </div>
      </div>

      <div class="pagination">
          <el-pagination layout="prev, pager, next, jumper" v-model:current-page="currentPage" :total="commentStore.count"
              :background="true" :page-size="pageSize" @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>

<script setup>
import layoutNav from '@/views/Layout/components/layoutNav.vue';
import { ref, onMounted,computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePostStore } from '@/stores/postStore';
import { useCommentStore } from '@/stores/commentStore';
import CommentItem from '@/views/Discussion/CommentItem.vue';


const route = useRoute()
const router = useRouter()
const params = route.params
const id = params.id;
const postStore= usePostStore();
const commentStore= useCommentStore();

const count = ref(0);

const selectedItem = ref('');

const currentPage=ref(1);
const pageSize = ref(30);

//更新排序显示
const selectItem = (item) =>{
  selectedItem.value=item;
}

const page_params = computed(() => ({
  page_num: currentPage.value || 1,
  page_size: pageSize.value || 30,
  id: params.id
}));

const input = ref('')
const isReplyVisible = ref(false); // 控制 replyContainer 的显示和隐藏



// 添加回复逻辑
const handleReply = (parentComment, replyContent) => {
  const username = prompt("请输入要回复的用户名");
  parentComment.replies.push({
    username: "User", // 当前用户
    time: new Date().toLocaleString(),
    content: replyContent,
    replyTo: username || parentComment.username,
    replies: []
  });
};

const handleCurrentChange = (val) => {
  commentStore.getComments(page_params.value);
}

const handleLike= () => {
  const is_good = postStore.post.is_good
  postStore.likePost({id, is_good})
}


// 你可以在实际应用中替换为真实的 API 请求
onMounted(async () => {
  await postStore.getPost(id);  // 等待 API 请求完成
  await commentStore.getComments(page_params.value); // 等待数据加载
  count.value = commentStore.count; // 更新总数
  console.log(commentStore.comments)
})

</script>

<style scoped>
/* 外层容器 */
.wrapper {
  display: flex;
  flex-direction: row;
  /* align-items: center; */
  width: 85%;
  margin: auto;
  min-width: 800px;
  margin-bottom: 20px;
}

.containerLeft{
  min-width: 240px;
  /* display: flex; */
  padding: 0px auto;
  box-sizing: border-box;
  /* background: black; */
  margin-right: 20px;
}

/* 右边容器 */
.containerRight {
  display: flex;
  flex-direction: column;
  padding: 0px auto;
  box-sizing: border-box;
  width: 99%;
  margin: auto;
}

.information {
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
  min-width: 240px;
  height: 230px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  flex-shrink: 1;
}

.authorContainer {
  display: flex;
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
}


.authorContainer label{
  display: flex;
  font-size: 15px;
  font-weight: bold;
  margin: auto;
  margin-left: 0px;
}

.authorContainer img {
  margin: auto;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;

}

.authorContainer p{
  display: flex;
  align-items: center;
}

.authorName{
  min-width: 60px;
  text-align: left;
  color:grey;
  font-weight: bold;
}

.timeContainer {
  display: flex;
  padding: 5px;
  margin-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
}


.timeContainer label{
  display: flex;
  font-size: 15px;
  font-weight: bold;
  margin: auto;
  margin-left: 0px;
}

.timeContainer p{
  min-width: 60px;
  text-align: center;
  color:grey;
  font-weight: bold;
}

.replyBtn{
  display: flex;
  margin-top:30px;
  margin-right: 20px;
  width:40%;
  align-self: flex-end;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
}

/* 帖子容器 */
.postContainer {
  display: flex;
  flex-direction: column;
  padding: 20px;
  /* margin-bottom: 50px; */
  background: transparent;
  border-radius: 6px;
  backdrop-filter: blur(20px);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  align-items: flex-start; /* 内容左对齐 */
}

/* 标题容器 */
.titleContainer {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.titleContainer label {
  font-size: 20px;
  font-weight: bold;
  width: 90%;
}


.likeContainer {
  align-items: center;
  cursor: pointer;
}

.icon-BxLike{
  color:grey;
}

.icon-BxsLike{
  color:grey;
}

.likeCount {
  color:grey;
}

/* 内容容器 */
.contentContainer {
  background-color: rgb(240, 240, 240);
  color: black;
  padding: 15px;
  /* padding-top:5px; */
  border-radius: 6px;
  width: 100%; /* 自适应父容器的宽度 */
  box-sizing: border-box; /* 保证 padding 不影响宽度 */
  overflow-wrap: break-word; /* 确保长文本能自动换行 */
  word-wrap: break-word;
  margin-bottom: 20px;
}

/* 评论区容器 */
.commentsContainer {
  padding: 0px;
  /* background-color: #f7f7f7; */
  /* border-radius: 6px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); */
  margin-top: 20px; /* 添加一定的上边距，确保与 postContainer 分开 */

}

.sortContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: auto;
}

.sortContainer label{
  margin-top:5px;
  font-weight: bold;
}

.el-dropdown{
  margin-top:5px;
  margin-right: 10px;
}


.el-dropdown-link{
  font-weight: bold;
  cursor: pointer;
  color: black;
  display: flex;
  align-items: center;
  outline: none;
}

.pagination {
    align-self: flex-end;
}

.replyContainer{
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
  min-width: 240px;
  /* height: 500px; */
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  flex-shrink: 1;
  margin-top: 40px;
}

.replyHeader{
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;

}
.replyHeader label{
  font-weight: bold;
  margin-left: 7px;
}

.replyInput{
  width:95%;
  margin: auto;
  margin-top:0px;
  margin-bottom: 10px;
}



.btnSubmit{
  width:25%;
  align-self: flex-end;
  margin-right: 10px;
  margin-bottom: 10px;
  width:25%;
  align-self: flex-end;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
}

.icon-qingkong{
  font-size: 30px;
  margin-left: 135px;
  margin-top: -10px;
  cursor: pointer;
}

</style>
