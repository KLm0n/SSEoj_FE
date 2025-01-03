import { defineStore } from "pinia";
import { getProblemListAPI } from "@/apis/problemlist";
import { ref } from "vue";

export const useProblemlistStore = defineStore('problemlist', () => {
    const problemlist = ref([])
    const count = ref(0)

    const getProblemList = async (params) => {
        const res = await getProblemListAPI(params)
        console.log(res)
        count.value = res.data.count
        problemlist.value = res.data.problemlists
    }

    return {
        problemlist,
        count,
        getProblemList,
    }
})

