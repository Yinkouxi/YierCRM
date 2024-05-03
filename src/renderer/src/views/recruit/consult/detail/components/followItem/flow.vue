<template>
  <el-container>
    <el-main>
      <el-table :data="tableData" border stripe width="100%">
        <el-table-column label="序号" type="expand" width="60" align="center">
          <template #default="{ row }">
            <div style="padding: 15px">
              <el-descriptions :column="1" title="跟进内容：">
                <el-descriptions-item>
                  {{ row.followContent }}
                </el-descriptions-item>
              </el-descriptions>

              <el-descriptions :column="1" title="文件列表：" border>
                <el-descriptions-item label="文件名：" v-for="item in row.files" :key="row.id">
                  <div style="cursor: pointer" @click="openMedia(item)">{{ item.name }}</div>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="跟进方式">
          <template #default="{ row }">
            <template v-for="item in dicts.recruit_follow_method" :key="item.v">
              <el-text v-if="row.followMethod == item.v">{{ item.k }}</el-text>
            </template>
          </template>
        </el-table-column>

        <el-table-column label="跟进时间" prop="followTime"></el-table-column>
        <el-table-column label="下次跟进时间" prop="followNextTime"></el-table-column>
        <el-table-column label="顾问老师" prop="roleManName"></el-table-column>
      </el-table>
    </el-main>
  </el-container>

  <el-dialog v-model="imgShow" title="图片预览" width="600">
    <el-image style="width: 100%; height: 100%" :src="imgUrl"></el-image>
  </el-dialog>

  <el-dialog v-model="audioShow" title="音频文件" width="600">
    <audio :src="audioUrl" controls v-if="audioShow"></audio>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, inject, onBeforeMount, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { followPage, IFollowPageRecords, IFiles } from '@api/recruitConsult'
import { dicts } from '@mixins/DIctsPlugin'
//从父组件中注入提供的值
const id = inject('id')
//table数据
let tableData = ref<IFollowPageRecords[]>([])
onBeforeMount(() => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    ;(proxy as any).getDicts(['recruit_follow_method'])
  }
  getFollowPage()
})

//跟进信息
const getFollowPage = async () => {
  let res = await followPage({
    page: 1,
    size: 10,
    customerId: id as string
  })
  let { records } = res.data
  tableData.value = records
}

//查看文件
let imgShow = ref(false)
let imgUrl = ref('')
let audioShow = ref(false)
let audioUrl = ref('')
const openMedia = (item: IFiles) => {
  if (item.fileType == 'image/jpeg' || item.fileType == 'image/png') {
    imgShow.value = true
    imgUrl.value = 'https://oss.xuexiluxian.cn/' + item.name
  } else if (item.fileType == 'audio/mpeg') {
    audioShow.value = true
    audioUrl.value = 'https://oss.xuexiluxian.cn/' + item.name
  }
  // ai补全
  // 文件类型为excel
  else if (item.fileType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    window.open('https://oss.xuexiluxian.cn/' + item.name)
  }
  // 文件类型为pdf
  else if (item.fileType == 'application/pdf') {
    window.open('https://oss.xuexiluxian.cn/' + item.name)
  }
  // 文件类型为word
  else if (item.fileType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    window.open('https://oss.xuexiluxian.cn/' + item.name)
  }
  // 文件类型为txt
  else if (item.fileType == 'text/plain') {
    window.open('https://oss.xuexiluxian.cn/' + item.name)
  }
  // 文件类型为ppt
  else if (item.fileType == 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
    window.open('https://oss.xuexiluxian.cn/' + item.name)
  }
  // 文件类型为zip
  else if (item.fileType == 'application/zip') {
    window.open('https://oss.xuexiluxian.cn/' + item.name)
  }
  // 文件类型为rar
  else if (item.fileType == 'application/x-rar-compressed') {
    window.open('https://oss.xuexiluxian.cn/' + item.name)
  }

}
</script>
