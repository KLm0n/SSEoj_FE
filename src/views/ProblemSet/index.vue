<!-- eslint-disable vue/multi-word-component-names -->

<template>
    <div class="wrapper">
        <div class="container">
            <div class="filter">
                <div class="search-box" :style="isSearchActive" ref="searchBoxRef" @click="toggleSearchBox">
                    <span class="iconfont icon-sousuo"></span>
                    <span class="filter-text">搜索</span>
                    <input class="searchInput" type="text" style="display: none;" placeholder="search something..."
                        v-model="keyword" @keydown.enter="console.log('search', keyword)" />
                    <!-- </div> -->
                </div>
                <el-popover 
                    :show-arrow="false"
                    trigger="click"
                    placement="right"
                >
                    <template #reference>
                        <div class="diff-Filter">
                            <div class="diff-Circle" :style="diffCircle"></div>
                            <span class="filter-text">难度</span>
                        </div>
                    </template>
                    <template #default>
                        <diffView 
                            :numList="numList"
                            :selected-diff="min_diff"
                            @select-diff="selectDiff"
                        />
                    </template>
                </el-popover>
                
                <el-popover 
                    :show-arrow="false"
                    trigger="click"
                    placement="right-start"
                    popper-style="width: 400px; height: 340px; border-radius:10px;"
                >
                    <template #reference>
                        <div class="alo-Filter" @click="tagsStore.getTagTree">
                            <div class="tagNum">{{ selectedTag.length }}</div>
                            <span class="filter-text">算法</span>
                        </div>
                    </template>
                    <template #default>
                        <tagView :tagTree="tagsStore.tagTree" 
                            :selectedTag="selectedTag" 
                            @selectTag="addTag"
                            @closeTag="deleteTag"
                        />
                    </template>
                </el-popover>
                <el-button class="postProblemBtn" @click="router.push('/problem/create')">发布题目</el-button>
            </div>

            <div class="problemset">
                <div class="table">
                    <el-table :data="problemset" stripe :row-style="{ height: '70px' }"
                        @row-click="rowSelected">
                        <el-table-column label="状态" width="80">
                            <template #default="scope">
                                <span v-if="scope.row.status" class="iconfont icon-duigou1" style="text-align: center; font-size: 20px;"></span>
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
                <div class="pagination">
                    <el-pagination layout="prev, pager, next, jumper" v-model:current-page="currentPage"
                        :total="problemCount" :background="true" :page-size="pageSize"
                        @current-change="handleCurrentChange" />
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { getProblemSetAPI, getProblemNumAPI } from "@/apis/problemset";
import { useTagsStore } from '@/stores/tagsStore';
import { getDifficultColor } from '@/utils/color'
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import tagView from './components/tagView.vue';
import diffView from './components/diffView.vue';

const router = useRouter()
const tagsStore = useTagsStore()
const problemset = ref([])
const problemCount = ref(0)

const getProblemSet = async (params) => {
    const res = await getProblemSetAPI(params)
    problemCount.value = res.data.count
    problemset.value = res.data.problems
}

// 筛选参数
const currentPage = ref(1)
const pageSize = ref(30)
const keyword = ref(undefined)
const min_diff = ref(undefined), max_diff = ref(undefined)
const selectedTag = ref([])

const params = computed(() => ({
    page_num: currentPage.value || 1,
    page_size: pageSize.value || 30,
    keyword: keyword.value || undefined,
    min_difficulty: min_diff.value || undefined,
    max_difficulty: max_diff.value || undefined,
    tags: selectedTag.value || undefined
}))

// search 部分代码
const searchBoxRef = ref(null)
const isSearchActive = ref({})
const toggleSearchBox = () => {

    isSearchActive.value = {
        'width': '300px',
        'box-shadow': '0px 2px 6px 0px rgba(0,0,0,0.4)'
    }
    const spanRef = searchBoxRef.value.children[1]
    spanRef.style.display = 'none'
    const inputRef = searchBoxRef.value.children[2]
    inputRef.style.width = '260px'
    inputRef.style.display = 'inline'
    setTimeout(() => {
        inputRef.focus()
    }, 500)
}

const handleOutSideClick = (e) => {
    if (searchBoxRef.value && !searchBoxRef.value.contains(e.target)) {
        isSearchActive.value = {
            'width': '110px',
            'box-shadow': 'none'
        }
        const spanRef = searchBoxRef.value.children[1]
        spanRef.style.display = 'inline'
        const inputRef = searchBoxRef.value.children[2]
        inputRef.style.width = '60px'
        inputRef.style.display = 'none'
        keyword.value = undefined
    }
}
document.addEventListener('click', handleOutSideClick)

// 更新筛选参数
const handleCurrentChange = async () => {
    await getProblemSet(params.value)
}
// 选择题目
const rowSelected = (row) => {
    router.push(`/problem/${row.id}/description`)
}
// 添加删除tag
const addTag = async(id) => {
    selectedTag.value.push(id)
    await getProblemSet(params.value)
}
const deleteTag = async(id) => {
    selectedTag.value = selectedTag.value.filter(item => item != id)
    await getProblemSet(params.value)
}

const numList = ref([])
const diffCircle = ref({
    'background-color': 'white'
})
const getProblemNum = async() => {
    const res = await getProblemNumAPI()
    numList.value = res.data
    console.log(numList)
}
// 选择难度
const selectDiff = async (diff) => {
    if (diff == min_diff.value) {
        min_diff.value = undefined
        max_diff.value = undefined
        diffCircle.value = {
            'background-color': `white`
        }
    }
    else {
        min_diff.value = diff
        max_diff.value = diff
        diffCircle.value = {
            'background-color': `${getDifficultColor(diff)}`
        }
    }
    console.log(params.value)
    await getProblemSet(params.value)
}

onMounted(async () => {
    await getProblemSet(params.value)
    await tagsStore.getTags()
    await getProblemNum()
})


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
    margin-top: 10px;
}

.container {
    display: flex;
    margin-bottom: 20px;
    padding: 0px auto;
    box-sizing: border-box;
}

.filter {
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
    min-width: 150px;
    height: 190px;
    margin-right: 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    z-index: 10;
    flex-shrink: 1;
    position: relative;
    align-items: center;
}

.search-box,
.diff-Filter,
.alo-Filter {
    width: 110px;
    height: 40px;
    border-radius: 20px;
    left: 20px;
    background-color: white;
    border: 1px solid #bbb;
    position: absolute;
    display: flex;
    flex-direction: row;
    cursor: pointer;
}

.filter-text {
    margin-left: 60px;
    margin-top: 9px;
    font-size: 14px;
}

.search-box {
    overflow: hidden;
    top: 15px;
    transition: .5s;
    opacity: 80%;
}

.search-box .icon-sousuo {
    position: absolute;
    left: 12px;
    top: 8px;
    font-size: 20px;
}

.searchInput {
    margin-left: 50px;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    flex: 1;
}


.diff-Filter {
    top: 75px;
}


.diff-Circle {
    position: absolute;
    left: 15px;
    top: 9px;
    border-radius: 100%;
    width: 22px;
    height: 22px;
    border: 1px solid #5C5C5C;
}

.alo-Filter {
    top: 135px;
}

.tagNum {
    position: absolute;
    left: 12px;
    top: 8px;
    border: 1px solid #777676;
    border-radius: 10px;
    padding: 2px 5px;
    font-size: 14px;
    color: black;
}

.postProblemBtn {
    top: 210px;
    height: 40px;
    width: 150px;
    border-radius: 8px;
    color: rgb(2, 143, 167);
    position: absolute;
    box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.2);
}

.problemset {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 99%;
    padding: 0px auto;
}

.table {
    margin-bottom: 20px;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    padding: 20px 20px 30px 20px;
    position: relative;
}

.el-table {
    width: 99%;
}

.pagination {
    align-self: flex-end;
}
</style>
