<template>
  <el-dialog
    v-model="props.memberVisible"
    title="学员列表"
    width="1100"
    @close="close"
    align-center
  >
    <el-table :data="tableData" width="100%" border stripe>
      <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
      <el-table-column prop="name" label="姓名" align="center" class="name">
        <template #default="{ row }">
          <el-text type="primary" @click="openDetail(row.id,row.classId)">{{ row.name }}</el-text>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" width="150" align="center"></el-table-column>
      <el-table-column prop="wechat" label="微信号" width="150" align="center"></el-table-column>
      <el-table-column label="性别" prop="gender" align="center" width="60px">
        <template #default="{ row }">
          <template v-for="item in dicts.system_global_gender">
            <el-text v-if="row.gender == item.v">{{ item.k }}</el-text>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="学历" prop="education" width="100px" align="center">
        <template #default="{ row }">
          <template v-for="item in dicts.recruit_education_background">
            <el-text v-if="row.education == item.v">
              {{ item.k }}
            </el-text>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        label="报名课程"
        prop="subjectName"
        width="150px"
        align="center"
      ></el-table-column>
      <el-table-column
        label="课程等级"
        prop="gradeName"
        width="150px"
        align="center"
      ></el-table-column>
      <el-table-column
        label="参与班级"
        prop="className"
        width="150px"
        align="center"
      ></el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </template>
    <!-- 分页 -->
    <pagination
      :total="totals"
      @update:current-page="handleCurrentPageUpdate"
      @update:page-size="handlePageSizeUpdate"
    ></pagination>
  </el-dialog>
  <studentDetail
    v-if="detailVisible"
    v-model="detailVisible"
    :detailCustomerId = "detailCustomerId"
    :detailClassId = "detailClassId"
  ></studentDetail>
</template>

<script lang="ts" setup>
import { ref, reactive, onBeforeMount, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { IStudentList, IStudentListItem, studentList } from '@api/teachClass'
import { dicts } from '@mixins/DIctsPlugin'
import studentDetail from './studentDetail.vue';
const props = defineProps({
  memberVisible: {
    type: Boolean,
    default: false
  },
  classId: {
    type: String,
    default: ''
  }
})
const tableData = ref<IStudentListItem[]>([])
let tableParmas = reactive<IStudentList>({
  name: '',
  mobile: '',
  classId: '',
  companyName: '',
  current: 1,
  size: 10
})

const getStudentList = async () => {
  tableParmas.classId = props.classId
  const res = await studentList(tableParmas)
  const { records, total } = res.data
  tableData.value = records
  totals.value = total
}

//生命周期
onBeforeMount(() => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    ;(proxy as any).getDicts([
      'system_global_gender',
      'recruit_education_background',
      'recruit_customer_level',
      'recruit_dealStatus',
      'crm_class_status',
      'crm_teaching_method'
    ])
  }
  getStudentList()
})

//分页
const totals = ref(0)
//分页-页码
const handleCurrentPageUpdate = (current: number) => {
  Object.assign(tableParmas, {
    current
  })
  getStudentList()
}
//分页-一页显示多少条
const handlePageSizeUpdate = (size: number) => {
  Object.assign(tableParmas, {
    size
  })
  getStudentList()
}

// 学员详情
const detailVisible = ref(false)
let detailCustomerId = ref('')
let detailClassId = ref('')
const openDetail = (customerId: string, classId: string) => {
  console.log('学员详情')
  detailVisible.value = true
  detailCustomerId.value = customerId
  detailClassId.value = classId
}

//关闭dialog
const emit = defineEmits()
const close = () => {
  emit('update:memberVisible', false)
}

//保存
const onSubmit = async () => {
  emit('change')
  close()
}
</script>

<style scoped>
.name {
  cursor: pointer;
}
</style>
