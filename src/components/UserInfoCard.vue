<template>
    <div class="info-card">
        <el-avatar :size="60" :src="userInfo.avatar">KL</el-avatar>
        <div class="basic-info">
            <span class="username">{{ userInfo.username }}</span>
            <span class="profile">{{ userInfo.profile }}</span>
        </div>
        <div class="follow-info">
            <div class="subscribers_count">
                <span>粉丝</span>
                <span>{{ transNum(userInfo.subscribers_count) }}</span> 
            </div>
            <div class="divider"></div>
            <div class="subscribing_count">
                <span>关注</span>
                <span>{{ transNum(userInfo.subscribing_count) }}</span>
            </div> 
        </div>
        <div class="info-card-btn" :class="userInfo?.is_subscribe? 'info-card-btn2': 'info-card-btn1'" @click="toggleFollow">{{ userInfo.is_subscribe? '已关注': '+ 关注TA' }}</div>
    </div>
</template>

<script setup>
import { transNum } from '@/utils/data_calculate';

const props = defineProps({
    userInfo: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:subscribe'])
const toggleFollow = () => {
    emit('update:subscribe', !props.userInfo.is_subscribe)
}
</script>

<style scoped>
.info-card {
    background-color: white;
    width: 270px;
    height: 185px;
    border: 1px solid #DEDCDC;
    border-radius: 10px;
    box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.4);
    padding: 0px 18px;
    overflow: hidden;
}

.info-card .el-avatar{
    transform: translateY(-30px);
    position: absolute;
}
.info-card .basic-info{
    margin: 10px 0px 0px 65px;
    display: flex;
    flex-direction: column;
}
.info-card .basic-info .username{
    font-size: 17px;
    font-weight: bold;
    color: black;
}
.info-card .basic-info .profile{
    margin-top: 10px;
    font-size: 13px;
    height: 20px;
    color: #bbb;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: auto;
}

.info-card .follow-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 40px;
    margin-top: 12px;
    font-size: 12px;
}

.follow-info .subscribers_count, .follow-info .subscribing_count{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.follow-info .divider{
    width: 2px;
    height: 25px;
    background-color: #2f2a2a;
}

.subscribing_count span:last-of-type, .subscribers_count span:last-of-type{
    margin-top: 3px;
    font-size: 20px;
    font-weight: bold;
    color: black;
}

.info-card-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    border-radius: 6px;
    height: 30px;
    width: 80%;
    margin: 12px auto 0px auto;
    cursor: pointer;
    transition: background-color .3s ease-in-out;
}
.info-card-btn1 {
    background-color:#1682da;
    color: white;
}
.info-card-btn2 {
    background-color: #EEE;
    color: #BBB;
}

</style>