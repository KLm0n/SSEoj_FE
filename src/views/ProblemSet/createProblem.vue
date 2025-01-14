<template>
    <layoutNav />
    <div class="problem-header">
        <span>编辑题目</span>
        <button @click="postProblem">发布题目</button>
    </div>
    <div class="wrapper">
        <input type="text" class="title" placeholder="请输入标题" v-model="title">
        <div style="margin: 0px auto 30px auto; width: 30%;">
            来源:
            <input type="text" class="source" placeholder="请输入来源（非必需）" v-model="source">
        </div>
        <div class="node">题目描述</div>
        <div class="editor">
            <FEditor :key="1" :init-id="ref1" ref="desRef"></FEditor>
        </div>
        

        <div class="node">输入格式</div>
        <div class="editor">
            <FEditor :key="2" :init-id="ref2" ref="inStyleRef"></FEditor>
        </div>
        

        <div class="node">输出格式</div>
        <div class="editor">
            <FEditor :key="3" :init-id="ref3" ref="outStyleRef"></FEditor>
        </div>
        

        <div class="node">数据范围</div>
        <div class="editor">
            <FEditor :key="4" :init-id="ref4" ref="dataRangeRef"></FEditor>
        </div>

        <div class="node">
            测试输入/输出 
            <span class="iconfont icon-tianjia" @click="addSample"></span>
        </div>
        <div>
            <div v-for="(item, index) in inputs" :key="index" class="inputs_outputs">
                <span class="iconfont icon-qingkong"  @click="deleteSample(index)"></span>
                <div style="width: 180px;">
                    <span>Input #{{ index+1 }}</span>
                    <el-upload :show-file-list="false" @change="(file) => handleFileChange(file, index, true)" :limit="1" :on-exceed="handleExceed"
                    :before-upload="beforeFileUpload" :action="''">
                        <span class="iconfont icon-tianjiawenjian"></span>
                    </el-upload> 
                </div>
                
                <el-input
                    v-model="inputs[index]"
                    :autosize="{ minRows: 4, maxRows: 6 }"
                    type="textarea"
                    placeholder="Please input"
                />
                <div style="height: auto; width: 3px; background-color: #CDCDCD; margin-left: 9px; margin-right: 9px;"></div>
                <div style="width: 220px;">
                    <span>Output #{{ index+1 }}</span>
                    <el-upload :show-file-list="false" @change="(file) => handleFileChange(file, index, false)" :limit="1" :on-exceed="handleExceed"
                    :before-upload="beforeFileUpload" :action="''">
                        <span class="iconfont icon-tianjiawenjian"></span>
                    </el-upload> 
                </div>

                <el-input
                    v-model="outputs[index]"
                    :autosize="{ minRows: 4, maxRows: 6 }"
                    type="textarea"
                    placeholder="Please input"
                />
            </div>
        </div>

        <!-- <el-divider style="margin-top: 30px;"/> -->

        <div class="node">题目设置</div>
        <div class="block">
            <div class="diff-selector">
                <span style="width: 60px;">难度：</span>
                <el-select v-model="difficulty" size="large" 
                    placeholder="Select" 
                    style="width: 180px;--el-border-color:white;">
                        <el-option
                        v-for="item in colors"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        >
                            <div style="display: flex; align-items: center;">
                                <span :style="{ backgroundColor: getDifficultColor(item.value) }" 
                                style="margin-right: 10px; border-radius: 50%; 
                                border: none; width: 21px; height: 21px; display: inline-block;"></span>
                                <span :style="{ color: getDifficultColor(item.value) }" style="font-size: 15px;">{{ item.label }}</span>
                            </div>
                            
                        </el-option>
                        <template #label="{label}">
                            <div style="display: flex; align-items: center;">
                                <span :style="{ backgroundColor: getDifficultColor(difficulty) }" 
                                style="margin-right: 10px; border-radius: 50%; 
                                border: none; width: 21px; height: 21px; display: inline-block; border: 1px solid #EEE;"></span>
                                <span :style="{ color: getDifficultColor(difficulty) }" style="font-size: 15px;">{{ label }}</span>
                            </div>
                        </template>
                    </el-select>
            </div>
            <div class="divider"></div>
            <div class="time-limit">
                <div style="width: 135px;">时间限制：</div>
                <el-input width="100px" v-model="timeLimit">
                    <template #append>ms</template>
                </el-input>
            </div>
            <div class="divider"></div>
            <div class="memory-limit">
                <div style="width: 135px;">空间限制：</div>
                <el-input width="100px" v-model="memoryLimit">
                    <template #append>KB</template>
                </el-input>
            </div>
        </div>
        <div class="tag-block">
            <div style="width: 60px;">标签：</div>
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
    </div>

</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue';
import layoutNav from '../Layout/components/layoutNav.vue';
import FEditor from '@/components/FEditor.vue';
import { getDifficultColor } from '@/utils/color';
import { ElMessage } from 'element-plus';
import { useTagsStore } from '@/stores/tagsStore';
import { postProblemAPI } from '@/apis/problemset';
import { useRouter } from 'vue-router';

const router = useRouter()
const tagsStore = useTagsStore()
const allTags = ref()

const ref1 = ('a')
const ref2 = ('b')
const ref3 = ('c')
const ref4 = ('d')

const desRef = ref(null)
const inStyleRef = ref(null)
const outStyleRef = ref(null)
const dataRangeRef = ref(null)

const colors = [
    {
        value: 1,
        label: 'Lv.1'
    },
    {
        value: 2,
        label: 'Lv.2'
    },
    {
        value: 3,
        label: 'Lv.3'
    },
    {
        value: 4,
        label: 'Lv.4'
    },
    {
        value: 5,
        label: 'Lv.5'
    },
    {
        value: 6,
        label: 'Lv.6'
    }
]
const title = ref('')
const difficulty = ref(1)
const timeLimit = ref(1000)
const memoryLimit = ref(64 * 1024)
const inputs = ref([])
const outputs = ref([])
const selectedTag = ref([])
const source = ref('')

// 添加和删除测试用例
const addSample = () => {
    inputs.value.push('')
    outputs.value.push('')
}
const deleteSample = (index) => {
    inputs.value.splice(index, 1)
    outputs.value.splice(index, 1)
}
// 处理上传文件
const handleFileChange = (fileList, index, flag) => {
    const file = fileList.raw;
    if (!file) {
        ElMessage.error('请选择文件')
        return
    }
    const reader = new FileReader()
    reader.onload = () => {
        const fileContent = reader.result
        if (flag) {
            inputs.value[index] = fileContent
        }
        else {
            outputs.value[index] = fileContent
        }
    }
    reader.readAsText(file);
}
// 阻止文件上传到服务器
const beforeFileUpload = () => {
    return false
}

const inputVisible = ref(false)
const autoCompleteRef = ref(null)
const tagKey = ref("")


// 删除tag
const handleClose = (tag) => {
    selectedTag.value.splice(selectedTag.value.indexOf(tag), 1)
}
// 处理选择事件
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
// 隐藏输入框
const exitInput = () => {
    inputVisible.value = false
}
// 显示输入框
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
// 搜索标签
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

const postProblem = async() => {
    if (!title.value.trim()) {
        ElMessage.warning('标题不能为空');
        return
    }
    const data = {
        name: title.value,
        description: desRef.value.getContent(),
        input_style: inStyleRef.value.getContent(),
        output_style: outStyleRef.value.getContent(),
        data_range: dataRangeRef.value.getContent(),
        difficulty: difficulty.value,
        time_limit: timeLimit.value,
        memory_limit: memoryLimit.value,
        samples: {
            inputs: inputs.value,
            outputs: outputs.value
        },
        tags: selectedTag.value.map(tagName => {
            return tagsStore.tagsToID[tagName]
        }),
        source: source.value
    }
    console.log(data)
    await postProblemAPI(data)
    ElMessage.success('发布成功')
    router.push('/problemset')
}

onMounted(async() => {
    await tagsStore.getTags()
    allTags.value = Object.keys(tagsStore.tagsToID)
})
</script>

<style scoped>
.problem-header {
    width: 80%;
    margin: 20px auto 20px auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.problem-header button {
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
.problem-header button:hover{
    background-color: #009999;
}

.problem-header span {
    font-size: 25px;
    border-left: #CDCDCD 4px solid;
    padding-left: 15px;
}

.wrapper {
    width: 80%;
    margin: 50px auto 20px auto;
}
.title {
    outline: none;
    border: none;
    border-bottom: 1px solid rgba(33, 33, 33, 0.4);
    width: 70%;
    font-size: 25px;
    font-weight: bold;
    padding-bottom: 10px;
    margin: 0px auto 30px auto;
}
.source {
    outline: none;
    border: none;
    border-bottom: 1px solid rgba(33, 33, 33, 0.4);
    font-size: 15px;
    margin-left: 5px;
}
.node {
    font-size: 20px;
    font-weight: bold;
    margin-top: 30px;
}
.block, .tag-block {
    margin: 20px auto 0px auto;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 90%;
}

.node::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #3F3C3C;
    margin-right: 8px;
    vertical-align: middle;
}

.editor {
    width: 90%;
    margin: 20px auto 0px auto;
}

.diff-selector, .time-limit, .memory-limit {
    display: inline-flex;
    align-items: center;
}
.divider {
    width: 3px;
    background-color: #CDCDCD;
    height: 40px;
    margin-left: 10px;
    margin-right: 10px;
}

.icon-tianjia, .icon-qingkong {
    font-size: 20px;
    cursor: pointer;
    transition: opacity .2s ease-in;
}
.icon-tianjia:hover, .icon-qingkong:hover{
    opacity: 60%;
}
.inputs_outputs {
    display: flex;
    flex-direction: row;
    gap: 15px;
    justify-content: flex-start;
    margin: 20px auto 0px auto;
    width: 95%;
}

.icon-tianjiawenjian {
    margin-top: 10px;
}

.tag-list {
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
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

</style>