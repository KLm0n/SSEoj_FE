<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="overlay" v-if="isVisible" @click="closeWindow">
        <div class="favorites-window">

        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';



const props = defineProps({
    isVisible: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['update:isVisible'])
const closeWindow = () => {
    emit('update:isVisible', false)
}
onMounted(() => {
    console.log("created")
})
</script>

<style scoped>
.favorites-window {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    width: 400px;
    height: 500px;
    background-color: white;
}
.overlay{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 99;
}
</style>