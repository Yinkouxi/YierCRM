<template>
  <el-dialog v-model="props.classVisible" title="选择班级" width="1000" @close="close">
    <div>
      <el-input
        v-model="searchForm.className"
        placeholder="输入班级名称"
        style="width: 300px"
      ></el-input>
      <el-button type="primary" style="margin-left: 15px" @click="searchClass">搜索</el-button>
    </div>

    <el-table :data="tableData" border style="margin-top: 15px">
      <el-table-column width="50">
        <template #default="{ row }">
          <template v-if="row.status != 2">
            <el-radio v-model="radio" :value="row.id"></el-radio>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="班级名称" prop="className"></el-table-column>
      <el-table-column label="科目名称" prop="subjectName"></el-table-column>
      <el-table-column label="人数" prop="subjectName"></el-table-column>
      <el-table-column label="讲师" prop="mainTeacherUsername"></el-table-column>
      <el-table-column label="班级状态">
        <template #default="{ row }">
          <template v-for="item in dicts.crm_class_status" :key="item.v">
            <el-tag v-if="row.status == item.v">{{ item.k }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="开班时间" prop="beginDate"></el-table-column>
      <el-table-column label="上课时间" :formatter="transDay"></el-table-column>
    </el-table>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </span>
    </template>
    <pagination
      :total="totals"
      @update:current-page="handleCurrentPageUpdate"
      @update:page-size="handlePageSizeUpdate"
    ></pagination>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { classPage, IClassPage, ClassRecord } from '@api/teachClass'
import type { TableColumnCtx } from 'element-plus'
import { dicts } from '@mixins/DIctsPlugin'
const props = defineProps({
  classVisible: {
    type: Boolean,
    default: false
  }
})

//搜索数据
const searchForm = reactive<IClassPage>({
  current: 1,
  size: 10,
  className: '' //班级名称
})
//table数据
let tableData = ref<ClassRecord[]>([])
//选择班级
let radio = ref('')

onBeforeMount(async () => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    ;(proxy as any).getDicts([
      'crm_class_status',
      'system_global_gender',
      'recruit_charge_type',
      'installment_count'
    ])
  }
  //班级列表
  getClassPage()
})

//获取班级列表
const getClassPage = async () => {
  let res = await classPage(searchForm)
  let { records,total } = res.data
  totals.value = total
  tableData.value = records
}
//上课时间
const transDay = (row: ClassRecord, column: TableColumnCtx<ClassRecord>) => {
  if (!row.teachingDay) return
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
    }
  })
  return arr.toString() + row.teachingTime
}

//分页
const totals = ref(0)
//分页-页码
const handleCurrentPageUpdate = (current: number) => {
  Object.assign(searchForm, {
    current
  })
  getClassPage()
}
//分页-一页显示多少条
const handlePageSizeUpdate = (size: number) => {
  Object.assign(searchForm, {
    size
  })
  getClassPage()
}

// 搜索
const searchClass = () => {
  getClassPage()
}

//关闭dialog
const emit = defineEmits()
const close = () => {
  emit('update:classVisible', false)
}

//保存
const onSubmit = async () => {
  emit('chooseClass', radio.value)
  close()
}
</script>
