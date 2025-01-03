<!-- eslint-disable vue/multi-word-component-names -->

<template>
    <div class="wrapper">
        {{ solutionDetail.title }}
    </div>
    <div class="footer">

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getSolutionDetailAPI } from '@/apis/problemset';

const route = useRoute()
const pid = route.params.pid
const sid = route.params.sid
const solutionDetail = ref({})
onMounted(async() => {
    const res = await getSolutionDetailAPI(pid, sid)
    solutionDetail.value = res.data
})
</script>