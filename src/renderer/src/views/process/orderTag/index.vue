<template>
  <div style="height: 100%">
    <el-container>
      <el-main>
        <!-- 添加标签 -->
        <el-card shadow="never">
          <el-button @click="showInput" style="margin-right: 15px;">+ 新建标签</el-button>
          <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model="inputValue"
            size="default"
            class="tag"
            @keyup.enter="handleInputConfirm"
            style="width: 200px"
            placeholder="请输入标签名"
          />
        </el-card>
        <!--标签页-->
        <el-tabs type="border-card">
          <!--标签列表页-->
          <el-tab-pane label="标签列表">
            <el-table row-key="id" :data="tagData" width="100%" border stripe>
              <el-table-column label="序号" type="index" width="60" align="center" />
              <el-table-column label="标签名称" prop="name" align="center" />
              <!--操作-->
              <el-table-column label="操作" fixed="right" width="180px" align="center">
                <template #default="{ row }">
                  <div class="sys-table-main-actions">
                    <el-link :underline="false" type="danger" @click="delTag(row.id)" icon="Delete"
                      >删除</el-link
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-footer style="display: flex; justify-content: flex-end">
              <div class="pagination">
                <pagination
                  :total="totals"
                  @update:current-page="handleCurrentPageUpdate"
                  @update:page-size="handlePageSizeUpdate"
                ></pagination>
              </div>
            </el-footer>
          </el-tab-pane>
          <!--回收站列表页-->
          <el-tab-pane label="回收站">
            <el-card shadow="never"> 回收站 </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { tagPage, ITagPage, ITagPageItem, tagDelete, tagAdd } from '@api/recruitTag'
//标签列表
let tagData = ref<ITagPageItem[]>([])
let tagPageParams = reactive<ITagPage>({
  current: 1,
  size: 10
})

onBeforeMount(() => {
  getTagPage()
})

const getTagPage = async () => {
  let res = await tagPage(tagPageParams)
  let { records, total } = res.data
  totals.value = total
  tagData.value = records
}

//删除标签
const delTag = async (id: string) => {
  ElMessageBox.confirm('是否删除标签', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(async () => {
    let res = await tagDelete(id)
    if (res.code == '200') {
      ElMessage.success('删除成功')
      getTagPage()
    } else {
      ElMessage.success(res.msg)
    }
  })
}
// 新增标签
// 订单标签
let inputVisible = ref<boolean>(false)
let inputValue = ref<string>('')
let orderTags = ref<{ id: string; name: string }[]>([])
//新建标签
const showInput = () => {
  inputVisible.value = true
}
//输入标签确认
const handleInputConfirm = async () => {
  if (
    inputValue.value.trim() !== '' &&
    !orderTags.value.some((item) => item.name == inputValue.value)
  ) {
    let { data } = await tagAdd({ name: inputValue.value })
    orderTags.value.push({
      id: data,
      name: inputValue.value
    })
    inputValue.value = ''
  }
  inputVisible.value = false
  getTagPage()
}
//分页
const totals = ref(0)
//分页-页码
const handleCurrentPageUpdate = (current: number) => {
  Object.assign(tagPageParams, {
    current
  })
  getTagPage()
}
//分页-一页显示多少条
const handlePageSizeUpdate = (size: number) => {
  Object.assign(tagPageParams, {
    size
  })
  getTagPage()
}
</script>

<style scoped>
.el-table {
  font-size: 12px;
}
</style>
