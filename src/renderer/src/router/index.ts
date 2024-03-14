import { createRouter, createWebHashHistory } from 'vue-router'

// 引入路由表
import { AppRoutes } from './routes'
// 引入路由守卫
import { afterEach, beforeEach } from './guards'

const router = createRouter({
  history: createWebHashHistory(), //hash模式
  routes: AppRoutes //路由配置规则数组
})

router.beforeEach(beforeEach)
router.afterEach(afterEach)

export default router
