<template>
    <el-tabs>
        <el-tab-pane v-for="(value, id) in tagTree" :key="id" :label="tagsStore.idToTag(id)">
            <el-scrollbar max-height="100px" always>
                <el-tag v-for="(tagId, index) in value" 
                    :key="index" type="info" 
                    :disable-transitions="true"
                    :color="selectedTag.includes(tagId)? '#6C6C6D' : '#EAEAEA'"
                    @click="addTag(tagId)"
                    style="margin-bottom: 10px; cursor: pointer;"
                    :style="selectedTag.includes(tagId)? {'color': 'white'}:{'color': 'black'}"
                >
                    {{ tagsStore.idToTag(tagId) }}
                </el-tag>
            </el-scrollbar>
            <el-divider/>
            <div style="font-weight: 500; font-size: 16px; margin-top: 10px;">已选标签</div>
            <el-scrollbar height="100px" always>
                <el-tag v-for="(tagId, index) in selectedTag" :key="index" type="info" :disable-transitions="true"
                    color="#6C6C6D" closable class="selectedTag" @close="deleteTag(tagId)">
                    {{ tagsStore.idToTag(tagId) }}
                </el-tag>
            </el-scrollbar>

        </el-tab-pane>
    </el-tabs>
</template>

<script setup>
import '@/assets/base-el-tag.css'
import { useTagsStore } from '@/stores/tagsStore';
const props = defineProps({
    tagTree: {
        type: Object,
        default: () => ({})
    },
    selectedTag: {
        type: Array,
        default: () =>([])
    }
})
const emit = defineEmits(['selectTag', 'closeTag'])
const tagsStore = useTagsStore()
const addTag = (id) => {
    if (props.selectedTag.includes(id))
        return 
    emit('selectTag', id)
}
const deleteTag = (id) => {
    emit('closeTag', id)
}
</script>

<style scoped>
.selectedTag {
    color: white;
    margin-top: 10px;
}
</style>