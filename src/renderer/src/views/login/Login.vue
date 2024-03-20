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
        <!-- 国际化 -->
        <el-dropdown trigger="click" @command="configLang">
          <el-button circle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              width="1em"
              height="1em"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 512 512"
            >
              <path
                d="M478.33 433.6l-90-218a22 22 0 0 0-40.67 0l-90 218a22 22 0 1 0 40.67 16.79L316.66 406h102.67l18.33 44.39A22 22 0 0 0 458 464a22 22 0 0 0 20.32-30.4zM334.83 362L368 281.65L401.17 362z"
                fill="currentColor"
              ></path>
              <path
                d="M267.84 342.92a22 22 0 0 0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73c39.65-53.68 62.11-114.75 71.27-143.49H330a22 22 0 0 0 0-44H214V70a22 22 0 0 0-44 0v20H54a22 22 0 0 0 0 44h197.25c-9.52 26.95-27.05 69.5-53.79 108.36c-31.41-41.68-43.08-68.65-43.17-68.87a22 22 0 0 0-40.58 17c.58 1.38 14.55 34.23 52.86 83.93c.92 1.19 1.83 2.35 2.74 3.51c-39.24 44.35-77.74 71.86-93.85 80.74a22 22 0 1 0 21.07 38.63c2.16-1.18 48.6-26.89 101.63-85.59c22.52 24.08 38 35.44 38.93 36.1a22 22 0 0 0 30.75-4.9z"
                fill="currentColor"
              ></path>
            </svg>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in config.LANG" :key="item.value" :command="item">{{
                item.name
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- 关闭软件 -->
        <el-button icon="close" circle type="default" @click="closeWin"></el-button>
      </div>
    </div>

    <!-- 左侧 -->
    <div class="login-adv">
      <div class="login-adv-title">
        <h2>{{ $t('login.name') }}</h2>
        <h4>{{ $t('login.slogan') }}</h4>
        <p>{{ $t('login.describe') }}</p>
      </div>
      <div class="login-adv-mask"></div>
      <div class="login-adv-imgage">
        <img src="@assets/images/data.png" width="100%" />
      </div>
      <div class="login-adv-bottom">{{ $t('login.version') }}</div>
    </div>
    <!-- 右侧 -->
    <div class="login-main">
      <div class="login-form">
        <!-- header -->
        <div class="login-header">
          <div class="login-img">
            <img src="@assets/images/logo.png" alt="" />
            <label>{{ $t('login.title') }}</label>
          </div>
        </div>
        <!-- form-main -->
        <el-tabs>
          <el-tab-pane :label="$t('login.accountLogin')" lazy style="height: 300px">
            <PasswordForm></PasswordForm>
          </el-tab-pane>
          <el-tab-pane :label="$t('login.mobileLogin')" lazy style="height: 300px">
            <PhoneForm></PhoneForm>
          </el-tab-pane>
        </el-tabs>
        <template v-if="true">
          <el-divider>{{ $t('login.signInOther') }}</el-divider>
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

import { ComponentInternalInstance, getCurrentInstance, reactive, ref } from 'vue'

let isKeyDown = ref<boolean>(false)
let dinatesX = ref<number>(0)
let dinatesY = ref<number>(0)
const { proxy } = getCurrentInstance() as ComponentInternalInstance
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

// 国际化
const config = reactive({
  LANG: [
    { name: '中文', value: 'zh-cn' },
    { name: '英文', value: 'en' }
  ]
})
const configLang = (item: { name: string; value: string }) => {
  let $i18n = proxy?.$i18n
  $i18n!.locale = item.value
  localStorage.setItem('lang', item.value)
  // console.log(item.value)
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
      window.electron.ipcRenderer.invoke('custom-adsorption', data)
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
    background: url('@assets/images/auth_banner.jpg') no-repeat;

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
      z-index: 2;
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
