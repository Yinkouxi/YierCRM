<template>
  <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="我的咨询本" name="my">
          <template #label>
              <div class="custom-tabs-label">我的咨询本</div>
          </template>
          <My />
      </el-tab-pane>
      <el-tab-pane label="全部客户" name="log">
          <template #label>
              <div class="custom-tabs-label">全部客户</div>
          </template>
      </el-tab-pane>
      <el-tab-pane label="我的客户" name="myClient">
          <template #label>
              <div class="custom-tabs-label">我的客户</div>
          </template>
      </el-tab-pane>
      <el-tab-pane label="渠道管理" name="channel">
          <template #label>
              <div class="custom-tabs-label">渠道管理</div>
          </template>
      </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import My from './components/My.vue'
const activeName = ref('my')
</script>

<style scoped less>
.custom-tabs-label{
  min-width: 60px;
  margin: 0 20px;
  text-align: center;
}
:deep(.el-tabs__header){
  margin:0;
}
:deep(.el-tabs__item){
  margin:0 20px;
}
</style>
