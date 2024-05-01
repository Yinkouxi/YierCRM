<template>
  <el-container>
    <el-main>
      <div style="margin: 20px 0; text-align: center">
        <el-radio-group v-model="activeName">
          <el-radio-button
            v-for="item in activeList"
            :key="item.comName"
            :label="item.comName"
            @click="change(item)"
          >
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <component :is="activeCom"></component>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import flow from './followItem/flow.vue'
import audition from './followItem/audition.vue'

let activeName = ref('flow')
let activeCom = ref(flow)
let activeList = ref([
  { name: '跟进信息', com: flow, comName: 'flow' },
  { name: '试听记录', com: audition, comName: 'audition' }
])

const change = (item: any) => {
  activeCom.value = item.com
}
</script>
