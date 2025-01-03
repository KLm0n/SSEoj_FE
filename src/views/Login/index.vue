<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container">
    <header>
      <h2 class="logo">SSEOJ</h2>
    </header>
    <div class="pane">
      <div class="wrapper" :class="{ active }">
        <!-- Login Form -->
        <div class="form_box login">
          <h2>Login</h2>
          <form @submit.prevent="doLogin">
            <div class="input_box">
              <span class="icon"><ion-icon name="mail"></ion-icon></span>
              <input type="text" v-model="email" required />
              <label>Email</label>
            </div>
            <div class="input_box">
              <span class="icon"><ion-icon name="lock-closed"></ion-icon></span>
              <input type="password" v-model="password" required />
              <label>Password</label>
            </div>
            <div class="remember_forgot">
              <label><input type="checkbox">Remember me</label>
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" class="btn">Login</button>
            <div class="login_register">
              <p>Don't have an account? <label class="register_link" @click="showRegister">Register</label></p>
            </div>
          </form>
        </div>

        <!-- Registration Form -->
        <div class="form_box register">
          <h2>Registration</h2>
          <form @submit.prevent="doRegister">
            <div class="input_box">
              <span class="icon"><ion-icon name="person"></ion-icon></span>
              <input type="text" v-model="username" required>
              <label>Username</label>
            </div>
            <div class="input_box">
              <span class="icon"><ion-icon name="mail"></ion-icon></span>
              <input type="text" v-model="registerEmail" required>
              <label>Email</label>
            </div>
            <div class="input_box_verfication">
              <span class="icon"><ion-icon name="pencil"></ion-icon></span>
              <input type="text" v-model="verificationCode" required>
              <label>Verification Code</label>
            </div>
            <div>
              <button type="submit" class="btn_verification">Send</button>
            </div>
            <div class="input_box">
              <span class="icon"><ion-icon name="lock-closed"></ion-icon></span>
              <input type="password" v-model="registerPassword" required>
              <label>Password</label>
            </div>
            <div class="input_box">
              <span class="icon"><ion-icon name="alert-circle"></ion-icon></span>
              <input type="password" v-model="repassword" required>
              <label>Repassword</label>
            </div>
            <button type="sumit" class="btn">Register</button>
            <div class="login_register">
              <p>Already have an account? <label class="login_link" @click="showLogin">Login</label></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/userStore';
import 'element-plus/theme-chalk/el-message.css';
import router from '@/router';
import forge from 'node-forge';

// Data properties
const email = ref('');
const password = ref('');
const username = ref('');
const registerEmail = ref('');
const registerPassword = ref('');
const verificationCode = ref('');
const repassword = ref('');
const active = ref(false);

const userStore = useUserStore()


// Methods
const doLogin = async () => {
  const publicKeyPem = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKHP3hnFtL1g3bpgDMFAma1MofY9UmInthR8vK5Q9/dYcfdqvzLFRdRCPdeefqGO+BIFfLeCKJi4odn61XJEvp8CAwEAAQ==
-----END PUBLIC KEY-----`
  // const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  // const encrypted = forge.util.encode64(publicKey.encrypt(password.value));
  // console.log(encrypted)
  await userStore.getUserInfo(email.value, password.value)
  ElMessage({ type: "success", message: "登陆成功" })
  const redirectPath = localStorage.getItem('redirectPath') || '/'
  router.replace(redirectPath)
  localStorage.removeItem('redirectPath')
}

const doRegister = () => {
  alert('Registration logic needs to be implemented.');
};

const showRegister = (event) => {
  event.preventDefault();
  active.value = true; // Set active to true when switching to register form
};

const showLogin = (event) => {
  event.preventDefault();
  active.value = false; // Set active to false when switching back to login form
};

// Mounted lifecycle hook for dynamically loading external scripts
onMounted(() => {
  const scriptModule = document.createElement('script');
  scriptModule.type = 'module';
  scriptModule.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js';
  document.head.appendChild(scriptModule);

  const scriptNoModule = document.createElement('script');
  scriptNoModule.nomodule = true;
  scriptNoModule.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js';
  document.head.appendChild(scriptNoModule);
});
</script>

<style scoped>
/* Add your CSS styles here */
@import url('login.css');
</style>
