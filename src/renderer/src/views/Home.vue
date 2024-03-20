<template>
  <div class="login" @mousedown="mousedown">
    <!-- 按钮 -->
    <div class="login-config">
      <div class="login-config-btn">
        <!-- 换肤 -->
        <el-button circle @click="configDark">
          <el-icon v-if="dark == 'dark'"><Sunny /></el-icon>
          <el-icon v-else><Moon /></el-icon>
        </el-button>
        <!-- 关闭软件 -->
        <el-button icon="close" circle type="default" @click="closeWin"></el-button>
      </div>
    </div>

    <!-- 左侧 -->
    <div class="login-adv">
      <div class="login-adv-title">
        <h2>YierCRM</h2>
        <h4>客户关系管理系统</h4>
        <p>基于Electron + Vue3 + Element-Plus 的中后台前端解决方案。</p>
      </div>
      <div class="login-adv-mask"></div>
      <div class="login-adv-imgage">
        <img src="@assets/images/data.png" width="100%" />
      </div>
      <div class="login-adv-bottom">© YierCRM客户管理系统 1.0</div>
    </div>
    <!-- 右侧 -->
    <div class="login-main">
      <div class="login-form">
        <!-- header -->
        <div class="login-header">
          <div class="login-img">
            <img src="../assets/images/logo.png" alt="" />
            <label>Yier客户管理系统</label>
          </div>
        </div>
        <!-- form-main -->
        <el-tabs>
          <el-tab-pane label="账号登录" lazy style="height: 300px">
            <PasswordForm></PasswordForm>
          </el-tab-pane>
          <el-tab-pane label="手机号登录" lazy style="height: 300px">
            <PhoneForm></PhoneForm>
          </el-tab-pane>
        </el-tabs>
        <template v-if="true">
          <el-divider>其他登录方式</el-divider>
          <div class="login-oauth">
            <!--微信按钮-->
            <el-button type="success" circle size="large">
              <el-icon size="large">
                <ChatDotRound />
              </el-icon>
            </el-button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
X

<script setup lang="ts">
import PasswordForm from '@views/login/component/PasswordForm.vue'
import PhoneForm from '@views/login/component/PhoneForm.vue'

import { ref } from 'vue'

let isKeyDown = ref<boolean>(false)
let dinatesX = ref<number>(0)
let dinatesY = ref<number>(0)

//关闭软件
const closeWin = (): void => {
  window.electron.ipcRenderer.invoke('close-login')
}

// 换肤
const dark = ref<string | null>(localStorage.getItem('dark'))
const configDark = (): void => {
  const element = document.querySelector('html') as HTMLElement | null
  if (element) {
    if (element.className == 'dark') {
      element.className = ''
    } else {
      element.className = 'dark'
    }
    dark.value = element.className
    localStorage.setItem('dark', element.className)
  }
}
// 拖拽
const mousedown = (event) => {
  isKeyDown.value = true
  dinatesX.value = event.x
  dinatesY.value = event.y

  document.onmousemove = (ev) => {
    if (isKeyDown.value) {
      const x = ev.screenX - dinatesX.value
      const y = ev.screenY - dinatesY.value

      //给主进程传入坐标
      let data = {
        appX: x,
        appY: y
      }
      console.log(data, 'data')
      window.ipcRenderer.invoke('custom-adsorption', data)
    }
  }
  document.onmouseup = () => {
    isKeyDown.value = false
  }
}
</script>

<style scoped lang="less">
.login {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  display: flex;

  .login-config {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    z-index: 9999;

    .login-config-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 120px;
      margin: 10px 10px 0 0;
      float: right;
    }
  }

  .login-adv {
    width: 40vw;
    position: relative;
    background: url('../assets/images/auth_banner.jpg') no-repeat;

    .login-adv-imgage {
      position: absolute;
      left: 0px;
      right: 0px;
      bottom: 80px;
      padding: 40px;
      z-index: 1;

      img {
        width: 100%;
        height: 100%;
      }
    }
    .login-adv-mask {
      position: absolute;
      left: 0px;
      top: 0px;
      right: 0px;
      bottom: 0px;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1;
    }
    .login-adv-title {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: 40px;
      z-index: 2;
      color: #fff;

      h2 {
        font-size: 40px;
      }
      h4 {
        margin-top: 10px;
        font-size: 18px;
      }
      p {
        font-size: 14px;
        margin-top: 10px;
        line-height: 1.8;
        color: rgba(255, 255, 255, 0.6);
      }
    }
    .login-adv-bottom {
      position: absolute;
      left: 0;
      bottom: 0;
      color: #fff;
      padding: 0 40px 40px 40px;
    }
  }
}
.login-main {
  flex: 1;
  overflow: auto;
  display: flex;
  .login-form {
    width: 400px;
    margin: auto;
    padding: 80px 0 0 0;

    .login-header {
      margin-bottom: 40px;

      .login-img {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .login-img img {
        width: 40px;
        height: 40px;
        vertical-align: bottom;
        margin-right: 10px;
      }
      .login-img label {
        font-size: 26px;
        font-weight: 900;
      }
    }

    .login-oauth {
      display: flex;
      justify-content: space-around;
    }
  }
}
</style>
