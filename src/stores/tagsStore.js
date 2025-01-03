import { defineStore } from "pinia";
import { getTagsAPI } from "@/apis/utils";
import { ref } from "vue";

export const useTagsStore = defineStore('tags', () => {
    const idToTags = ref({})
    const tagsToID = ref({})
    const tagTree = ref({})
    const getTags = async () => {
        const res = await getTagsAPI()
        res.data.forEach(item => {
            tagsToID.value[item.name] = item.id
            idToTags.value[item.id] = { name: item.name, parent: item.parent }
            if (item.parent == null) {
                tagTree.value[item.id] = []
            }
            else if (tagTree.value[item.parent] == undefined) {
                tagTree.value[item.parent] = []
                tagTree.value[item.parent].push(item.id)
            }
            else {
                tagTree.value[item.parent].push(item.id)
            }
        });
    }
    const idToTag = (id) => {
        const tag = idToTags.value[id]
        if (tag)
            return tag.name
        else
            return 'undefined'
    }

    return {
        idToTags,
        tagsToID,
        idToTag,
        getTags,
        tagTree
    }
})