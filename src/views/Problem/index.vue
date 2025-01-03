<!-- eslint-disable vue/multi-word-component-names -->

<template>
    <layoutNav />

    <div class="wrapper">

        <!-- 左板块 -->
        <div class="left-panel" :style="{ width: leftPaneWidth + 'px', minWidth:'400px'}" v-if="!fullScreen">
            <div class="tags">
                <div v-for="(tag, index) in tags" :key="index" class="tag" :class="{ active: selectedTag === tag }"
                    @click="selectTag(index)">
                    {{ tag }}
                </div>
            </div>
            <el-scrollbar class="content">
                <router-view :key="routeKey"></router-view>
            </el-scrollbar>   
        </div>

        <div class="resizer" @mousedown="onMouseDown" v-if="!fullScreen"></div>

        <!-- 右板块 -->
        <div class="right-panel">
            <div class="right-header">
                <div class="icon-btn">
                    <el-upload :show-file-list="false" @change="handleFileChange" :limit="1" :on-exceed="handleExceed"
                    :before-upload="beforeFileUpload" :action="''">
                        <span class="iconfont icon-tianjiawenjian"></span>
                    </el-upload>
                    <span :class="fullScreen? 'iconfont icon-quxiaoquanping': 'iconfont icon-quanping'" @click="toggleFullScreen"></span>
                </div>
                <div class="right-btn">
                    <button @click="submitProblem" 
                            :disabled="submitBtnDisable" 
                    >提交</button>
                    <el-select v-model="langOption" @change="toggleLanguage()">
                        <el-option v-for="item in languageList" :key="item" :label="item" :value="item" class="option" />
                    </el-select> 
                </div>
                 
            </div>
            <el-divider style="border-top: 0px;" />
            <el-scrollbar class="editor">
                <CodeMirror ref="codeMirror" class="codeMirror"></CodeMirror>
            </el-scrollbar>
        </div>

    </div>

</template>

<script setup>
import layoutNav from '@/views/Layout/components/layoutNav.vue'
import CodeMirror from './components/codemirror.vue';
import { useLanguageStore } from '@/stores/basicSetupStore';
import { onMounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import '@/assets/icon/iconfont.css'
import { useRouter, useRoute } from 'vue-router';
import { submitProblemAPI } from '@/apis/problem';

// resizer代码
const leftPaneWidth = ref(500)
const isDragging = ref(false);
const initialMouseX = ref(0);
const initialLeftPanelWidth = ref(0);
const routeKey = ref(0) //用来强制刷新提交列表
const onMouseDown = (e) => {
    isDragging.value = true
    initialMouseX.value = e.clientX
    initialLeftPanelWidth.value = leftPaneWidth.value
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none';

    // 添加鼠标移动和鼠标松开事件监听器
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
}
const onMouseMove = (e) => {
    if (isDragging.value) {
        const deltaX = e.clientX - initialMouseX.value
        leftPaneWidth.value = initialLeftPanelWidth.value + deltaX
    }
}
const onMouseUp = () => {
    isDragging.value = false
    document.body.style.userSelect = 'auto'
    document.body.style.webkitUserSelect = 'auto';
    // 移除事件监听器
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
}


const route = useRoute()
const router = useRouter()
const params = route.params
const id = params.id;
const languageStore = useLanguageStore()
const languageList = languageStore.languageList
const codeMirror = ref(null)

//切换页面
const tags = ['题目描述', '题解', '提交记录'];
const selectedTag = ref(tags[0]);
const selectTag = (index) => {
    selectedTag.value = tags[index];
    switch (index) {
        case 0:
            router.push(`/problem/${id}/description`)
            break
        case 1:
            router.push(`/problem/${id}/solutions`)
            break
        case 2:
            router.push(`/problem/${id}/submissions`)
            break
    }
};

// 切换语言
const langOption = ref('C++')
const toggleLanguage = () => {
    codeMirror.value.toggleLanguage(langOption.value)
}

// 处理上传多个文件
const handleExceed = () => {
    ElMessage.warning('please choose one file')
}

// 阻止文件上传到服务器
const beforeFileUpload = () => {
    return false
}

// 处理上传文件
const handleFileChange = (fileList) => {
    const file = fileList.raw;
    if (!file) {
        ElMessage.error('请选择文件')
        return
    }

    const reader = new FileReader()
    reader.onload = () => {
        const fileContent = reader.result
        codeMirror.value.uploadCode(fileContent)
    }
    reader.readAsText(file);
}

// 处理应该激活的标签
const initActiveTags = () => {
    const currentPath = router.currentRoute.value.path
    const match = currentPath.match(new RegExp(`^/problem/(\\d+)/(\\w+)`))
    switch (match[2]) {
        case 'description':
            selectedTag.value = tags[0]
            break
        case 'solutions':
            selectedTag.value = tags[1]
            break
        case 'submissions':
            selectedTag.value = tags[2]
            break
    }
}

// 控制全屏
const fullScreen = ref(false)
const toggleFullScreen = () => {
    fullScreen.value = !fullScreen.value
}

// 提交题目
const submitBtnDisable = ref(false)
const submitProblem = async() => {
    submitBtnDisable.value = true
    const data = {
        problem_id: id,
        submit_code: codeMirror.value.getCode(),
        language: langOption.value
    }
    // console.log(data)
    await submitProblemAPI(data)
    if (selectedTag.value != tags[2]) {
        selectTag(2)
    }   
    else {
        if (routeKey.value > 1000)
            routeKey.value = 0
        else
            routeKey.value = routeKey.value + 1
    }
    submitBtnDisable.value = false
}

onMounted(() => {
    initActiveTags()
})

watch(
    () => route.path,
    initActiveTags
)

</script>

<style scoped>
.wrapper {
    display: flex;
    flex-direction: row;
    margin: 0 auto;
    width: 95%;
    height: calc(100vh - 140px);
    min-width: 800px;
    min-height: 500px;
    align-items: center
}

.left-panel {
    position: relative;
    display: flex;
    flex-direction: row;
    /* margin-right: 10px; */
    height: 100%
    /* height: calc(100vh - 160px); */
}

.content {
    display: flex;
    flex-direction: column;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    overflow: auto;
    padding: 15px;
    width: 100%;
    z-index: 10;
    background-color: white;
    height: 100%;
}

.tags {
    /* position: pos; */
    display: flex;
    flex-direction: column;
    transform: translate(2px, 40px);
    height: 300px;
}

.tag {
    position: relative;
    /* width: 60px; */
    white-space: nowrap;
    padding: 15px 6px;
    font-size: 12px;
    text-align: center;
    background-color: #FFF;
    border: 1px #B5B5BE solid;
    margin-bottom: 15px;
    cursor: pointer;
    border-radius: 10px 0 0 10px;
    transition: background-color 0.2s;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
    z-index: 5;
}

.tag.active {
    background-color: #6C6C6D;
    color: white;
}


.right-panel {
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
    flex: 1;
    border-radius: 10px;
    height: 100%;
    overflow: auto;
    min-width: 400px;
    /* height: calc(100vh - 160px); */
}

.right-panel .el-divider {
    margin-top: 10px;
    margin-bottom: 10px;
}

.editor {
    position: relative;
    min-width: 400px;
    height: calc(100vh - 300px);
    /* overflow-y: auto; */
    margin-left: 10px;
    margin-right: 10px;
}


.right-header {
    padding: 10px 0px 10px 20px;
    gap: 10px;
    display: flex;
    flex-direction: row;
    width: 100%;
    position: relative;
    justify-content: space-between;
    align-items: center;
    background-color: #E6E6E6;
    /* margin-bottom: 5px; */
    height: 50px;
}
.right-header .icon-btn{
    display: flex;
    align-items: center;
    gap: 10px;
}
.right-header .right-btn{
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    margin-right: 20px;
}
.right-header .right-btn button{
    border: none;
    width: 100px;
    background-color: black;
    color: white;
    text-align: center;
    padding: 7px;
    font-size: 14px;
    border-radius: 6px;
    transition: opacity .3s;
}
.right-header .right-btn button:hover{
    cursor: pointer;
    opacity: 0.4;
}
.right-header .right-btn button:disabled{
    opacity: 0.4;
}

.right-header .el-select {
    min-width: 80px;
    --el-border-radius-base: 8px;
    --el-input-text-color: black;
}
.icon-btn .icon-quanping {
    font-size: 18px;
}
.icon-btn .icon-quanping:hover, .icon-btn .icon-quxiaoquanping:hover{
    cursor: pointer;
}

.icon-tianjiawenjian {
    font-size: 20px
}


.resizer {
    background-color: #888;
    width: 4px;
    margin: 0 5px;
    cursor: ew-resize; /* 设置光标为左右拖动形状 */
    height: 60px;
    z-index: 1;
    border-radius: 6px;
}

.resizer:hover {
    height: 100%;
    margin: 0 5px;
    width: 4px;
    background-color: blue;
}

</style>