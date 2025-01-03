<template>
    <div class="title">SSEOJ</div>
    <div class="header">
        <el-menu mode="horizontal" :default-active="$route.path" router="true" background-color="#282727"
            text-color="#ffffff" active-text-color="#ffffff" :ellipsis="false">
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/problemset">题库</el-menu-item>
            <el-menu-item index="/problemlist">题单</el-menu-item>
            <el-menu-item index="/discussion">讨论</el-menu-item>
        </el-menu>
        <template v-if="userStore.isAuthenticated()">
            <div class="userInfo">
                <el-popover :show-arrow="false">
                    <template #reference>
                        <el-avatar :src="userStore.getAvatar()" :size="60" fit="fill" @click="goToUser(userStore.userInfo.id)">User</el-avatar>
                    </template>
                    <template #default>
                        <div class="avatarDropdown">
                            <p>111</p>
                            <p>222</p>
                            <p>333</p>
                            <p @click="logout">退出登录</p>
                        </div>
                    </template>
                </el-popover>
                <span>{{ userStore.userInfo.username }}</span>
            </div>
        </template>
        <template v-else>
            <ul class="notAuth">
                <a @click="router.push('/login')">登录</a>
                <a href="#">帮助</a>
            </ul>
        </template>
    </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const router = useRouter()
const userStore = useUserStore()
const logout = () => {
    userStore.clearUserInfo()
    ElMessage({ type: "success", message: "退出成功" })
}

const goToUser = (userId) => {
  router.replace(`/user/${userId}`);
};

</script>

<style scoped>
.title{
    width: 85%;
    font-size: 30px;
    margin: 5px auto 5px auto;
    height: 36px;
    position: relative;
}
.header {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    margin-bottom: 15px;
    margin-left: auto;
    margin-right: auto;
    background-color: #282727;
    border-radius: 10px;
    width: 85%;
    min-width: 800px;
    height: 60px;
    position: relative;
    clear: both;
}


.el-menu {
    margin-left: 50px;
    --el-menu-base-level-padding: 25px;
    --el-menu-border-color: none;
    gap: 15px;
    position: relative;
    clear: both;
}

.el-menu-item {
    font-size: 17px;
    --el-menu-hover-bg-color: black;
    position: relative;
}

.el-menu-item.is-active {
    font-weight: 500;
}

.el-menu-item.is-active::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -3px;
    width: 100%;
    height: 4px;
    box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.4);
}

.el-menu--horizontal {
    --el-menu-horizontal-height: 60px;
}

.avatarDropdown p {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    height: 50px;
    color: #333;
    cursor: pointer;
}

.avatarDropdown p:hover {
    background-color: rgba(20, 20, 20, 0.4);
}


.userInfo {
    display: flex;
    margin-right: 80px;
    gap: 20px;
}

.userInfo .el-avatar {
    transform: translateY(-30px);
    scale: 1.3;
    /* border: #bbbbbb 2px solid; */
    box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.2)
}

.userInfo span {
    color: black;
    transform: translateY(-30px);
    font-size: 16px;
    font-weight: bold;
}

.notAuth {
    display: flex;
    margin-right: 30px;
    --el-menu-base-level-padding: 10px;
    --el-menu-border-color: none;
    gap: 20px;
    align-items: center;
    justify-content: center;
}

.notAuth a{
    text-decoration: none;
    color: #ffffff;
}
.notAuth a:hover{
    font-weight: bold
}

</style>
