export const AppRoutes = [
  {
    path: '/',
    name: 'layout',
    component: () => import('@layout/index.vue'),
    redirect: '/dashboard'
    // children: [{ path: '/dashboard', component: () => import('@views/home/index.vue') }]
  },
  {
    path: '/login',
    name: '登录',
    component: () => import('@views/login/Login.vue')
  },
  {
    path: '/tasklist',
    name: '下载',
    component: () => import('@views/home/task.vue')
  },
  {
    path:'/chat',
    name:'聊天',
    component:()=>import('@views/home/chat.vue')
  }
]
