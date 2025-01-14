<template>
    难度选择
    <div class="barplot">
        <div v-for="(num, index) in numList" :key="index" class="bar-item">
            <div>{{ num }}</div>
            <div :style="getBarStyle(index)" class="bar" @click="selectBar(index)"></div>
        </div>
    </div>
</template>

<script setup>
import { getDifficultColor } from '@/utils/color'
import { ref } from 'vue';

const props = defineProps({
    numList: {
        type: Array,
        default: () =>([])
    },
    selectedDiff: {
        type: Number,
        default: undefined
    }
})

const emit = defineEmits(['selectDiff'])

const getBarStyle = (index) => {
    
    if (props.selectedDiff == index+1) {
        return {
            "height": `${Math.max(10, Math.floor(props.numList[index] / Math.max(...props.numList) * 100))}px`,
            "background-color": `${getDifficultColor(index + 1)}`,
            "border": `#1A2A4D 1px solid`
            
        }   
    }
    else {
        return {
            "height": `${Math.max(10, Math.floor(props.numList[index] / Math.max(...props.numList) * 100))}px`,
            "background-color": `${getDifficultColor(index + 1)}`,
            "border": `${getDifficultColor(index + 1)} 1px solid`
        }  
    }
}
const selectBar = (index) => {
    emit('selectDiff', index+1)
}
</script>

<style scoped>
.barplot {
    display: flex;
}
.bar-item {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    gap: 2px;
}
.bar {
    width: 18px;
    transition: transform .2s linear;
    border-radius: 3px 3px 0px 0px;
}
.bar:hover {
    transform: translateY(-3px);
}
</style>