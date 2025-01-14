<!-- eslint-disable vue/multi-word-component-names -->
<template>    
    <div class="searchHeader">
        <div class="searchBar">
            <input type="text" class="input" v-model="keyword">
            <span class="iconfont icon-sousuo" @click="search"></span>
        </div>
        <el-popover 
            popper-style="width: 400px; height: 300px; border-radius:10px;"
            :show-arrow="false"
            trigger="click"
        >
            <template #reference>
                <div class="tagBtn">
                    标签
                    <div v-if="selectedTag.length" class="tagNum">{{ selectedTag.length }}</div>
                </div>
            </template>
            <template #default>
                <tagView 
                    :selected-tag="selectedTag"
                    :all-tags="tagList"
                    @selectTag="addTag"
                    @closeTag="deleteTag"
                />
            </template>
        </el-popover>
        <div class="postSolutionBtn" @click="postSolution">发布题解</div>
    </div>

    <div v-if="isPageReady">
        <el-scrollbar>
            <ul v-infinite-scroll="loadSolutions" class="solutionList" :infinite-scroll-disabled="disabled"
                ref="infiniteScrollRef">
                <li v-for="(item, index) in solutions" :key="index">
                    <div class="solution-item">
                        <div class="title">
                            <span class="solution-title" @click="jumpToSolutionDetail(item.id)">{{ item.title }}</span>
                            <span class="solution-time">{{ transformDate(item.create_time) }}</span>
                            <span class="iconfont icon-jiantouarrow487" @click="jumpToSolutionDetail(item.id)"></span>
                        </div>

                        <el-popover 
                            @show="showUserInfoCard(item.user_info.id)"
                            @hide="userInfo = {}"
                            popper-style="background:transparent; border:none; box-shadow:none; margin-top:10px"
                            :show-arrow="false"
                            show-after="500"
                        >
                            <template #reference>
                                <div class="userInfo" @click="jumpToUser(item.user_info.id)">
                                    <el-avatar :size="25" style="font-size: 12px;" :src="getAvatar(item.user_info.avatar)">KL</el-avatar>
                                    <span>{{ item.user_info.username }}</span>
                                </div>
                            </template>
                            <template #default>
                                <UserInfoCard :userInfo="userInfo" @update:subscribe="toggleFollow"/>
                            </template>
                        </el-popover>
                        
                        <div class="sol-content">
                            {{ item.content }}
                        </div>
                        <div class="tagBar">
                            <el-tag v-for="tagId in item.tags" :key="tagId" color="#EAEAEA" :disable-transitions="true"
                                type="info">{{ tagStore.idToTag(tagId) }}</el-tag>
                        </div>
                        <div class="footer">
                            <span :class="item.is_good ? 'iconfont icon-BxsLike' : 'iconfont icon-BxLike'"
                                @click="toggleLike(item)"></span>
                            <span>{{ transNum(item.like_count) }}</span>
                            <span class="iconfont icon-comment"></span>
                            <span>{{ transNum(item.comment_count) }}</span>
                        </div>
                    </div>
                    <el-divider />
                </li>
                <p v-if="isLoading">Loading ...</p>
                <p v-if="noMore">No More</p>
            </ul>
        </el-scrollbar>
    </div>
</template>

<script setup>
import UserInfoCard from '@/components/UserInfoCard.vue';
import tagView from './tagView.vue';

import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getSolutionListAPI } from '@/apis/problem';
import { useTagsStore } from '@/stores/tagsStore';
import { transNum } from '@/utils/data_calculate';
import { likeSolutionAPI } from '@/apis/problem';
import { subscribeUserAPI, getUserInfoAPI } from '@/apis/user';
import { transformDate } from '@/utils/time';
import { getAvatar } from '@/utils/basic';

const userInfo = ref({})
const showUserInfoCard = async(id) => {
   if (id == undefined)
        return 
   const res = await getUserInfoAPI(id)
   userInfo.value = res.data
   console.log(userInfo.value)
}

const infiniteScrollRef = ref(null)
const isLoading = ref(false)
const noMore = computed(() => solutions.value.length >= count.value)
const disabled = computed(() => isLoading.value || noMore.value)

const isPageReady = ref(false)

const route = useRoute()
const router = useRouter()
const id = route.params.id
const reqData = ref({
    page: 1,
    page_size: 20,
    sort_type: 'timeAsc',
    keyword: null,
    tags: null
})

const solutions = ref([])
const tagList = ref([])
const count = ref(0)  //题解数

const selectedTag = ref([])
const keyword = ref('')
const tagStore = useTagsStore()


// 获取题解列表
const getSolutionList = async () => {
    const res = await getSolutionListAPI(id, reqData.value)
    console.log('end 1')
    solutions.value = res.data.solutions
    tagList.value = res.data.taglist
    count.value = res.data.count
}

// 搜索按钮
const search = async () => {
    isPageReady.value = false
    reqData.value.keyword = keyword.value
    reqData.value.page = 1
    await getSolutionList(id, reqData.value)
    isPageReady.value = true
}

// 无限加载列表加载数据
const loadSolutions = async () => {
    isLoading.value = true
    reqData.value.page++
    // console.log(`load data..... ${reqData.value.page}`)
    const res = await getSolutionListAPI(id, reqData.value)
    count.value = res.data.count
    tagList.value = res.data.taglist
    setTimeout(() => {
        isLoading.value = false
        solutions.value = [...solutions.value, ...res.data.solutions]
    }, 1000)
}

// 跳转到其他用户界面
const jumpToUser = (id) => {
    console.log(id)
    const userWindow = window.open('', '_blank')
    const userProfileUrl = router.resolve({ path: `/user/${id}` }).href
    console.log(userProfileUrl)
    userWindow.location.href = userProfileUrl
}

// 点赞
const toggleLike = async (item) => {
    await likeSolutionAPI(item.id, !item.is_good)
    item.like_count += item.is_good ? -1 : 1
    item.is_good = !item.is_good
}

// 发布题解按钮（跳转）
const postSolution = () => {
    const url = `/solution/create/?id=${id}`
    window.open(url, '_blank')
}

// 进入题解详细信息页面
const jumpToSolutionDetail = (sid) => {
    const url = `/problem/${id}/solutions/${sid}`
    window.open(url, '_blank')
}

// 点击关注用户
const toggleFollow = (msg) => {
    userInfo.value.is_subscribe = msg
    userInfo.value.subscribers_count += msg? 1: -1
    subscribeUserAPI(userInfo.value.id, msg)
}

// 添加和减少筛选tag
const addTag = async(tagId) => {
    selectedTag.value.push(tagId)
    await getSolutionList(id, reqData.value)
}
const deleteTag = async(tagId) => {
    selectedTag.value = selectedTag.value.filter(item => item != tagId)
    await getSolutionList(id, reqData.value)
}

onMounted(async () => {
    await getSolutionList(id, reqData.value)
    await tagStore.getTags()
    isPageReady.value = true
})

</script>


<style scope>
/*
顶部的搜索栏，标签按钮以及发布题解按钮
*/
.searchHeader {
    display: flex;
    flex-direction: row;
    padding: 0px 0px 10px 0px;
    min-height: 50px;
    gap: 10px;
    position: relative;
    z-index: 5;
    background-color: white;
    width: 100%;
    border-bottom: 1px solid #777676;
}

.searchBar {
    display: flex;
    border: 1px solid #BBBBBB;
    border-radius: 10px;
    overflow: auto;
    flex: 1;
    gap: 5px;
    align-items: center;
    justify-items: center;
    padding-right: 10px;
    transition: .2s;
}

.searchBar:hover,
.searchBar:focus-within {
    border: 1.1px solid #282727;
}

.input {
    margin: 0;
    padding: 0px 8px;
    font-size: 16px;
    /* background-color: blue; */
    flex: 1 1 0;
    border: none;
    outline: none;
    height: 100%;
    min-width: 10px;
}

.tagBtn {
    display: flex;
    flex-direction: row;
    justify-items: center;
    align-items: center;
    gap: 6px;
    border: 1px solid #BBBBBB;
    border-radius: 10px;
    padding: 0px 8px;
    font-size: 16px;
    cursor: pointer;
}

.tagNum {
    border: 1px solid #777676;
    border-radius: 8px;
    padding: 1px 4px;
    font-size: 14px;
    color: black;
}

.postSolutionBtn {
    cursor: pointer;
    display: flex;
    background-color: #008080;
    color: #FFFFFF;
    font-size: 16px;
    border-radius: 10px;
    justify-items: center;
    align-items: center;
    padding: 0px 13px;
}

.searchBar .icon-sousuo:hover {
    cursor: pointer;
}

.title {
    display: flex;
    margin-bottom: 10px;
    align-items: center;
}

.title .solution-time {
    color: #BBBBBB;
    font-size: 12px;

}

.title .solution-title {
    cursor: pointer;
    font-weight: bold;
    margin-right: 10px;
}

.title .solution-title:hover {
    color: #0047AB;
}

.title .icon-jiantouarrow487 {
    cursor: pointer;
    color: black;
    font-size: 20px;
    margin-left: auto;
    transition: .5s;
}

.title .icon-jiantouarrow487:hover {
    transform: translateX(4px);
}

.solution-item .userInfo {
    display: inline-block;
    font-size: 14px;
    /* align-items: center; */
    margin-bottom: 6px;
    /* background-color: #0047AB; */
    width: auto;
}

.userInfo .el-avatar {
    margin-right: 6px;
}

.userInfo:hover {
    cursor: pointer;
}

.user-info-card {
    position: absolute;
    transform: translateY(20px);
    background-color: white;
    z-index: 5;
    transition: opacity .5s;
}

.sol-content {
    position: relative;
    margin-bottom: 11px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 16px;
    width: 100%;
    padding-left: 20px;
}

.tagBar {
    padding-left: 20px;
    margin-bottom: 8px;
}


.solutionList {
    position: relative;
    padding-top: 10px;
    width: 100%;
    z-index: 1;
    height: calc(100vh - 230px);
    overflow: auto;
    /* width: 300px; */
}



.solutionList li {
    list-style: none;
}

.solutionList .solution-item {
    height: 140px;
}

.el-divider {
    margin: 15px 0px 15px 0px;
}

.footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 20px;
}

.icon-BxLike,
.icon-BxsLike,
.icon-comment {
    font-size: 20px;
    margin-right: 6px;
    cursor: pointer;
}

.icon-BxLike+span,
.icon-BxsLike+span,
.icon-comment+span {
    font-size: 16px;
    margin-right: 20px;
}
</style>
