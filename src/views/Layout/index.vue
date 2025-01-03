<!-- eslint-disable vue/multi-word-component-names -->
 
<script setup>
import layoutNav from '@/views/Layout/components/layoutNav.vue'
</script>

<template>
    <layoutNav />
    <router-view />
</template>

<style scoped>
layoutNav {
    clear: both;
}
</style>
