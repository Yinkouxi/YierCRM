import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
  history: createWebHashHistory(), //hash模式
  routes: [
    {
      path: '/',
      name:'首页',
      component: ()=>import('../views/Home.vue')
    },
    {
      path:'/about',
      name:'关于',
      component:()=>import('../views/About.vue')
    }
  ] //路由配置规则数组
})
