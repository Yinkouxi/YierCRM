// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'

// 状态管理-持久化存储
const store = createPinia()
store.use(piniaPluginPersist)

const app = createApp(App)

app.use(router)
app.use(store)
app.mount('#app')
