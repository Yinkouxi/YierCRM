<template>
  <div class="about">
    <h2>about</h2>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@renderer/store/useUserStore'
import { useStore } from '@renderer/store'
const userStore = useUserStore()
const store  = useStore()
console.log(store,'store')
console.log(userStore, 'about----')
</script>

<style scoped>
.about {
  color: blueviolet;
}
</style>
