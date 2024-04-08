<template>
  <div class="app">
    <el-config-provider :locale="locale">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { ComponentInternalInstance } from 'vue'
import { computed } from 'vue'
import { ref, onBeforeMount } from 'vue'
import { VueI18n } from 'vue-i18n'

let { proxy } = getCurrentInstance() as ComponentInternalInstance

let locale = computed(() => {
  let i18n = proxy?.$i18n as VueI18n
  return i18n.messages[i18n.locale].el
})

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
