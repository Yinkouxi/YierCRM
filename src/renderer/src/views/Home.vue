<template>
  <div class="home">
    <h2>home</h2>
    <button @click="changeToken">change token</button>
    <p>{{ userStore.token }}</p>
    <button @click="login">点击登录</button>
    <el-button type="success" plain>Success</el-button>

    <div class="slider-demo-block">
    <span class="demonstration">Default value</span>
    <el-slider v-model="value1" />
  </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@renderer/store'
import { useUserStore } from '@renderer/store/useUserStore'
import { loginByJson } from '@api/login.ts'
import { ref } from 'vue';
const userStore = useUserStore()
const store = useStore()
console.log(userStore.userName, 'home')
console.log(userStore.token, 'home')
console.log(store.user.userName, 'main')
const value1 = ref(0)
const changeToken = () => {
  userStore.token = 'hhhhhhhpinkMan'
}
const login = async () => {
  let res = await loginByJson({
    password: 'asdfasd',
    username: '416',
    key: 'fsdfa',
    captcha: '6416'
  })
  console.log(res.data)
}
</script>

<style scoped>
.home {
  color: blueviolet;
}
</style>
