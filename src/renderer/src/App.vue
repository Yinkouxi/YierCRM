<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'

// 初始化时判断是要切换暗黑模式
onBeforeMount(() => {
  const dark = ref<string | null>(localStorage.getItem('dark'))
  const element = document.querySelector('html') as HTMLElement | null
  if (element) {
    if (dark.value == 'dark') {
      element.className = 'dark'
    } else {
      element.className = ''
    }
  }
})
</script>

<style scoped>
@import 'assets/css/style.less';
</style>
