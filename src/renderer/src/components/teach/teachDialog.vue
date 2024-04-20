<template>
  <el-input :placeholder="placeholder" clearable disabled v-model="modelValue.realName">
    <template #append>
      <el-button icon="Search" @click="btnDialog" />
    </template>
  </el-input>

  <el-dialog v-model="dialogFormVisible" title="选择人员" width="700px">
    <el-form :model="userForm">
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="用户名称" prop="name">
            <el-input v-model="userForm.username" placeholder="请输入用户名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="真实姓名" prop="contact">
            <el-input v-model="userForm.realName" placeholder="请输入真实姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="userForm.phone" placeholder="请输入手机号码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="0">
            <el-button type="primary" icon="search" @click="getUserPage">搜索</el-button>
            <el-button icon="refreshRight" @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      row-key="id"
      :data="userData"
      border
      style="margin-bottom: 10px"
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" />
      <el-table-column label="用户名称" prop="username" />
      <el-table-column label="真实姓名" prop="realName" />
      <el-table-column label="手机号" prop="phone" />
    </el-table>
    <pagination
      :total="totals"
      @update:current-page="handleCurrentPageUpdate"
      @update:page-size="handlePageSizeUpdate"
    ></pagination>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue'
import { userPage, Record, IUsersList } from '@api/systemUser'
const emit = defineEmits()
const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Object,
    default: {
      id: '',
      realName: ''
    }
  }
})
//展示dialog
const dialogFormVisible = ref(false)
const btnDialog = () => {
  dialogFormVisible.value = true
}
// //form表单数据
// const userForm = reactive({
//   username: '',
//   realName: '',
//   mobile: ''
// })
//table数据
let userData = ref<Record[]>([])
let totals = ref(0)
let userForm = reactive<IUsersList>({
  current: '1',
  size: '5',
  username: '',
  realName: '',
  phone: ''
})
const getUserPage = async () => {
  console.log(userForm, 'userPageData')
  let res = await userPage(userForm)
  let { records, total } = res.data
  totals.value = total
  userData.value = records
  console.log(res.data, 'ereeee')
}
onBeforeMount(() => {
  getUserPage()
})
//table选择到的数据
let sname = reactive<any>({})
const handleSelectionChange = (row: Record[]) => {
  sname = row.pop()
}
//分页-页码
const handleCurrentPageUpdate = (page: string) => {
  userForm.current = page
  getUserPage()
}
//分页-一页显示多少条
const handlePageSizeUpdate = (page: string) => {
  userForm.size = page
  getUserPage()
}
//确定
const confirm = () => {
  emit('update:modelValue', sname)
  props.modelValue.realName = sname.realName
  dialogFormVisible.value = false
}

// 重置
const reset = () => {
  userForm.username = ''
  userForm.realName = ''
  userForm.phone = ''
  getUserPage()
}
</script>

<style scoped>
::v-deep .el-form-item {
  margin-bottom: 18px;
}
</style>
