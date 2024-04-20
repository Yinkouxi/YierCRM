<template>
  <el-dialog
    v-model="classVisible"
    :title="classUpdateId != '' ? '修改班级' : '新增班级'"
    width="650"
    @close="close"
    align-center
  >
    <el-form :model="form" label-width="100">
      <el-form-item label="班级名称">
        <el-input v-model="form.className" placeholder="请输入班级名称"></el-input>
      </el-form-item>

      <el-form-item label="授课模式">
        <el-radio-group v-model="form.teachingMethod">
          <el-radio v-for="item in dicts.crm_teaching_method" :key="item.id" :value="item.v">{{
            item.k
          }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="选择科目">
        <el-select v-model="form.subjectId" placeholder="请选择科目">
          <el-option
            v-for="item in subjectData"
            :key="item.id"
            :label="item.subjectName"
            :value="item.id"
            >{{ item.subjectName }}</el-option
          >
        </el-select>
      </el-form-item>

      <el-form-item label="满班人数">
        <el-input v-model="form.fullPeople" placeholder="请输入班级人数"></el-input>
      </el-form-item>

      <el-form-item label="课时">
        <el-input v-model="form.classHour" placeholder="请输入总课时"></el-input>
      </el-form-item>

      <el-form-item label="开班时间">
        <el-date-picker
          v-model="chooseDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开班时间"
          end-placeholder="结业时间"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD HH:mm:ss"
          :disabled-date="disabledDate"
          @change="studyTime"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="主讲老师">
        <teachDialog placeholder="请选择主讲老师" v-model="mainTeacher"></teachDialog>
      </el-form-item>

      <el-form-item label="助教老师">
        <teachDialog placeholder="请选择助教老师" v-model="assistTeacher"></teachDialog>
      </el-form-item>

      <el-form-item label="学管老师">
        <teachDialog placeholder="请选择学管老师" v-model="manageTeacher"></teachDialog>
      </el-form-item>

      <el-form-item label="授课课时">
        <el-checkbox-group v-model="form.teachingDay" size="small">
          <el-checkbox-button v-for="item in days" :key="item.key" :value="item.label">
            {{ item.key }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="选择时间段">
        <el-time-select
          v-model="startTime"
          start="19:00"
          step="00:10"
          end="23:59"
          placeholder="选择开始时间"
          class="inline"
        />

        <span style="margin: 0 10px">至</span>

        <el-time-select
          v-model="endTime"
          start="22:00"
          step="00:10"
          end="23:59"
          placeholder="选择结束时间"
          class="inline"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onBeforeMount, getCurrentInstance, ComponentInternalInstance } from 'vue'
import teachDialog from '@components/teach/teachDialog.vue'
import { subjectPage, IsubjectPage } from '@api/teachSubject'
import { classAdd, classGet, classUpdate } from '@api/teachClass'

const props = defineProps({
  classVisible: {
    type: Boolean,
    default: false
  },
  classUpdateId: {
    type: String,
    default: ''
  }
})
const classVisible = ref(props.classVisible)
const classUpdateId = ref(props.classUpdateId)
//form表单数据
let form = reactive<{
  className: string
  teachingMethod: string
  subjectId: string
  fullPeople: string
  classHour: string
  beginDate: string
  endDate: string
  teachingDay: string | string[]
  teachingTime: string
}>({
  className: '', //班级名称
  teachingMethod: '', //授课方式（字典）
  subjectId: '', //科目ID
  fullPeople: '', //满班人数
  classHour: '', //课时
  beginDate: '', //开班时间
  endDate: '', //结业时间
  teachingDay: [], //授课时间
  teachingTime: '' //授课时间（20:00-22:00）
})

//科目列表
let subjectData = ref<IsubjectPage[]>([])
//科目列表
const getSubjectPage = async () => {
  let res = await subjectPage({
    current: 1,
    size: 100
  })
  let { records } = res.data
  subjectData.value = records
}
//开班时间 &  结业时间
let chooseDate = ref<string[]>([])
//禁用的时间
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now()
}
//选择开班时间
const studyTime = () => {
  form.beginDate = chooseDate.value[0]
  form.endDate = chooseDate.value[1]
}
//授课时间
const days = reactive([
  { label: '1', key: '星期一' },
  { label: '2', key: '星期二' },
  { label: '3', key: '星期三' },
  { label: '4', key: '星期四' },
  { label: '5', key: '星期五' },
  { label: '6', key: '星期六' },
  { label: '7', key: '星期日' }
])
//选择时间段
let startTime = ref('')
let endTime = ref('')
//老师列表 : 讲师
let mainTeacher = ref({
  id: '',
  realName: ''
})
//老师列表 : 助教
let assistTeacher = ref({
  id: '',
  realName: ''
})
//老师列表 : 学管
let manageTeacher = ref({
  id: '',
  realName: ''
})
//生命周期
onBeforeMount(() => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    ;(proxy as any).getDicts(['crm_teaching_method'])
  }
  getSubjectPage()

  //编辑获取详情
  if (classUpdateId.value != '') {
    setData(classUpdateId.value)
  }
})
//编辑 获取详情数据
const setData = async (id: string) => {
  if (id) {
    let { data } = await classGet(id)

    chooseDate.value = [data.beginDate, data.endDate]
    //主讲老师
    mainTeacher.value = {
      id: data.mainTeacherId,
      realName: data.mainTeacherUsername
    }
    //助教老师
    assistTeacher.value = {
      id: data.assistTeacherId,
      realName: data.assistTeacherUsername
    }
    //学管老师
    manageTeacher.value = {
      id: data.manageTeacherId,
      realName: data.manageTeacherUsername
    }
    //授课课时
    if (data.teachingDay) {
      data.teachingDay = data.teachingDay.split(',')
    }
    if (data.teachingTime) {
      startTime.value = data.teachingTime.split('-')[0]
      endTime.value = data.teachingTime.split('-')[1]
    }
    Object.assign(form, data)
  }
}
//关闭dialog
const emit = defineEmits()
const close = () => {
  emit('update:classVisible', false)
}

const addClass = () => {
  let sort = (form.teachingDay as string[]).sort()
  form.teachingDay = sort.join(',')
  form.teachingTime = startTime.value + '-' + endTime.value
  let data = Object.assign(form, {
    mainTeacherId: mainTeacher.value.id,
    assistTeacherId: assistTeacher.value.id,
    manageTeacherId: manageTeacher.value.id
  })
  return classAdd(data)
}
const updateClass = () => {
  let sort = (form.teachingDay as string[]).sort()
  form.teachingDay = sort.join(',')
  form.teachingTime = startTime.value + '-' + endTime.value
  let data = Object.assign(form, {
    mainTeacherId: mainTeacher.value.id,
    assistTeacherId: assistTeacher.value.id,
    manageTeacherId: manageTeacher.value.id
  })
  return classUpdate(data)
}
//保存
const onSubmit = async () => {
  if (classUpdateId.value != '') {
    await updateClass()
  } else {
    console.log(form)
    await addClass()
  }
  emit('change')
  close()
}
</script>

<style>
.update-time {
  text-align: center;
  font-size: 12px;
  line-height: 30px;
}
.protocol {
  overflow: scroll;
}
.protocol img {
  font-size: 14px;
  line-height: 20px;
  max-width: 100% !important;
}
</style>

<style scoped>
.inline {
  vertical-align: middle;
  width: 40%;
}
</style>
