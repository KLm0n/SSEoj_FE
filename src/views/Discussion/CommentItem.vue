<template>
  <ul v-infinite-scroll="loadComments" :infinite-scroll-disabled="disabled">
      <li v-for="item in comments" :key="item.id" style="list-style-type: none;">
          <div class="comment-item">
              <el-popover
                  @show="showUserInfoCard(item.user_info.id)"
                  @hide="userInfo = {}"
                  popper-style="background:transparent; border:none; box-shadow:none; margin-top:10px"
                  show-arrow=false
                  show-after=500
              >
                  <template #reference>
                      <div class="userInfo" @click="jumpToUser(item.user_info.id)">
                          <el-avatar :size="35" style="font-size: 12px;" :src="item.user_info.avatar">BB</el-avatar>
                          <span style="margin-left: 5px;">{{ item.user_info.username }}</span>
                      </div>
                  </template>
                  <template #default>
                      <UserInfoCard :userInfo="userInfo" @update:subscribe="toggleFollow"/>
                  </template>
              </el-popover>
              <div class="comment-content" v-html="item.content"></div>
              <div class="footer">
                  <span class="comment-time"
                  style="font-size: 15px; color: #BBB; margin-right: 20px;"
                  >
                      {{ transformDate(item.create_time) }}
                  </span>
                  <span :class="item.is_good ? 'iconfont icon-BxsLike' : 'iconfont icon-BxLike'"
                      @click="toggleLike(item)"></span>
                  <span>{{ transNum(item.like_count) }}</span>
                  <span class="replyBtn" @click="clickReply(item.id, null, item.user_info.username)">回复</span>
              </div>

              <div class="second-comment" v-if="secondLevelComments.get(item.id)?.expand">
                  <div v-for="subitem in secondLevelComments.get(item.id).comments" :key="subitem.id">
                      <div style="display: flex;">
                          <el-popover
                              @show="showUserInfoCard(subitem.user_info.id)"
                              @hide="userInfo = {}"
                              popper-style="background:transparent; border:none; box-shadow:none; margin-top:10px"
                              show-arrow=false
                              show-after=500
                          >
                              <template #reference>
                                  <div class="userInfo" @click="jumpToUser(subitem.user_info.id)">
                                      <el-avatar :size="25" style="font-size: 12px;" :src="subitem.user_info.avatar">KL</el-avatar>
                                      <span style="margin-left: 5px; font-size: 14px;">{{ subitem.user_info.username }}</span>
                                  </div>
                              </template>
                              <template #default>
                                  <UserInfoCard :userInfo="userInfo" @update:subscribe="toggleFollow"/>
                              </template>
                          </el-popover>
                          <div style="margin-top: 13px; margin-left: 8px;">reply to</div>
                          <el-popover
                              @show="showUserInfoCard(subitem.user_info.id)"
                              @hide="userInfo = {}"
                              popper-style="background:transparent; border:none; box-shadow:none; margin-top:10px"
                              show-arrow=false
                              show-after=500
                          >
                              <template #reference>
                                  <div class="userInfo" @click="jumpToUser(subitem.reply_to_id)">
                                      <span style="margin-left: 8px; font-size: 14px; color: #0cac0c;">@{{ subitem.reply_to_name }}</span>
                                  </div>
                              </template>
                              <template #default>
                                  <UserInfoCard :userInfo="userInfo" @update:subscribe="toggleFollow"/>
                              </template>
                          </el-popover>
                      </div>
                      <div style="margin-left: 20px; margin-top: 6px;" v-html="subitem.content"></div>
                      <div class="footer">
                          <span class="comment-time"
                          style="font-size: 15px; color: #BBB; margin-right: 20px;"
                          >
                              {{ transformDate(subitem.create_time) }}
                          </span>
                          <span :class="subitem.is_good ? 'iconfont icon-BxsLike' : 'iconfont icon-BxLike'"
                              @click="toggleLike(subitem)"></span>
                          <span>{{ transNum(subitem.like_count) }}</span>
                          <span class="replyBtn" @click="clickReply(item.id, subitem.id, subitem.user_info.username)">回复</span>
                      </div>
                  </div>
                  <el-pagination
                      :hide-on-single-page="true"
                      :total="secondLevelComments.get(item.id).count"
                      :page-size="secondLevelComments.get(item.id).page_size"
                      layout="prev, pager, next"
                      @current-change="(val) => handleCurrentChange(val, item.id)"
                  />
              </div>
              <div v-if="item.comments_count && !secondLevelComments.get(item.id)?.expand" class="expand-comment" @click="expand2ndComment(item.id)">
                  共 {{ transNum(item.comments_count) }} 条回复，点击查看
              </div>
              <div v-if="secondLevelComments?.get(item.id)?.expand" @click="close2ndComment(item.id)" class="close-comment">
                  收起
              </div>
          </div>
          <div v-if="item.id == commentWriterId" style="margin-top: 20px;">
              <ReplyEditor :holder="replyHolder" @click:post="postComment"/>
          </div>

          <el-divider />
      </li>
      <div style="display: flex; align-items: center;
      justify-content: center; font-size: 16px;">
          <p v-if="isLoading" style="color: #0cac0c;">Loading ...</p>
          <p v-if="noMore">No More</p>
      </div>

  </ul>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { getPrimaryCommentAPI, getSecondCommentAPI,commentPostAPI} from '@/apis/comment';
import { useRouter } from 'vue-router';
import { transNum } from '@/utils/data_calculate';
import { subscribeUserAPI, getUserInfoAPI, } from '@/apis/user';
import { transformDate } from '@/utils/time';
import ReplyEditor from '@/components/ReplyEditor.vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const props = defineProps(['id'])
const isLoading = ref(false)
const noMore = computed(() => comments.value.length >= comments_cnt.value)
const disabled = computed(() => isLoading.value || noMore.value)

const router = useRouter()
const reqData = ref({
  page_num: 1,
  page_size: 30
})
const comments = ref([])
const comments_cnt = ref(0)

const secondLevelComments = ref(new Map())

const userInfo = ref({})
const commentWriterId = ref(null)
const replyData = ref({
  id: props.id,
  content: null,
  reply_to_id: null,
  reply_to_username: null,
  under_comment_id: null
})
const replyHolder = computed(() => {
  return `Reply to @ ${replyData.value.reply_to_username}`
})
// 获取用户信息
const showUserInfoCard = async(id) => {
 if (id == undefined)
      return
 const res = await getUserInfoAPI(id)
 userInfo.value = res.data
 console.log(userInfo.value)
}
// 点击关注用户
const toggleFollow = (msg) => {
  userInfo.value.is_subscribe = msg
  userInfo.value.subscribers_count += msg? 1: -1
  subscribeUserAPI(userInfo.value.id, msg)
}

// 获取一级评论
const getPost1stComment = async() => {
  const res = await getPrimaryCommentAPI({id:props.id, page_num:reqData.value.page_num, page_size:reqData.value.page_size})
  console.log(res.data)
  comments_cnt.value = res.data.count
  comments.value = res.data.comments
  console.log(comments.value)
}
// 展开二级评论
const expand2ndComment = async(comment_id) => {
  const res = await getSecondCommentAPI({post_id:props.id,comment_id:comment_id, page_num:1, page_size:8})
  secondLevelComments.value.set(comment_id, {
      count: res.data.count,
      comments: res.data.comments,
      expand: true,
      page_num: 1,
      page_size: 8
  })
  // console.log(secondLevelComments.value)
}
// 关闭二级评论
const close2ndComment = (comment_id) => {
  const item = secondLevelComments.value.get(comment_id)
  item.expand = false
  secondLevelComments.value.set(comment_id, item)
}
// 点击回复
const clickReply = (itemId, subitemId, username) => {
  commentWriterId.value = itemId
  replyData.value.under_comment_id = itemId
  replyData.value.reply_to_id = subitemId
  replyData.value.reply_to_username = username
}
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
    ElMessageBox.error("内容不能为空")
  }
  else{
    ElMessage.error("内容不能为空")
  }
  console.log(data)
}
const handleCurrentChange = async(val, id) => {
  // const res = await getSolution2ndCommentAPI(props.id, val, 8)
  // secondLevelComments.value.set(id, {
  //     count: res.data.count,
  //     comments: res.data.comments,
  //     expand: true,
  //     page_num: val,
  //     page_size: 8
  // })
}

// 无限列表加载评论
const loadComments = async() => {
  console.log('loading ..')
  isLoading.value = true
  reqData.value.page_num += 1
  const res = await getPrimaryCommentAPI({id:props.id, page_num:reqData.value.page_num, page_size:reqData.value.page_size})
  setTimeout(() => {
      isLoading.value = false
      comments.value = [...comments.value, ...res.data.comments]
  }, 1000)
}
// 调转到用户页面
const jumpToUser = (id) => {
  console.log(id)
  const userWindow = window.open('', '_blank')
  const userProfileUrl = router.resolve({ path: `/user/${id}` }).href
  console.log(userProfileUrl)
  userWindow.location.href = userProfileUrl
}

// 点赞
const toggleLike = (item) => {
  likeSolutionCommentAPI(item.id, !item.is_good)
  item.like_count += item.is_good ? -1 : 1
  item.is_good = !item.is_good
}

onMounted(async() => {
  await getPost1stComment()
})
</script>

<style scoped>
.userInfo {
  display: inline-flex;
  align-items: center;
  margin-top: 10px;
}

.comment-content {
  margin-top: 10px;
  margin-left: 20px;
}
.footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 20px;
  margin-top: 13px;
}

.icon-BxLike,
.icon-BxsLike,
.icon-comment {
  font-size: 20px;
  margin-right: 6px;
  cursor: pointer;
}

.replyBtn {
  cursor: pointer;
  color: rgb(0, 0, 0);
}
.replyBtn:hover {
  color: #1d5b1d;
}

.expand-comment,
.close-comment {
  cursor: pointer;
  margin-left: 20px;
  margin-top: 12px;
  font-size: 14px;
}
.expand-comment:hover,
.close-comment:hover {
  color: #1d5b1d;
}

.second-comment {
  margin-top: 10px;
  margin-left: 20px;
}

.commentBtn {
  margin-top: 10px;
  padding: 8px;
  border-radius: 4px;
  width: 70px; text-align: center;
  margin-left: auto; margin-right: 20px;
  cursor: pointer;
  background-color: #0cac0c;
  transition: opacity .3s linear;
  color: white;
}
.commentBtn:hover {
  opacity: 80%;
}
</style>
