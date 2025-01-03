import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import './mock/login'
import './mock/problemset'
import './mock/problem'
import './mock/tags'
import './mock/postList'
import './mock/post'
import './mock/comment'
import './mock/problemlist'
import './mock/user'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

app.mount('#app')
