import { defineStore } from "pinia";

export const useLanguageStore = defineStore('langs', () => {
    const languageList = ["C", "C++", "Java", "Python3"]
    return {
        languageList
    }
})
