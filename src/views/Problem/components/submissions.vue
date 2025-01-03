<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div style="min-width: 400px;">
    <div class="sub-title">
      <el-row>
        <el-col :span="5" style="padding-right: 10px;">
            <el-select style="--el-border-color:white;" 
              v-model="selectedStatus" 
              :empty-values="[null, undefined]"
              @change="selectedChange"
            >
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              /> 
            </el-select>
        </el-col>
        <el-col :span="5" style="padding-right: 10px;">
          <el-select style="--el-border-color:white;" 
            v-model="selectedLanguage" 
            :empty-values="[null, undefined]"
            @change="selectedChange"
          >
            <el-option
                v-for="item in languageList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              /> 
          </el-select>
        </el-col>
        <el-col :span="4">时间</el-col>
        <el-col :span="4">内存</el-col>
        <el-col :span="6">提交时间</el-col>
      </el-row>
    </div>

    <el-collapse v-if="loadComplete" accordion class="submission-list">
      <el-collapse-item v-for="(item, index) in submissions" :key="index">
        <template #title>
          <div style="width: 100%;">
            <el-row style="text-align: left;">
              <el-col :span="5"  class="result" :style="getStatusColor(item.result)">{{ statusCodeToDesc(item.result)[0] }}</el-col>
              <el-col :span="5">
                <el-tag type="info" :disable-transitions="true"
                color="#EAEAEA">{{ item.language }}</el-tag>
              </el-col>
              <el-col :span="4">{{ transTime(item.time_spent) }}</el-col>
              <el-col :span="4">{{ transMem(item.memory_spent) }}</el-col>
              <el-col :span="6" class="submit_time" style="color: #CCC;">{{ item.submit_time }}</el-col>
            </el-row>
          </div>
        </template>
        <div class="submission-list-content">
          <div class="error-info-title">
            <span :style="getStatusColor(item.result)">{{ statusCodeToDesc(item.result)[1] }}</span>
            <span :style="getStatusColor(item.result)">{{ statusCodeToDesc(item.result)[2] }}</span>
          </div>
          <div v-if="item.error_info" class="error-info">
            {{ item.error_info }}
          </div>
          <span>代码</span> <span>{{ item.language }}</span>
          <div class="code-content">{{ item.code }}</div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { getSubmissionsAPI } from '@/apis/problem';
import { useRoute } from 'vue-router';
import { transMem, transTime } from '@/utils/data_calculate';
import { useLanguageStore } from '@/stores/basicSetupStore';
import { statusCodeToDesc } from '@/utils/problemStatus';
import '@/assets/base-el-tag.css'
// const statusArrowRef = ref(null)
// const langArrowRef = ref(null)

const languageStore = useLanguageStore();
const route = useRoute()
const problem_id = route.params.id;
const loadComplete = ref(false)
const selectedStatus = ref(0)
const selectedLanguage = ref('')
const params = computed(() => ({
  status: selectedStatus.value || undefined,
  language: selectedLanguage.value || undefined,
  sort_type: "time"
}))

const submissions = ref([])
const statusList = [
  {
    label: '所有状态',
    value: 0,
  }, 
  {
    label: '通过',
    value: 1
  },
  {
    label: '答案错误',
    value: 2
  },
  {
    label: '超时',
    value: 3
  }, 
  {
    label: '超出内存限制',
    value: 4
  },
  {
    label: "运行时错误",
    value: 5
  }
]
const languageList = ref([])

const getSubmissions = async() => {
  console.log(params.value)
  const res = await getSubmissionsAPI(problem_id, params.value)
  submissions.value = res.data
}
const selectedChange = async() => {
  loadComplete.value = false
  await getSubmissions()
  loadComplete.value = true
} 
const getLanguageSelectContent = () => {
  languageList.value = languageStore.languageList.map(item => { return {label: item, value: item}})
  languageList.value.unshift({label: '所有语言', value:''})
}
const getStatusColor = (status) => {
  if (status == 0)
    return {color: '#2acf2a'}
  else
    return {color: '#e90f0f'}
}

onMounted(async() => {
  await getSubmissions()
  getLanguageSelectContent()
  loadComplete.value = true
})
</script>

<style>
.sub-title .el-row{
  font-size: 13px;
  width: 95%;
  align-items: center;
}

.el-collapse{
  margin-top: 20px;
  --el-collapse-header-height: 60px;
}

.submission-list .result{
  padding-left: 10px;
  font-weight: 500;
}
.submission-list .el-col{
  font-size: 14px;
}

.submission-list-content
{
  padding-left: 10px;
}
.submission-list-content .code-content{
  margin-top: 10px;
  margin-left: 6px;
  background-color: #EEE;
  border-radius: 6px;
  padding: 10px;
  font-size: 14px;
}
.submission-list-content > span{
  font-size: 16px;
  font-weight: 600;
}
.submission-list-content .error-info-title span{ 
  font-size: 18px;
  font-weight: 800;
  margin-right: 10px;
}
.submission-list-content .error-info{
  margin-top: 10px;
  margin-left: 6px;
  background-color: #EEE;
  border-radius: 6px;
  padding: 10px;
  font-size: 14px;
  margin-bottom: 15px;
}
.submission-list-content > span:first-of-type{
  padding-right: 10px;
  margin-right: 8px;
  border-right: black 1px solid;
}
</style>