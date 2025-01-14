<template>
  <layoutNav />

  <div class="discussion-title">
    <input type="text" placeholder="请输入标题" v-model="title" />
    <button @click="postDiscussion" :disabled="isPosting">
      {{ isPosting ? '发布中...' : '发布帖子' }}
    </button>
  </div>

  <div class="discussion-editor">
    <FEditor ref="FEditorRef" :initial-value="`<p>Input here~</p>`"/>
  </div>
</template>

<script setup>
import '@/assets/base-el-tag.css';
import FEditor from '@/components/FEditor.vue';
import layoutNav from '../Layout/components/layoutNav.vue';
import { onMounted, ref } from 'vue';
import { usePostStore } from '@/stores/postStore';
import { ElMessage } from 'element-plus';

// 引用编辑器的 ref
const FEditorRef = ref(null);

// 帖子标题
const title = ref('');

// 引用 store
const postStore = usePostStore();
const { createPost, isPosting } = postStore;

// 发布帖子
const postDiscussion = async () => {
  try {
    // 获取编辑器内容
    const content = FEditorRef.value.getContent();

    // 检查标题和内容是否为空
    if (!title.value.trim() || !content.trim()) {
      ElMessage.warning('标题和内容不能为空');
      return;
    }

    // 调用 store 方法发布帖子
    const result = await createPost({ post_title: title.value, post_content: content });
    if (!result.err) {
      ElMessage.success('发布成功！');
    } else {
      ElMessage.error('发布失败，请重试');
    }
  } catch (error) {
    ElMessage.error(error.message || '发布过程中出现错误，请稍后重试');
  }
};


// 初始化编辑器
onMounted(() => {

});
</script>

<style scoped>
.discussion-title button {
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

.discussion-title button:hover{
  background-color: #009999;
}
.discussion-title span {
  font-size: 20px;
}

.discussion-title {
  width: 85%;
  min-width: 800px;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.4);
  overflow: auto;
  display: flex;
  flex-direction: row;
  padding: 40px 0px;
  padding-left: 20px;
  padding-right: 20px;

}

.discussion-title input {
  outline: none;
  border: none;
  border-bottom: 1px solid rgba(33, 33, 33, 0.4);
  width: 90%;
  font-size: 25px;
  font-weight: bold;
  padding-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
}



.discussion-editor {
  margin: 20px auto 0 auto;
  width: 85%;
  min-width: 800px;
  margin-bottom: 10px;
}

</style>
