import './assets/css/reset.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'

const app = createApp(App)
// Element-plus-icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
import 'element-plus/theme-chalk/index.css'


// 状态管理-持久化存储
const store = createPinia()
store.use(piniaPluginPersist)

app.use(router)
app.use(store)
app.mount('#app')
