<template>
  <div style="height: 100%">
    <el-container>
      <el-main>
        <!--标签页-->
        <el-tabs type="border-card">
          <!--科目列表页-->
          <el-tab-pane label="科目列表">
            <el-card shadow="never" class="card-container" style="margin-bottom: 15px">
              <el-form :model="searchForm">
                <el-form-item label="科目名称" class="inline">
                  <el-input
                    v-model="searchForm.subjectName"
                    placeholder="请输入科目名称"
                  ></el-input>
                </el-form-item>
                <el-form-item label="科目状态" class="inline">
                  <el-select v-model="searchForm.enabled" placeholder="请选择科目状态" class="full">
                    <el-option
                      v-for="item in dicts.system_global_status"
                      :key="item.k"
                      :label="item.k"
                      :value="item.v"
                      >{{ item.k }}</el-option
                    >
                  </el-select>
                </el-form-item>
                <el-form-item class="inline">
                  <el-button type="primary">搜索</el-button>
                  <el-button>重置</el-button>
                </el-form-item>
              </el-form>
            </el-card>
            <el-card shadow="never">
              <div class="toolbar" style="margin-bottom: 15px">
                <el-button type="primary" icon="Plus">添加科目</el-button>
                <el-button type="default" icon="Printer">导出</el-button>
              </div>
              <el-table
                row-key="id"
                :data="tableData"
                width="100%"
                border
                stripe
                :header-cell-style="{ 'text-align': 'center' }"
                :cell-style="{ 'text-align': 'center' }"
                @expand-change="expandChange"
              >
                <el-table-column label="等级管理" type="expand" width="100" align="center">
                  <el-card style="margin: 15px" shadow="never">
                    <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 10px"
                      >新建等级</el-button
                    >
                    <el-table :data="gradeList" width="100%" border stripe>
                      <el-table-column type="index" label="排序" width="60" align="center" />
                      <el-table-column
                        label="等级名称"
                        prop="gradeName"
                        align="center"
                        width="200"
                      />
                      <el-table-column label="价格" prop="amount" align="center" />
                      <el-table-column label="协议" align="center">
                        <template #default="{ row }">
                          <el-link type="primary" :underline="false">查看协议</el-link>
                        </template>
                      </el-table-column>
                      <el-table-column label="启用状态" prop="enabled" align="center">
                        <template #default="{ row }">
                          <template v-for="item in dicts.system_global_status">
                            <el-tag v-if="row.enabled == item.v">{{ item.k }}</el-tag>
                          </template>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="200" align="center">
                        <template #default="{ row }">
                          <el-link
                            icon="el-icon-edit"
                            type="primary"
                            style="margin-left: 10px"
                            :underline="false"
                            >修改</el-link
                          >
                          <el-link
                            icon="el-icon-delete"
                            style="margin-left: 10px"
                            type="danger"
                            :underline="false"
                            >删除</el-link
                          >
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-card>
                </el-table-column>
                <el-table-column label="科目名称" prop="subjectName"></el-table-column>
                <el-table-column label="科目状态" prop="enabled">
                  <template #default="{ row }">
                    <template v-for="item in dicts.system_global_status">
                      <el-tag v-if="row.enabled == item.v">{{ item.k }}</el-tag>
                    </template>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150" fixed="right">
                  <template #default="scope">
                    <el-link
                      :underline="false"
                      type="primary"
                      style="margin-right: 10px"
                      icon="Edit"
                      >编辑</el-link
                    >
                    <el-link :underline="false" type="danger" icon="Delete">删除</el-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-tab-pane>
          <!--回收站列表页-->
          <el-tab-pane label="回收站">
            <el-card> 回收站 </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ComponentInternalInstance, getCurrentInstance, onBeforeMount, reactive, ref } from 'vue'
import {
  subjectPage,
  IsubjectList,
  IsubjectPage,
  gradeAll,
  IGradeData,
  subjectDelete,
  subjectExport
} from '@api/teachSubject'

//搜索
const searchForm = reactive<IsubjectList>({
  current: 1,
  size: 10,
  subjectName: '',
  enabled: ''
})
//table
let tableData = ref<IsubjectPage[]>([])
let gradeList = ref<IGradeData[]>([])

onBeforeMount(() => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    ;(proxy as any).getDicts(['system_global_status', 'system_global_gender'])
  }
  getSubjectPage()
})

//科目列表
const getSubjectPage = async () => {
  let res = await subjectPage(searchForm)
  let { records } = res.data
  tableData.value = records
}

//当前科目
const currentSubjectRow = reactive({})
//展开
const expandChange = async (row) => {
  Object.assign(currentSubjectRow, row)

  let res = await gradeAll({
    subjectId: row.id
  })
  gradeList.value = res.data
}
</script>

<style scoped lang="less">
.inline {
  margin-right: 20px;
  display: inline-flex;
  vertical-align: middle;
  width: 30%;
}

.tableNav {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .info {
    margin-right: 40px;
  }
}
</style>
