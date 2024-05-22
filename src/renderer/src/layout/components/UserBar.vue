<template>
  <div class="user-bar">
    <!--退出登录-->
    <el-dropdown class="panel-item">
      <div class="user-avatar">
        <el-avatar :size="30" :src="userInfo.avatar" />
        <el-icon><ArrowDown /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="outLogin">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!--消息-->
    <div class="panel-item" @click="goChat">
      <el-icon><ChatDotRound /></el-icon>
    </div>

    <!--下载-->
    <div class="panel-item" @click="goTask">
      <el-icon><Download /></el-icon>
    </div>

    <!--缩小-->
    <div class="panel-item" @click="minWin">
      <el-icon><Minus /></el-icon>
    </div>

    <!--放大-->
    <div class="panel-item" @click="maxWin">
      <el-icon><FullScreen /></el-icon>
    </div>

    <!--关闭-->
    <div class="panel-item" @click="winClose">
      <el-icon><Close /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@store/useUserStore'
const userStore = useUserStore()
import { storeToRefs } from 'pinia'
const { userInfo } = storeToRefs(userStore)

//退出登录
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { url } from 'inspector';
const router = useRouter()
const outLogin = () => {
  ElMessageBox.confirm('确认', '是否退出登录', {
    type: 'warning',
    confirmButtonText: '退出'
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: '退出登录'
      })
      window.electron.ipcRenderer.invoke('renderer-to-main', { name: 'out-login' })
      localStorage.setItem('TOKEN', '')
      router.replace({
        path: '/login'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消退出'
      })
    })
}

// 聊天
const goChat = () => {
  window.electron.ipcRenderer.invoke('renderer-to-main', {
    name: 'open-window-frame',
    data:{
      url:'/chat'
    }
  })
}

//退出应用
const winClose = () => {
  ElMessageBox.confirm('确认', '是否退出?', {
    type: 'warning',
    confirmButtonText: '退出'
  })
    .then(() => {
      window.electron.ipcRenderer.invoke('renderer-to-main', {
        name: 'win-close'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消退出'
      })
    })
}

//最小化
const minWin = () => {
  window.electron.ipcRenderer.invoke('renderer-to-main', {
    name: 'min-win'
  })
}

//最大化
const maxWin = () => {
  window.electron.ipcRenderer.invoke('renderer-to-main', {
    name: 'max-win'
  })
}

//下载
/**
 * 触发打开任务窗口的进程间通信。
 * 该函数无参数。
 * 无显式返回值，但会向主进程发送一个包含窗口打开信息的消息。
 */
const goTask = () => {
  // 向主进程发送消息，请求打开一个特定URL的任务列表窗口
  window.electron.ipcRenderer.invoke('renderer-to-main', {
    name: 'open-window-frame',
    data: {
      url: '/tasklist'
    }
  })
}
</script>

<style scoped lang="less">
.user-bar {
  display: flex;
  align-items: center;
  height: 100%;
  .panel-item {
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 100%;
    cursor: pointer;
    .user-avatar {
      display: flex;
      align-items: center;
    }
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
