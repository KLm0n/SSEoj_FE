<!-- eslint-disable vue/multi-word-component-names -->

<template>
    <div class="header">
        <div class="searchBar">
            <input type="text" class="input" v-model="keyword" placeholder="请输入题单标题或编号">
            <span class="iconfont icon-sousuo" @click="getProblemList(params)"></span>
        </div>
        <el-select v-model="sort_type" style="width: 180px;--el-border-color:white;" @change="getProblemList(params)">
            <el-option
            v-for="item in selectItem"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            <div style="display: flex; justify-content: space-between;">
                <span>{{ item.label }}</span>
                <span v-if="item.value == sort_type" class="iconfont icon-duigou"></span>
            </div>
            </el-option>
            <template #label="{label}">
                <div style="display: flex; align-items: center; font-size: 16px; color: black;">
                    <span class="iconfont icon-paixu" style="font-size: 20px; margin-right: 6px;"></span>
                    <span>{{ label }}</span>
                </div>
            </template>
        </el-select>
    </div>
    <div class="wrapper">
        <div class="problemlist">
            <div v-for="plistItem in problemlist" :key="plistItem.id" class="problemlist-item"
                @click="router.push(`/problemlist/${plistItem.id}`)">

                <div class="problemlist-header">
                    <span class="problemlist-title">{{ plistItem.id + '.' + plistItem.title }}</span>
                    <div class="problemlist-star">
                        <span
                            :class="plistItem.is_star ? 'iconfont icon-shoucang' : 'iconfont icon-shoucangdanse'"></span>
                        <span>{{ plistItem.star_count }}</span>
                    </div>
                </div>
                <div class="creator-info">
                    <el-avatar :size="30" style="font-size: 12px;" :src="getAvatar(plistItem.user_info.avatar)">KL</el-avatar>
                    <span>{{ plistItem.user_info.username }}</span>
                </div>
                <div class="progress-num">
                    <span>进度</span>
                    <span style="font-weight: 500;">{{ plistItem.pass_count + ' / ' + plistItem.problem_count }}</span>
                </div>
                <el-progress :text-inside="true" :stroke-width="20"
                    :percentage="calcProgress(plistItem.pass_count, plistItem.problem_count)" color="#004D40">
                </el-progress>
            </div>
        </div>
        <div class="pagination">
            <el-pagination layout="prev, pager, next, jumper" v-model:current-page="currentPage"
                :total="problemlistCount" :background="true" :page-size="pageSize"
                @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { getProblemListAPI } from "@/apis/problemlist";
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { getAvatar } from '@/utils/basic';

const router = useRouter()
const problemlist = ref([])
const problemlistCount = ref(0)

// 筛选参数
const currentPage = ref(1)
const pageSize = ref(30)
const keyword = ref(undefined)
const sort_type = ref('idAsc')

const params = computed(() => ({
    page_num: currentPage.value || 1,
    page_size: pageSize.value || 30,
    keyword: keyword.value || undefined,
    sort_type: sort_type.value || "idAsc"
}))

// 计算进度条
const calcProgress = (pass_count, problem_count) => {
    return (pass_count / problem_count * 100).toFixed(1)
}

const handleCurrentChange = async () => {
    await getProblemList(params.value)
}

const getProblemList = async (params) => {
    const res = await getProblemListAPI(params)
    console.log(res)
    problemlistCount.value = res.data.count
    problemlist.value = res.data.problemlists
}

const selectItem = [
    {
        label: '默认升序',
        value: 'idAsc'
    },
    {
        label: '默认降序',
        value: 'idDesc'
    },
    {
        label: '题目数量升序',
        value: 'countAsc'
    },
    {
        label: '题目数量降序',
        value: 'countDesc'
    }, 
    {
        label: '收藏数升序',
        value: 'starAsc'
    },
    {
        label: '收藏数量降序',
        value: 'starDesc'
    }
]

onMounted(async () => {
    console.log(params.value)
    await getProblemList(params.value)
    // console.log(problemlistStore.problemlist)
})
</script>

<style scoped>
.header{
    width: 85%;
    margin: 30px auto;
    display: flex;
    align-items: center;
    gap: 20px;
}
.searchBar {
    max-width: 400px;
    height: 40px;
    display: flex;
    border: 1px solid #BBBBBB;
    border-radius: 8px;
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

.wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: auto;
    width: 85%;
    margin-bottom: 20px;
    min-width: 800px;
}

.problemlist {
    display: flex;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
}

.problemlist-item {
    margin-bottom: 20px;
    padding: 20px 15px;
    box-shadow: 1px 1px 3px 0px rgba(0, 0, 0, 0.2);
    width: 350px;
    height: 180px;
    border-radius: 10px;
    transition: .5s;
    border: 1px solid #DEDCDC;
    /* display: block; */
}

.problemlist .problemlist-item:hover {
    cursor: pointer;
    transform: translateY(-5px);
    box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.4);
}

.problemlist-header {
    display: flex;

}

.problemlist-title {
    width: 85%;
    font-size: 20px;
    font-weight: bold;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.problemlist-star {
    display: flex;
    align-items: center;
    gap: 3px;
}

.problemlist-star .icon-shoucangdanse,
.problemlist .icon-shoucang {
    font-size: 20px;
}
.icon-shoucang{
    color: #4C4C4E;
}


.creator-info {
    display: flex;
    align-items: center;
    margin-top: 10px;
    gap: 6px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.creator-info span:last-of-type {
    color: #666;
}

.progress-num {
    margin: 15px 10px 0px 0px;
    display: flex;
    justify-content: space-between;
}

.el-progress {
    margin-top: 10px;
}
</style>