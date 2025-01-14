<template>
    <layoutNav />
    <div class="solution-header" v-if="loadComplete">
        <span>编辑题解：{{ id + '.' + problemDesc.name }}</span>
        <button @click="postSolution">发布题解</button>
    </div>
    <div class="solution-title">
        <input type="text" placeholder="请输入标题" v-model="title">
        <div class="tag-list">
            <el-tag v-for="tag in selectedTag" :key="tag" closable :disable-transitions="false" type="info"
                @close="handleClose(tag)">
                {{ tag }}
            </el-tag>
            <el-autocomplete v-if="inputVisible" :fetch-suggestions="tagSearch" v-model="tagKey"
                :trigger-on-focus="false" @select="handleSelect" @blur="exitInput" ref="autoCompleteRef"
                style="width: 80px; margin-bottom: 10px;" class="autoComplete">
            </el-autocomplete>
            <button v-else class="addTagBtn" @click="showInput">+ 添加标签</button>
        </div>
    </div>
    <div class="solution-editor">
        <FEditor ref="FEditorRef"/>
    </div>

</template>

<script setup>
import '@/assets/base-el-tag.css'
import FEditor from '@/components/FEditor.vue';
import layoutNav from '../Layout/components/layoutNav.vue';
import { onMounted, ref, nextTick } from 'vue';
import { useTagsStore } from '@/stores/tagsStore';
import { useRoute, useRouter } from 'vue-router';
import { getProblemDescAPI } from '@/apis/problem';
import { ElMessage } from 'element-plus';
import { createSolutionAPI } from '@/apis/problemset';

const loadComplete = ref(false)

const tagsStore = useTagsStore()
const title = ref("")
const selectedTag = ref([])
const allTags = ref()
const tagKey = ref("")

const FEditorRef = ref(null)
const inputVisible = ref(false)
const autoCompleteRef = ref(null)
const route = useRoute()
const router = useRouter()
const id = route.query.id
const problemDesc = ref({})

const postSolution = async() => {
    const data = {
        problem_id: id,
        title: title.value,
        content: FEditorRef.value.getContent(),
        tags: selectedTag.value.map(tagName => {
            return tagsStore.tagsToID[tagName]
        })
    }
    console.log(data)
    await createSolutionAPI(data)
    ElMessage.success('发布成功')
    router.push(`/problem/${id}/description`)
}

const createFilter = (queryString) => {
    return (tag) => {
        return tag.includes(queryString)
    }
}
const tagSearch = (queryString, cb) => {
    const results = queryString
        ? allTags.value.filter(createFilter(queryString))
        : allTags.value
    console.log(results)
    const suggestions = results.map(item => ({ value: item }))
    cb(suggestions)
}

const exitInput = () => {
    inputVisible.value = false
}

const handleSelect = (item) => {
    console.log(selectedTag.value, !selectedTag.value.includes(item))
    if (item && !selectedTag.value.includes(item.value)) {
        selectedTag.value.push(item.value)
        inputVisible.value = false
        tagKey.value = ""
    }
    else {
        ElMessage({type:'warning', message:'请勿选择重复tag'})
    }
}

const handleClose = (tag) => {
    selectedTag.value.splice(selectedTag.value.indexOf(tag), 1)
}

const showInput = () => {
    if (selectedTag.value.length >= 15) {
        ElMessage({type: 'warning', message:"最多添加15个标签"})
        return
    }
    inputVisible.value = true
    nextTick(() => {
        autoCompleteRef.value.focus()
    })
}

const getProblemDesc = async (id) => {
    const res = await getProblemDescAPI(id)
    problemDesc.value = res.data
}

const setFEditorContent = () => {
    const content = `
    <h1>${problemDesc.value.id}.${problemDesc.value.name}</h1>
    <li><h3>题目描述</h3></li>
    <p style="padding-left: 40px;">${problemDesc.value.description}</p>
    <li><h3>输入格式</h3></li>
    <p style="padding-left: 40px;">${problemDesc.value.input_style}</p>
    <li><h3>输出格式</h3></li>
    <p style="padding-left: 40px;">${problemDesc.value.output_style}</p>
    <li><h3>数据范围</h3></li>
    <p style="padding-left: 40px;">${problemDesc.value.data_range}</p>
    <br><hr><br>`
    // FEditorRef.value.setContent(content)
    return content
}


onMounted(async () => {
    await tagsStore.getTags()
    allTags.value = Object.keys(tagsStore.tagsToID)
    await getProblemDesc(id)
    loadComplete.value = true
    // setFEditorContent()
})
</script>

<style scoped>
.solution-header {
    width: 85%;
    margin: 20px auto 20px auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.solution-header button {
    width: 100px;
    height: 50px;
    border-radius: 10px;
    background-color: #008080;
    cursor: pointer;
    border: none;
    color: #FFFFFF;
    font-size: 14px;
    transition: .2s;
}

.solution-header button:hover{
    background-color: #009999;
}

.solution-header span {
    font-size: 20px;
}

.solution-title {
    width: 85%;
    margin: 0 auto;
    border-radius: 10px;
    box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.4);
    overflow: auto;
    display: flex;
    flex-direction: column;
    /* flex-direction: column;*/
    /* align-items: center; */
    /*justify-content: center; */
    padding: 40px 0px;
}

.solution-title input {
    outline: none;
    border: none;
    border-bottom: 1px solid rgba(33, 33, 33, 0.4);
    width: 95%;
    font-size: 25px;
    font-weight: bold;
    padding-bottom: 10px;
    margin-left: auto;
    margin-right: auto;
}

.tag-list {
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;
    width: 95%;
    display: flex;
    justify-items: center;
    align-items: center;
    flex-wrap: wrap;
    line-height: 10px;
}

.tag-list .el-tag,
.autoComplete,
.tag-list button {
    margin-bottom: 10px;
}

.autoComplete {
    width: 10px;
}

.tag-list button {
    background: transparent;
    border: 1px solid rgba(0, 0, 0, 0.4);
}

::v-deep .autoComplete .el-input {
    height: 24px;
    font-size: 12px;

}

::v-deep .autoComplete .el-input__inner {
    height: 24px;
}
:deep(.autoComplete) {
    --el-border-radius-base: 10px;
}

.addTagBtn {
    cursor: pointer;
    width: 80px;
    height: 24px;
    border-radius: 10px;
    background-color: #333;
    transition: .5s;
}

.addTagBtn:hover {
    background-color: #EAEAEA
}

.solution-editor {
    margin: 20px auto 0 auto;
    width: 85%;
    min-height: 600px;
}
</style>
