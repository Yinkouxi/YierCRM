<template>
  <el-container style="padding: 1rem">
    <el-row style="width: 100%" :gutter="10">
      <!--基本信息--->
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>基本信息</span>
          </template>
          <el-form :model="customer" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="学员姓名" prop="name">
                  <el-input v-model="customer.name" placeholder="学员姓名"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="联系电话" prop="mobile">
                  <el-input v-model="customer.mobile" placeholder="联系电话"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="学员微信" prop="wechat">
                  <el-input v-model="customer.wechat" placeholder="学员微信"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="学员性别" prop="gender">
                  <el-radio-group v-model="customer.gender">
                    <el-radio
                      v-for="item in dicts.system_global_gender"
                      :key="item.v"
                      :value="item.v"
                      size="small"
                      >{{ item.k }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="学员年龄" prop="age">
                  <el-input-number
                    v-model="customer.age"
                    :min="18"
                    :max="80"
                    placeholder="学员年龄"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="渠道来源" prop="source">
                  <el-select v-model="customer.source" placeholder="请选择">
                    <el-option
                      v-for="item in channelList"
                      :key="item.id"
                      :label="item.channelName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="意向度" prop="purpose">
                  <el-rate v-model="customer.purpose"></el-rate>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="意向课程" prop="purposeCourseIds">
                  <el-select v-model="customer.purposeCourseIds" placeholder="意向课程">
                    <el-option
                      v-for="item in subjectList"
                      :key="item.id"
                      :label="item.subjectName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="意向班级" prop="purposeClassIds">
                  <el-select v-model="customer.purposeClassIds" placeholder="意向班级">
                    <el-option
                      v-for="item in classList"
                      :key="item.id"
                      :label="item.className"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="客户级别" prop="level">
                  <el-select v-model="customer.level" placeholder="客户级别">
                    <el-option
                      v-for="item in dicts.recruit_customer_level"
                      :key="item.k"
                      :label="item.k"
                      :value="item.v"
                    >
                      {{ item.k }}
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="学校" prop="school">
                  <el-input v-model="customer.school" placeholder="学校"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="专业" prop="major">
                  <el-input v-model="customer.major" placeholder="专业"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="学员学历" prop="education">
                  <el-select v-model="customer.education" placeholder="学员学历">
                    <el-option
                      v-for="item in dicts.recruit_education_background"
                      :key="item.k"
                      :label="item.k"
                      :value="item.v"
                    >
                      {{ item.k }}
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="所在城市">
                  <citySelect @Location="Location"></citySelect>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="备注">
                  <el-input
                    v-model="customer.remark"
                    type="textarea"
                    maxlength="200"
                    show-word-limit
                    placeholder="请输入备注信息"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>

      <!--跟进信息--->
      <el-col>
        <el-card>
          <template #header>
            <span>跟进信息</span>
          </template>
          <el-form :model="follow" label-width="100px">
            <div style="margin-bottom: 20px">
              <el-alert
                title="回访日期为当次跟进时间，下次跟进时间会根据公有池设置的跟进天数自动计算，在规定天数内未打跟进则自动掉入公有池。"
                type="info"
                show-icon
              ></el-alert>
            </div>
            <el-row>
              <el-col :span="8">
                <el-form-item label="跟进方式" prop="followMethod">
                  <el-select v-model="follow.followMethod" placeholder="跟进方式">
                    <el-option
                      v-for="item in dicts.recruit_follow_method"
                      :key="item.k"
                      :label="item.k"
                      :value="item.v"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="回访日期" prop="followTime">
                  <el-date-picker
                    v-model="follow.followTime"
                    placeholder="回访日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="下次回访日期" prop="followNextTime">
                  <el-date-picker
                    v-model="follow.followNextTime"
                    type="datetime"
                    placeholder="下次回访日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="沟通内容" prop="followContent">
                  <el-input
                    v-model="follow.followContent"
                    type="textarea"
                    maxlength="200"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="上传附件">
                  <el-upload
                    v-model:file-list="fileList"
                    class="upload-demo"
                    multiple
                    :http-request="upload"
                  >
                    <el-button type="primary">上传附件</el-button>
                    <template #tip>
                      <div class="el-upload__tip">
                        可上传图片和音频，支持格式：jpg、jpeg、png、mp3、mp4
                      </div>
                    </template>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>

      <!--经办人-->
      <el-col>
        <el-card>
          <template #header>
            <span>经办人</span>
          </template>
          <el-form>
            <el-row>
              <el-col :span="8">
                <el-form-item label="录入时间" label-width="100px">
                  <el-date-picker
                    v-model="dates"
                    type="date"
                    formater="YYYY-MM-DD HH:mm:ss"
                    disabled
                  ></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="顾问老师" label-width="100px">
                  <el-input disabled :placeholder="userStore.userInfo.realName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </el-container>
</template>

<script setup lang="ts" name="新建咨询">
import { ref, reactive, onBeforeMount, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { channelPage, IChannelData } from '@api/mediaChannel'
import { subjectPage, IsubjectPage } from '@api/teachSubject'
import { classPage, ClassRecord } from '@api/teachClass'
import citySelect from '@components/city/citySelect.vue'
import { ILocation } from '@interface/location'
import { dicts } from '@mixins/DIctsPlugin'
import { UploadUserFile } from 'element-plus'
// import useDicts from '@mixins/DIctsPlugin'

//基本信息
const customer = reactive({
  name: '',
  mobile: '',
  wechat: '',
  source: '',
  purpose: '',
  purposeCourseIds: '',
  purposeClassIds: '',
  level: '',
  dealStatus: '',
  dealTime: '',
  gender: '1',
  education: '',
  province: '',
  city: '',
  county: '',
  age: 0,
  school: '',
  major: '',
  remark: ''
})

//跟进信息
const follow = reactive({
  followMethod: '',
  followTime: '',
  followNextTime: '', //下次回访的日期
  followContent: ''
})

//上传
const fileList = ref<UploadUserFile[]>([])
const upload = (options: UploadUserFile) => {
  console.log(options)
}

//录入时间
const dates = new Date()
//顾问老师
import { useUserStore } from '@store/useUserStore'
const userStore = useUserStore()

onBeforeMount(() => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance

  if (proxy) {
    ;(proxy as any).getDicts([
      'system_global_gender',
      'recruit_customer_level',
      'recruit_education_background',
      'recruit_follow_method'
    ])
  }
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
const Location = (data: ILocation) => {}
</script>

<style scoped>
.el-col .el-card {
  margin-bottom: 15px;
}
:v-deep(.el-alert__title) {
  font-size: 12px;
}
</style>
