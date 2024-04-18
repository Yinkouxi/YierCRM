<template>
  <div style="height: 100%">
    <el-container>
      <el-main>
        <!--标签页-->
        <el-tabs type="border-card">
          <!--班级列表页-->
          <el-tab-pane label="班级列表">
            <el-card shadow="never" class="card-container">
              <el-form :model="searchForm">
                <el-form-item label="班级名称" class="inline">
                  <el-input v-model="searchForm.className" placeholder="请输入班级名称"></el-input>
                </el-form-item>
                <el-form-item label="科目名称" class="inline">
                  <el-input
                    v-model="searchForm.subjectName"
                    placeholder="请输入关联课程"
                  ></el-input>
                </el-form-item>
                <el-form-item label="主讲老师" class="inline">
                  <el-input
                    v-model="searchForm.mainTeacherUsername"
                    placeholder="请输入主讲老师名称"
                  ></el-input>
                </el-form-item>
                <el-form-item label="学管老师" class="inline">
                  <el-input
                    v-model="searchForm.manageTeacherUsername"
                    placeholder="请输入学管老师名称"
                  ></el-input>
                </el-form-item>
                <el-form-item label="助教老师" class="inline">
                  <el-input
                    v-model="searchForm.assistTeacherUsername"
                    placeholder="请输入助教老师名称"
                  ></el-input>
                </el-form-item>
                <el-form-item class="inline">
                  <el-button type="primary" @click="getClassPage">搜索</el-button>
                  <el-button @click="reset">重置</el-button>
                </el-form-item>
              </el-form>
            </el-card>
            <el-card shadow="never">
              <div class="toolbar">
                <el-button type="primary" icon="Plus" v-auths="'crm:teach:class:add'"
                  >新建班级</el-button
                >
                <el-button icon="Printer" v-auths="'crm:teach:class:export'" @click="btnExport"
                  >导出</el-button
                >
              </div>
              <div style="position: relative; height: 400px; overflow: scroll">
                <el-table
                  style="position: absolute"
                  row-key="id"
                  :data="tableData"
                  width="100%"
                  border
                  stripe
                  :header-cell-style="{ 'text-align': 'center' }"
                  :cell-style="{ 'text-align': 'center' }"
                  @expand-change="expandChange"
                >
                  <el-table-column label="阶段管理" type="expand" width="100" align="center">
                    <el-card style="margin: 15px" shadow="never">
                      <el-button
                        type="primary"
                        icon="plus"
                        style="margin-bottom: 10px"
                        v-auths="'crm:teach:class:stage:add'"
                        >新建阶段</el-button
                      >
                      <el-table
                        border
                        stripe
                        :data="stageList"
                        :header-cell-style="{ 'text-align': 'center' }"
                        :cell-style="{ 'text-align': 'center' }"
                      >
                        <el-table-column type="index" label="排序" width="60" align="center" />
                        <el-table-column
                          label="阶段名称"
                          prop="stepName"
                          align="center"
                          width="200"
                        />
                        <el-table-column label="阶段描述" prop="stepDesc" align="center" />
                        <el-table-column label="操作" width="280" fixed="right">
                          <template #default="{ row }">
                            <el-link
                              icon="edit"
                              type="primary"
                              style="margin-left: 10px"
                              :underline="false"
                              v-auths="'crm:teach:class:stage:update'"
                              >修改</el-link
                            >
                            <el-link
                              icon="delete"
                              style="margin-left: 10px"
                              type="danger"
                              :underline="false"
                              v-auths="'crm:teach:class:stage:delete'"
                              >删除</el-link
                            >
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-card>
                  </el-table-column>
                  <el-table-column label="班级名称" prop="className" />
                  <el-table-column label="关联课程" prop="subjectName" />
                  <el-table-column label="学员人数" prop="fullPeople">
                    <template #default="{ row }">{{ row.applyNum }}/{{ row.fullPeople }}</template>
                  </el-table-column>
                  <el-table-column label="主讲老师" prop="mainTeacherUsername" />
                  <el-table-column label="学管老师" prop="manageTeacherUsername" />
                  <el-table-column label="助教老师" prop="assistTeacherUsername" />
                  <el-table-column label="班级状态" prop="status" width="100" align="center">
                    <template #default="{ row }">
                      <template v-for="item in dicts.crm_class_status">
                        <el-tag v-if="row.status == item.v">{{ item.k }}</el-tag>
                      </template>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="上课形式"
                    prop="teachingMethod"
                    width="150"
                    align="center"
                  >
                    <template #default="{ row }">
                      <template v-for="item in dicts.crm_teaching_method">
                        <el-tag v-if="row.teachingMethod == item.v">{{ item.k }}</el-tag>
                      </template>
                    </template>
                  </el-table-column>
                  <el-table-column label="上课时间" prop="teachingDay" width="200" />
                  <!--操作-->
                  <el-table-column label="操作" width="100" fixed="right" align="left">
                    <template #default="{ row }">
                      <div class="sys-table-main-actions">
                        <!-- <el-link v-if="row.arranged == 1" :underline="false" type="primary" icon="Edit">点名</el-link> -->
                        <el-link :underline="false" type="primary" icon="List">排课</el-link>
                        <el-link :underline="false" type="primary" icon="List">学员</el-link>
                        <el-link
                          :underline="false"
                          type="primary"
                          icon="List"
                          v-auths="'crm:teach:class:update'"
                          >编辑</el-link
                        >
                        <el-link
                          :underline="false"
                          type="danger"
                          icon="Delete"
                          v-auths="'crm:teach:class:delete'"
                          >删除</el-link
                        >
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <pagination
                :total="totals"
                @update:current-page="handleCurrentPageUpdate"
                @update:page-size="handlePageSizeUpdate"
              ></pagination>
            </el-card>
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
import { classPage, ClassRecord, classExport, classDelete } from '@api/teachClass'
import { dicts } from '@mixins/DIctsPlugin'
import { ElMessage } from 'element-plus'
import { ComponentInternalInstance, getCurrentInstance, onBeforeMount } from 'vue'
import { reactive, ref } from 'vue'

// 搜索
let searchForm = reactive({
  current: 1,
  size: 10,
  className: '',
  subjectName: '',
  mainTeacherUsername: '',
  assistTeacherUsername: '',
  manageTeacherUsername: '',
  subjectId: '',
  status: ''
})

//班级列表
let tableData = ref<ClassRecord[]>([])
//阶段管理
let stageList = ref([])

const getClassPage = async () => {
  let res = await classPage(searchForm)
  let { records, total } = res.data
  tableData.value = records
  totals.value = total
}
onBeforeMount(() => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    ;(proxy as any).getDicts(['crm_class_status', 'crm_teaching_method'])
  }

  getClassPage()
})
//展开班级列表
const expandChange = () => {}

//分页
const totals = ref(0)
//分页-页码
const handleCurrentPageUpdate = (page: number) => {
  Object.assign(searchForm, {
    current: page
  })
  getClassPage()
}
//分页-一页显示多少条
const handlePageSizeUpdate = (page: number) => {
  Object.assign(searchForm, {
    size: page
  })
  getClassPage()
}

//重置
const reset = () => {
  Object.assign(searchForm, {
    current: 1,
    size: 10,
    className: '',
    subjectName: '',
    mainTeacherUsername: '',
    assistTeacherUsername: '',
    manageTeacherUsername: ''
  })
  getClassPage()
}

//导出
const btnExport = async () => {
  let res = await classExport(searchForm)
  ElMessage.success(res.msg)
}

//上课时间
const transDay = (row, column, cellValue: string) => {
  if (!row.teachingDay) return ''
  let arr = row.teachingDay.split(',')
  arr.forEach((item, index) => {
    switch (item) {
      case '1':
        arr[index] = '星期一'
        break
      case '2':
        arr[index] = '星期二'
        break
      case '3':
        arr[index] = '星期三'
        break
      case '4':
        arr[index] = '星期四'
        break
      case '5':
        arr[index] = '星期五'
        break
      case '6':
        arr[index] = '星期六'
        break
      case '7':
        arr[index] = '星期日'
        break
      default:
        ElMessage.error('时间信息有误！')
    }
  })
  cellValue = arr.toString() + ' ' + row.teachingTime
  return cellValue
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
.card-container,
.toolbar {
  margin-bottom: 15px;
}
.el-table {
  font-size: 12px;
}
</style>
