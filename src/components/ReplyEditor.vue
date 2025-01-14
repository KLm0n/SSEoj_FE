<template>
    <div style="overflow: hidden">
        <editor v-model="myValue" :init="init" :enabled="enabled" :id="tinymceId"></editor>
    </div>
    <div class="commentBtn" @click="postComment">发布</div>
</template>

<script setup>
import tinymce from "tinymce/tinymce";
import "tinymce/icons/default/icons"
import Editor from "@tinymce/tinymce-vue";
import "tinymce/models/dom"; 
import "tinymce/themes/silver"
import "tinymce/plugins/emoticons"
import "tinymce/plugins/emoticons/js/emojis.js"
import { onMounted, ref, watch } from "vue";

const props = defineProps({
    'holder':{
        type: String,
        default: '请输入内容...'
    }
})

const emits = defineEmits(['click:post'])

const myValue = ref('')
const init = ref({
    language_url: "/tinymce/langs/zh_CN.js",
    skin_url: "/tinymce/skins/ui/oxide",
    content_css: "/tinymce/skins/content/default/content.css",
    language: "zh_CN",
    branding: false,
    menubar: false,
    toolbar: "emoticons",
    plugins: "emoticons",
    license_key: "gpl",
    paste_data_images: false,
    statusbar: false,
    height: 150,
    content_style:
    "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }p {margin:3px; line-height:24px;}",
    placeholder: props.holder
})

const tinymceId = ref(
    "vue-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + "")
)

// 点击发布
const postComment = () => {
    emits('click:post', tinymce.activeEditor.getContent())
}   

watch(() => props.holder, (newVal) => {
    const editor = tinymce.get(tinymceId.value); 
    if (editor) {
        const body = editor.getBody();
        if (body) {
            body.setAttribute("data-mce-placeholder", newVal); 
            editor.setContent('')
        }
    }
});


const handleGetContent = () => {
    return tinymce.activeEditor.getContent();
};

onMounted(() => {
    tinymce.init({})
})

defineExpose({
    handleGetContent
})

</script>

<style scoped>
.commentBtn {
    margin-top: 10px; 
    padding: 8px; 
    border-radius: 4px; 
    width: 70px; text-align: center; 
    margin-left: auto; margin-right: 20px;
    cursor: pointer;
    background-color: #0cac0c;
    transition: opacity .3s linear;
    color: white;
}
.commentBtn:hover {
    opacity: 80%;
}
</style>