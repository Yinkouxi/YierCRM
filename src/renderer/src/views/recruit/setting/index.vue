<template>
  <el-container>
    <el-main>
      <el-card
        v-for="(item, i) in publicData"
        :key="i"
        :header="item.group"
        shadow="never"
        style="margin-bottom: 15px"
      >
        <el-alert
          show-icon
          v-if="item.group == '咨询记录设置'"
          title="姓名+手机号重复的咨询在任何设置下，均不允许录入!"
          type="warning"
          :closable="false"
        />
        <el-table :data="item.items" style="width: 100%">
          <el-table-column width="80">
            <template #default="{ row }">
              <el-switch
                v-if="row.fieldType == 'switch'"
                :model-value="Boolean(row.v == 'true' ? '1' : '')"
                @change="updateSwitch(row, $event)"
              />
              <el-input
                v-else-if="row.fieldType == 'input'"
                v-model="row.v"
                @change="updateSwitch(row, $event)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="label" />
        </el-table>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import {
  configPage,
  IConfigPageDataList,
  IConfigPageDataItem,
  configUpdate
} from '@api/recruitConfig'
import { ElMessage } from 'element-plus'

onBeforeMount(() => {
  getConfig()
})

let publicData = ref<IConfigPageDataList[]>([])
const getConfig = async () => {
  let res = await configPage({
    k: '',
    type: 1,
    enabled: 1
  })
  publicData.value = res.data
}

const updateSwitch = async (row: IConfigPageDataItem, $event: boolean) => {
  let res = await configUpdate({
    id: row.id,
    k: row.k,
    v: $event.toString()
  })
  if (res.code == '200') {
    ElMessage.success(res.msg)
    getConfig()
  } else {
    ElMessage.error(res.msg)
  }
}
</script>
