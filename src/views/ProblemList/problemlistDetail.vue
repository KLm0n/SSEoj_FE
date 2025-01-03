<!-- eslint-disable vue/multi-word-component-names -->
<template>
   <layoutNav />
   <div class="container">
      <div class="header">
         <div class="option-block">
            <span class="option-btn" @click="selectProfile">
               <span class="iconfont icon-miaoshu1"></span>
               <span>题单简介</span>
            </span>
            <span class="h-divider"></span>
            <span class="option-btn" @click="selectList">
               <span class="iconfont icon-miaoshu"></span>
               <span>题目列表</span>
            </span>
         </div>
         <div class="func-block">
            <span class="iconfont icon-31zhuanfa" @click="transferProblemList"></span>
            <span :class="problemListDetail.star_status?'iconfont icon-shoucang': 'iconfont icon-shoucangdanse'" @click="toggleStar"></span>
         </div>
      </div>
      <div v-if="showProfile && loadComplete" class="profile">
         <div class="problemlist-info">
            <span>{{ problemListDetail.id + ' ' + problemListDetail.name }}</span>
            <div v-html="problemListDetail.summary"></div>
         </div>
         <div class="info-panel">
            <div class="info-title">创建者</div>

            <el-popover 
               @show="showUserInfoCard(problemListDetail.creator_info.id)"
               popper-style="background:transparent; border:none; box-shadow:none; margin-top:20px;"
               :show-arrow="false"
            >
               <template #reference>
                  <div class="creator-info" @click="jumpToUser(problemListDetail.creator_info.id)">
                     <el-avatar :src="problemListDetail.creator_info.avatar">KL</el-avatar>
                     <span class="creator-name">{{ problemListDetail.creator_info.username }}</span>
                  </div>
               </template>
               <template #default>
                  <UserInfoCard :userInfo="hoverUserInfo" @update:subscribe="toggleFollow"/>
               </template>
            </el-popover>
            <el-divider />
            <div class="info-title">状态</div>
            <div class="progress-info">
               <span>题目总数： {{ problemListDetail.problem_count }}</span>
               <span>完成数量： {{ problemListDetail.pass_count }}</span>
               <span>进度：</span>
               <el-progress :text-inside="true" :stroke-width="20"
                    :percentage="calcProgress(problemListDetail.pass_count, problemListDetail.problem_count)" color="#004D40">
               </el-progress>
            </div>
         </div>
      </div>
      
      <div v-else class="problemlist">
         <el-table :data="problemListDetail.problems" stripe :row-style="{ height: '70px' }"
            @row-click="rowSelected">
            <el-table-column label="状态" width="80">
               <template #default="scope">
                  <span v-if="scope.row.pass_status" class="iconfont icon-duigou1" style="text-align: center; font-size: 20px;"></span>
               </template>
            </el-table-column>
            <el-table-column prop="id" label="编号" width="100" />
            <el-table-column prop="name" label="题目名称" />
            <el-table-column label="标签">
               <template #default="scope">
                  <span v-for="tagId in scope.row.tags" :key="tagId">{{ tagsStore.idToTag(tagId) + " "
                     }}</span>
               </template>
            </el-table-column>
            <el-table-column label="通过率">
                  <template #default="scope">
                     <span>{{ (scope.row.pass_count / scope.row.attempt_count * 100).toFixed(1) + '%'
                        }}</span>
                  </template>
            </el-table-column>
            <el-table-column label="难度">
                  <template #default="scope">
                     <span :style="{ color: getDifficultColor(scope.row.difficulty) }">Lv.{{
                        scope.row.difficulty }}</span>
                  </template>
            </el-table-column>
         </el-table>
      </div>
   </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import layoutNav from '../Layout/components/layoutNav.vue';
import UserInfoCard from '@/components/UserInfoCard.vue';
import { onMounted, ref } from 'vue';
import { getProblemListDetailAPI, starProblemListAPI, transferProblemListAPI } from '@/apis/problemlist';
import { useTagsStore } from '@/stores/tagsStore';
import { getDifficultColor } from '@/utils/color';
import { getUserInfoAPI, subscribeUserAPI } from '@/apis/user';

const loadComplete = ref(false)
const route = useRoute()
const router = useRouter()
const problemlistId = route.params.id
const problemListDetail = ref({})
const tagsStore = useTagsStore()
const showProfile = ref(true)

// 获取题单
const getProblemListDetail = async() => {
   const res = await getProblemListDetailAPI(problemlistId)
   problemListDetail.value = res.data
   console.log(problemListDetail)
}
// 选择题目
const rowSelected = (row) => {
    router.push(`/problem/${row.id}/description`)
}

// 选择题单信息或者题单列表
const selectProfile = () => {
   showProfile.value = true
}
const selectList = () => {
   showProfile.value = false
}

// 收藏题单
const toggleStar = () => {
   problemListDetail.value.star_status = !problemListDetail.value.star_status
   starProblemListAPI(problemListDetail.value.id, problemListDetail.value.star_status)
}

// 转存题单
const transferProblemList = () => {
   transferProblemListAPI(problemListDetail.value.id)
}
// 计算进度条
const calcProgress = (pass_count, problem_count) => {
    return (pass_count / problem_count * 100).toFixed(1)
}

const hoverUserInfo = ref({})

const showUserInfoCard = async(id) => {
   if (id == undefined)
        return 
   const res = await getUserInfoAPI(id)
   hoverUserInfo.value = res.data
   console.log(hoverUserInfo.value)
}
const toggleFollow = (msg) => {
   hoverUserInfo.value.is_subscribe = msg
   hoverUserInfo.value.subscribers_count += msg? 1: -1
   subscribeUserAPI(hoverUserInfo.value.id, msg)
}

const jumpToUser = (id) => {
    console.log(id)
    const userWindow = window.open('', '_blank')
    const userProfileUrl = router.resolve({ path: `/user/${id}` }).href
    console.log(userProfileUrl)
    userWindow.location.href = userProfileUrl
}


// const toggleScroll = (value) => {
//   document.body.style.overflow = value ? 'hidden' : 'auto';
// };
// watch(showFavorites, (newValue) => {
//   toggleScroll(newValue);
// });
onMounted(async() => {
   await getProblemListDetail()
   await tagsStore.getTags()
   loadComplete.value = true
})
</script>

<style scoped>
.container{
   width: 85%;
   margin: 10px auto 20px auto;
   box-sizing: border-box;
   min-width: 800px;
}
.header {
   display: flex;
   align-items: center;
   justify-content: space-between;
   height: 60px;
}
.option-block{
   /* border-radius: 6px; */
   margin-left: 20px;
   padding: 0px 30px;
   display: flex;
   gap: 20px;
   align-items: center;
   border-bottom: 2px solid #BBB;
   height: 60px;
}
.func-block {
   margin-right: 20px;
   display: flex;
   gap: 10px;
}
.option-btn{
   padding: 10px;
   cursor: pointer;
   border-radius: 5px;
   transition: .3s;
}
.option-btn:hover{
   background-color: #e3e3e3;
}

.icon-miaoshu, .icon-miaoshu1{
   font-size: 18px;
   margin-right: 5px;
}
.icon-31zhuanfa, .icon-shoucangdanse, .icon-shoucang {
   background-color: #e4f1f3;
   color: rgb(20, 20, 20);
   border: 1px;
   border-radius: 100%;
   padding: 8px;
   width: 43px;
   height: 43px;
   text-align: center;
   font-size: 25px;
   cursor: pointer;
}
.icon-shoucang{
   color: #4C4C4E;
}


.h-divider{
   display: inline-block;
   width: 2px;
   height: 30px;
   background-color: rgb(189, 182, 182);
}

.problemlist, .profile{
   height: 2000px;
   width: 99%;
   border-radius: 10px;
   position: relative;
   margin-top: 15px;
   display: flex;
   margin-top: 40px;
}
.profile .problemlist-info {
   flex: 1;
   box-shadow: 0px 2px 6px 0px rgba(146, 143, 143, 0.7);
   margin-right: 30px;
   border-radius: 10px;
   padding: 20px 30px;
}
.profile .problemlist-info span{
   font-size: 28px;
   font-weight: 600;
}
.profile .problemlist-info div{
   margin-top: 20px;
}
.profile .info-panel {
   border-radius: 10px;
   width: 300px;
   height: 200px;
}
.profile .info-panel .creator-info {
   width: auto;
   height: 45px;
   cursor: pointer;
   display: inline-block;
   margin-bottom: 10px;
}
.creator-info .el-avatar{
   transform: translateY(15px);
}
.creator-info .creator-name{
   max-width: 200px;
   margin-left: 10px;
   overflow-wrap: break-word;
}
.profile .info-panel .progress-info {
   display: flex;
   flex-direction: column;
   gap: 12px;
   margin-top: 20px;
   font-size: 14px;
   color: #666;
}
.info-title {
   font-size: 20px;
   font-weight: 600;
}

.el-table {
   width: 99%;
}
</style>