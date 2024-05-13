<template>
  <el-dialog
    width="1000"
    :destroy-on-close="true"
    title="学员详情"
    v-model="props.detailVisible"
    @close="close"
  >
    <div class="student">
      <div class="avatar">
        <el-image
          style="width: 100px; height: 100px"
          src="https://oss.xuexiluxian.cn/xiaoluxian-crm/2023-04-04/1.png"
        />
      </div>
      <div class="info">
        <div class="name">{{ info.name }}</div>
        <div class="mobile">{{ info.mobile }}</div>
      </div>
    </div>
    <el-tabs class="tab" v-model="activeName">
      <el-tab-pane label="报读课程" name="class">
        <el-table
          row-key="id"
          :data="classData"
          width="100%"
          border
          stripe
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column type="index" width="60" />
          <el-table-column label="班级名称" prop="className" width="100" />
          <el-table-column label="科目名称" prop="subjectName" />
          <el-table-column label="授课方式" prop="teachingMethod" width="150">
            <template #default="{ row }">
              <template v-for="item in dicts.crm_teaching_method" :key="item.v">
                <el-tag v-if="row.teachingMethod == item.v">{{ item.k }}</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="满班人数" prop="fullPeople" />
          <el-table-column label="课时" prop="classHour" />
          <el-table-column label="状态" prop="status" width="100">
            <template #default="{ row }">
              <template v-for="item in dicts.crm_class_status" :key="item.v">
                <el-tag v-if="row.status == item.v">{{ item.k }}</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="开班时间" prop="beginDate" width="170" />
          <el-table-column label="结业时间" prop="endDate" width="170" />
          <el-table-column label="是否排课" prop="arranged" width="150">
            <template #default="{ row }">
              <el-tag v-if="row.arranged == 1" type="success">已排课</el-tag>
              <el-tag v-if="row.arranged == 0" type="danger">未排课</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="上课记录" name="classRecord">
        <el-table
          :data="classRecord"
          width="100%"
          border
          stripe
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column type="index" width="60" />
          <el-table-column label="课程名称" prop="className"></el-table-column>
          <el-table-column label="日期" prop="date"></el-table-column>
          <el-table-column label="到课情况">
            <template #default="{ row }">
              <el-tag v-if="row.type == 1" type="success">到课</el-tag>
              <el-tag v-if="row.type == 2" type="danger">旷课</el-tag>
              <el-tag v-if="row.type == 3" type="warining">请假</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="协议记录" name="contractRecord" lazy>
        <el-table
          :data="signatureRecord"
          width="100%"
          border
          stripe
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column type="index" width="60" />
          <el-table-column label="姓名" prop="name" />
          <el-table-column label="身份证号" prop="idcard" />
          <el-table-column label="手机号" prop="mobile" />
          <el-table-column label="班级名称" prop="className" />
          <el-table-column label="课程名称" prop="subjectName" />
          <el-table-column label="查看签名" prop="signature">
            <template #default="{ row }">
              <el-link type="primary" :underline="false">查看</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="跟进记录" name="followRecord" lazy>
        <el-table
          row-key="id"
          :data="flowRecord"
          width="100%"
          border
          stripe
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column type="index" width="60" align="center"> </el-table-column>
          <el-table-column label="跟进方式" prop="followMethod">
            <template #default="{ row }">
              <template v-for="item in dicts.recruit_follow_method">
                <el-text v-if="row.followMethod == item.v">{{ item.k }}</el-text>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="回访时间" prop="followTime"></el-table-column>
          <el-table-column label="下次回访时间" prop="followNextTime"></el-table-column>
          <el-table-column label="顾问老师" prop="roleManName"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <el-button @click="close">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  IClassRecordGet,
  IClassRecordGetDataItem,
  IFollowPage,
  IFollowPageRecords,
  ISignatureItem,
  ISignatureRecordGet,
  classRecordGet,
  followPage,
  signatureRecordGet
} from '@api/recruitConsult'
import { IStudentGetInfo, ISuccessClassGetItem, studentGet, successClassGet } from '@api/teachClass'
import { dicts } from '@mixins/DIctsPlugin'
import { ComponentInternalInstance, getCurrentInstance, onBeforeMount, reactive, ref } from 'vue'

const props = defineProps({
  detailVisible: {
    type: Boolean,
    default: false
  },
  detailCustomerId: {
    type: String,
    default: ''
  },
  detailClassId: {
    type: String,
    default: ''
  }
})
const activeName = ref('class')
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
      'crm_teaching_method',
      'recruit_follow_method',
      'crm_class_status',
      'crm_teaching_method'
    ])
  }
  // 学员信息
  getStudentGet()
  // 课程信息
  getSuccessClassGet()
  // 上课记录
  getClassRecord()
  // 协议记录
  getSignatureRecord()
  // 跟进记录
  getFollowPage()
})

// 学员信息
let info = reactive<Partial<IStudentGetInfo>>({})
const getStudentGet = async () => {
  let res = await studentGet(props.detailCustomerId)
  Object.assign(info, res.data)
}

// 报课课程
let classData = ref<ISuccessClassGetItem[]>([])
const getSuccessClassGet = async () => {
  let { data } = await successClassGet(props.detailCustomerId)
  classData.value = data
}

// 上课记录
const classRecord = ref<IClassRecordGetDataItem[]>([])
let classRecordParams = reactive<Partial<IClassRecordGet>>({
  customerId: props.detailCustomerId,
  classId: props.detailClassId
})
const getClassRecord = async () => {
  let res = await classRecordGet(classRecordParams as IClassRecordGet)
  let { records } = res.data
  classRecord.value = records
}

// 协议记录
const signatureRecord = ref<Partial<ISignatureItem[]>>([])
let signatureRecordParams = reactive<Partial<ISignatureRecordGet>>({
  customerId: props.detailCustomerId,
  classId: props.detailClassId
})
const getSignatureRecord = async () => {
  let res = await signatureRecordGet(signatureRecordParams as ISignatureRecordGet)
  let { records } = res.data
  signatureRecord.value = records
}

// 跟进记录
const flowRecord = ref<IFollowPageRecords[]>([])
const followRecordParams = reactive<Partial<IFollowPage>>({
  customerId: props.detailCustomerId,
  page: 1,
  size: 100
})
const getFollowPage = async () => {
  let res = await followPage(followRecordParams as IFollowPage)
  let { records } = res.data
  flowRecord.value = records
}
//关闭dialog
const emit = defineEmits()
const close = () => {
  emit('update:detailVisible', false)
}
</script>

<style scoped lang="less">
.student {
  display: flex;

  .info {
    margin-top: 10px;
    display: flex;
    flex-direction: column;

    .name {
      font-size: 18px;
      font-weight: bold;
    }

    .mobile {
      margin-top: 20px;
    }

    .options {
      margin-top: 40px;
    }
  }
}

.pagi {
  margin: 15px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-tabs__nav-scroll) {
  display: flex;
  justify-content: center;
}

:deep(.el-tabs__item) {
  text-align: center;
}
</style>
