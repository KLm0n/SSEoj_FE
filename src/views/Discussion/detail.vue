<template>
  <layoutNav />
  <div class="wrapper">
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
          <div class="commentCount">
            <span class="iconfont icon-comment" ></span>
            <span>{{ postStore.post.comment_count }}</span>
          </div>
        </div>

        <div class="information">
          <div class="authorContainer">
            <img :src="postStore.post.avatar"  class="avatar" />
            <p class="authorName">{{ postStore.post.name }}</p>
            <p class="time">{{ getFullDate(postStore.post.create_time) }}</p>
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
        <div class="replyPost">
          <div style="margin-top: 10px;">
              <ReplyEditor @click:post="postComment"/>
          </div>
        </div>

        <div class="sortContainer">
          <el-dropdown v-model="selectedItem">
            <span class="el-dropdown-link">
              {{ selectedItem || '按热度排序' }}
            </span>
            <template #dropdown>
              <el-dropdown-menu >
                <el-dropdown-item @click="selectItem('按热度排序')">按热度</el-dropdown-item>
                <el-dropdown-item @click="selectItem('按时间排序')">按时间</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <!-- <div class="commentsList">
          <CommentItem :commentsData="commentStore.comments" @reply="handleReply" />
        </div> -->
        <CommentItem :id="id" class="comment-panel"/>
      </div>

      <!-- <div class="pagination">
          <el-pagination layout="prev, pager, next, jumper" v-model:current-page="currentPage" :total="commentStore.count"
              :background="true" :page-size="pageSize" @current-change="handleCurrentChange" />
      </div> -->
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
import { transformDate, getDate, getFullDate} from '@/utils/time';
import ReplyEditor from '@/components/ReplyEditor.vue';
import { commentPostAPI } from '@/apis/comment';

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

const replyData = ref({
  id: id,
  content: null,
  reply_to_id: null,
  reply_to_username: null,
  under_comment_id: null
})

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

// 点击发布
const postComment = async(content) => {
  const data = {
      id: replyData.value.id,
      content: content,
      reply_to_id: replyData.value.reply_to_id,
      under_comment_id: replyData.value.under_comment_id
  }
  if(data.content !=''){
    await commentPostAPI(data)
  }
  else{
    ElMessage.error("内容不能为空")
  }
  console.log(data)
}

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
  // await commentStore.getComments(page_params.value); // 等待数据加载
  // count.value = commentStore.count; // 更新总数
  // console.log(commentStore.comments)
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


/* 右边容器 */
.containerRight {
  display: flex;
  flex-direction: column;
  padding: 0px auto;
  box-sizing: border-box;
  width: 85%;
  margin: auto;
}

.information {
  border-radius: 10px;
  display: flex;
  z-index: 1000;
  flex-shrink: 1;
  margin-bottom: 5px;
  align-items: center;
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

.time{
  min-width: 60px;
  text-align: left;
  color:rgb(176, 175, 175);
  margin-left: 15px;
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
  margin-right: 10px;
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

.commentCount {
  align-items: center;
}

.icon-comment{
  color:grey;
}

.commentCount span{
  font-size: 20px;
  font-weight: bold;
  width: 90%;
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
  font-size: x-large;
  cursor: pointer;
  color: black;
  display: flex;
  align-items: center;
  outline: none;
  align-self: flex-end;
  margin-bottom: 10px;
}

.pagination {
    align-self: flex-end;
}



.icon-qingkong{
  font-size: 30px;
  margin-left: 135px;
  margin-top: -10px;
  cursor: pointer;
}

.replyPost{
  margin-bottom: 30px;
}

</style>
