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

//国际化
import i18n from './locales'

// 状态管理-持久化存储
const store = createPinia()
store.use(piniaPluginPersist)

//全局混入
import useDicts from '@mixins/DIctsPlugin'
import { dicts } from '@mixins/DIctsPlugin'
app.config.globalProperties.$dicts = dicts

//全局组件-分页
import pagination from '@components/pagination/index.vue'
app.component('pagination', pagination)

import { AuthDirectives } from './directives/auths.directives'
app.directive(AuthDirectives.name,AuthDirectives);


app.use(router)
app.use(store)
app.use(i18n)
app.use(useDicts)
app.mount('#app')
