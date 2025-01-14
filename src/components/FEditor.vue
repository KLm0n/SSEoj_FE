<script setup>
import { onMounted } from 'vue'
import '@opentiny/fluent-editor/style.css';
import 'mathlive'
import 'mathlive/static.css'
import 'mathlive/fonts.css'

let mathliveEditor

const TOOLBAR_CONFIG = [
  // ['undo', 'redo', 'clean', 'format-painter'],
  [
    { header: [1, 2, 3, 4, 5, 6, false] },
    // { font: ['songti', 'yahei', 'kaiti', 'heiti', 'lishu', 'mono', 'arial', 'arialblack', 'comic', 'impact', 'times'] },
    { size: ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '36px', '48px', '72px'] },
    { lineheight: ['1', '1.2', '1.5', '1.75', '2', '3', '4', '5'] },
  ],
  ['bold', 'italic', 'strike', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  ['link', 'blockquote', 'code', 'code-block'],
  ['image', 'file', 'better-table'],
  ['formula'],
]

// 这里需要换成你自己的图片上传服务地址
const IMG_API_URL = 'http://127.0.0.1:5000/upload'

/**
 * 上传图片到服务器
 * @param image File 格式的图片
 * @param callback 回调函数，用来处理服务器返回的图片 URL
 * 除了 XMLHttpRequest，也可以使用 fetch / axios 等工具实现图片上传。
 */
function imageHandler(image, callback) {
  const data = new FormData()
  data.append('image', image)
  const xhr = new XMLHttpRequest()
  xhr.open('POST', IMG_API_URL, true)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      // 这里需要换成实际的接口返回值，比如：JSON.parse(xhr.responseText)
      console.log(xhr.response)
      const response = JSON.parse(xhr.responseText)
      if (response.status === 200 && response.success) {
        callback(response.data.link)
      }
      else {
        // 图片上传失败了，就转成 Base64 格式
        const reader = new FileReader()
        reader.onload = function (e) {
          callback(e.target.result)
        }
        reader.readAsDataURL(image)
      }
    }
  }
  xhr.send(data)
}

const props = defineProps({
  initialValue: {
    type: String,
    default: ''
  },
  initId: {
    type: String,
    default: 'mathliveEditor'
  }
})

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then((module) => {
    const FluentEditor = module.default

    mathliveEditor = new FluentEditor(`#${props.initId}`, {
      theme: 'snow',
      modules: {
        toolbar: {
          container: TOOLBAR_CONFIG,
          handlers: {
            formula() {
              const mathlive = this.quill.getModule('mathlive')
              mathlive.createDialog('')
            },
          },
        },
        mathlive: true,
        file: true,
      },
      uploadOption: {
        imageUpload: ({ file, callback }) => {
          imageHandler(file, (imageUrl) => {
            // 调用 callback，传入 imageUrl 即可实现图片渲染
            callback({
              code: 0,
              message: 'Upload success!',
              data: {
                imageUrl,
              },
            })
          })
        },
      },
    })
    mathliveEditor.root.innerHTML = props.initialValue
  })
}
)


const getContent = () => {
  return mathliveEditor.root.innerHTML
}

const setContent = (content) => {
    mathliveEditor.root.innerHTML = content
}

defineExpose({
    getContent,
    setContent
})
</script>

<template>
  <div :id="initId" />
</template>
