<template>
  <el-dialog v-model="props.updataVisible" title="修改客户信息" width="800" @close="close">
    <el-form :model="form" ref="client" label-width="100px">
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入手机号" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="微信" prop="wechat">
            <el-input v-model="form.wechat" placeholder="请输入微信"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input-number v-model="form.age" :min="18" :max="80" placeholder="请输入年龄" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="渠道" prop="source">
            <el-select v-model="form.source" placeholder="请选择渠道" style="width: 100%">
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :value="item.id == form.source ? form.source : item.id"
                :label="item.channelName"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="意向度" prop="purpose">
            <el-rate v-model="form.purpose" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户级别" prop="">
            <el-select v-model="form.level" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in dicts.recruit_customer_level"
                :key="item.k"
                :label="item.k"
                :value="item.v"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="意向课程" prop="purposeCourseIds">
            <el-select
              v-model="form.purposeCourseIds"
              placeholder="请选择"
              multiple
              style="width: 100%"
            >
              <el-option
                v-for="item in subjectList"
                :key="item.id"
                :label="item.subjectName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="意向班级" prop="purposeClassIds">
            <el-select
              v-model="form.purposeClassIds"
              placeholder="请选择"
              multiple
              style="width: 100%"
            >
              <el-option
                v-for="item in classList"
                :key="item.id"
                :label="item.className"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="form.gender">
              <el-radio v-for="item in dicts.system_global_gender" :value="item.v">{{
                item.k
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学历" prop="education">
            <el-select v-model="form.education" placeholder="请选择学员学历" style="width: 100%">
              <el-option
                v-for="item in dicts.recruit_education_background"
                :key="item.k"
                :label="item.k"
                :value="item.v"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所在地区">
            <citySelect
              @Location="Location"
              v-if="form.id"
              :province="form.province"
              :city="form.city"
              :county="form.county"
            ></citySelect>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入备注"
              maxlength="200"
              rows="5"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, getCurrentInstance, ComponentInternalInstance } from 'vue'
import citySelect from '@components/city/citySelect.vue'
import { consultDetail, IConsultUpdate, consultUpdate } from '@api/recruitConsult'
import { channelPage, IChannelData } from '@api/mediaChannel'
import { subjectPage, IsubjectPage } from '@api/teachSubject'
import { classPage, ClassRecord } from '@api/teachClass'
import { ILocation } from '@interface/location'
import { ElMessage } from 'element-plus'
import { dicts } from '@mixins/DIctsPlugin'
const props = defineProps({
  updataVisible: {
    type: Boolean,
    default: false
  },
  updataId: {
    type: String,
    default: ''
  }
})
//表单数据
const form = reactive<IConsultUpdate>({
  id: '',
  name: '',
  mobile: '',
  wechat: '',
  source: '',
  purpose: '',
  purposeCourseIds: '',
  purposeClassIds: '',
  level: '',
  gender: '',
  education: '',
  province: '',
  city: '',
  county: '',
  age: 0,
  school: '',
  major: '',
  remark: ''
})

//生命周期
onBeforeMount(async () => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    ;(proxy as any).getDicts([
      'recruit_customer_level',
      'system_global_gender',
      'recruit_education_background'
    ])
  }
  //详情数据
  let { data } = await consultDetail(props.updataId)
  data.purposeCourseIds = (data.purposeCourseIds as string).split(',')
  data.purposeClassIds = (data.purposeClassIds as string).split(',')
  Object.assign(form, data)

  //渠道列表
  getChannelPage()
  //意向课程
  getSubjectPage()
  //意向班级
  getClassPage()
})

//渠道列表
let channelList = ref<IChannelData[]>([])
const getChannelPage = async () => {
  let res = await channelPage()
  let { records } = res.data
  channelList.value = records
}
//意向课程
let subjectList = ref<IsubjectPage[]>([])
const getSubjectPage = async () => {
  let res = await subjectPage({
    current: 1,
    size: 10
  })
  let { records } = res.data
  subjectList.value = records
}
//意向班级
let classList = ref<ClassRecord[]>([])
const getClassPage = async () => {
  let res = await classPage({
    current: 1,
    size: 10
  })
  let { records } = res.data
  classList.value = records
}

//所在城市
const Location = (data: ILocation) => {
  let { province, city, county } = data
  form.province = province
  form.city = city
  form.county = county
}

//关闭dialog
const emit = defineEmits()
const close = () => {
  emit('update:updataVisible', false)
}

//保存
const onSubmit = async () => {
  form.purposeCourseIds = (form.purposeCourseIds as string[]).join(',')
  form.purposeClassIds = (form.purposeClassIds as string[]).join(',')

  let res = await consultUpdate(form)
  if (res.code == '200') {
    ElMessage.success(res.msg)
  }
  emit('change')
  close()
}
</script>

<style scoped>
.inline {
  display: inline-flex;
  vertical-align: middle;
  width: 50%;
}
</style>
