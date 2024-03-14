<template>
  <div class="home">
    <h2>home</h2>
    <button @click="changeToken">change token</button>
    <p>{{ userStore.token }}</p>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@renderer/store'
import { useUserStore } from '@renderer/store/useUserStore';
const userStore = useUserStore()
const store = useStore()
console.log(userStore.userName,'home')
console.log(userStore.token,'home')
console.log(store.user.userName,'main')

const changeToken = ()=>{
  userStore.token='hhhhhhhpinkMan'
}
</script>

<style  scoped>
.home{
    color: blueviolet;
}
</style>
