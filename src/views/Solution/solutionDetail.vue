<!-- eslint-disable vue/multi-word-component-names -->

<template>
    <layoutNav />
    <div class="wrapper">
        <div class="container">
            <div class="title">
                {{ solutionDetail.title }}
            </div>
            <el-popover 
                @show="showUserInfoCard(userInfo.id)"
                popper-style="background:transparent; border:none; box-shadow:none; margin-top:10px"
                :show-arrow="false"
                show-after="500"
            >
                <template #reference>
                    <div class="userInfo" @click="jumpToUser(userInfo.id)">
                        <el-avatar :size="30" style="font-size: 12px;" :src="getAvatar(userInfo.avatar)">KL</el-avatar>
                        <span style="font-size: 16px;">{{ userInfo.username }}</span>
                    </div>
                </template>
                <template #default>
                    <UserInfoCard :userInfo="userInfo" @update:subscribe="toggleFollow"/>
                </template>
            </el-popover>
            <div v-html="solutionDetail.content" style="margin-top: 20px;"></div>
        </div>
        <div class="footer">
            <span :class="solutionDetail.is_like? 'iconfont icon-BxsLike':'iconfont icon-BxLike'" @click="toggleLike"></span>
            <span>{{ transNum(solutionDetail.like_count) }}</span>
            <span class="create-time">发布时间：{{ transformDate(solutionDetail.create_time) }}</span>
        </div>
    </div>
    <div class="comment-wrapper">
        <div>
            <span style="border-left: 3px solid black; 
            font-size: 25px; padding-left: 10px; margin-right: 5px;">
                评论
            </span>
            <span style="font-size: 17px;">{{ transNum(solutionDetail.comment_count) }}</span>
        </div>
        <div style="margin-top: 10px;">
            <ReplyEditor @click:post="postComment"/>
        </div>  
        <CommentPanel :id="sid" class="comment-panel"/>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getSolutionDetailAPI, commentSolutionAPI } from '@/apis/problemset';
import layoutNav from '../Layout/components/layoutNav.vue';
import { subscribeUserAPI, getUserInfoAPI } from '@/apis/user';
import { transformDate } from '@/utils/time';
import { transNum } from '@/utils/data_calculate';
import { useTagsStore } from '@/stores/tagsStore';
import { likeSolutionAPI } from '@/apis/problem';
import ReplyEditor from '@/components/ReplyEditor.vue';
import CommentPanel from './component/CommentPanel.vue';
import { getAvatar } from '@/utils/basic';

const route = useRoute()
const router = useRouter()
const pid = route.params.pid
const sid = route.params.sid
const solutionDetail = ref({})
const userInfo = ref({})
const userInfoCard = ref({})
const tagsStore = useTagsStore()

// 跳转到其他用户界面
const jumpToUser = (id) => {
    console.log(id)
    const userWindow = window.open('', '_blank')
    const userProfileUrl = router.resolve({ path: `/user/${id}` }).href
    console.log(userProfileUrl)
    userWindow.location.href = userProfileUrl
}

// 显示用户信息
const showUserInfoCard = async(id) => {
   if (id == undefined)
        return 
   const res = await getUserInfoAPI(id)
   userInfoCard.value = res.data
}

// 关注用户
const toggleFollow = (msg) => {
    userInfoCard.value.is_subscribe = msg
    userInfoCard.value.subscribers_count += msg? 1: -1
    subscribeUserAPI(userInfoCard.value.id, msg)
}

// 点赞评论
const toggleLike = () => {
    solutionDetail.value.is_like = !solutionDetail.value.is_like
    solutionDetail.value.like_count += solutionDetail.value.is_like? 1: -1
    likeSolutionAPI(solutionDetail.value.id, solutionDetail.value.is_like)
}

// 发布评论
const postComment = async(content) => {
    const data = {
        id: sid,
        content: content,
        reply_to_id: null,
        under_comment_id: null
    }
    await commentSolutionAPI(data)
    console.log(data)
}

onMounted(async() => {
    const res = await getSolutionDetailAPI(pid, sid)
    solutionDetail.value = res.data
    const res_info = await getUserInfoAPI(solutionDetail.value.user_info.id)
    userInfo.value = res_info.data
    console.log(userInfo.value)
    await tagsStore.getTags()
})
</script>

<style scoped>
.wrapper {
    width: 70%;
    margin: 20px auto;
    border: 1px solid #333;
    padding: 20px;
    border-radius: 10px;
}
.title {
    font-size: 22px;
    font-weight: 500;
}
.userInfo {
    display: inline-flex;
    align-items: center;
    margin-top: 10px;
}

.icon-BxsLike, .icon-BxLike {
    font-size: 20px;
}

.footer {
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    margin-left: 0px;
}
.create-time {
    color: #BBB
}
.comment-wrapper{
    width: 70%;
    margin: auto;
}

</style>