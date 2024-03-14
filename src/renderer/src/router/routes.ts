
export const AppRoutes = [
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
]
