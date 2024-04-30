<template>
  <el-container>
    <el-main>
      <el-card shadow="never" class="card-container">
        <el-form :model="form">
          <el-row :gutter="15">
            <el-col :span="8">
              <el-form-item label="学员姓名">
                <el-input
                  v-model="form.selectName"
                  placeholder="请输入学员姓名（汉字，拼音，缩写均可）"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学员电话">
                <el-input v-model="form.mobile" placeholder="请输入学员电话"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="起止时间">
                <el-date-picker
                  v-model="chooseTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="截止时间"
                  format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label-width="0">
                <el-button type="primary" icon="Search">搜索</el-button>
                <el-button type="default" icon="RefreshLeft">重置</el-button>
                <el-popover
                  placement="top-start"
                  :width="400"
                  trigger="click"
                  content="为了您正确使用导入功能，请先下载Excel模板。"
                >
                  <template #reference>
                    <el-button type="default" icon="Upload">导入</el-button>
                  </template>
                  <div>
                    <el-alert
                      title="为了您正确使用导入功能，请先下载Excel模板。"
                      type="info"
                      :closable="false"
                    />
                    <div style="display: flex; justify-content: space-between">
                      <el-button type="primary" icon="Download" @click="downloadModel"
                        >下载模板</el-button
                      >
                      <el-upload
                        action
                        :limit="3"
                        :show-file-list="false"
                        :http-request="upload"
                        :headers="headers"
                        style="margin-right: 5px; display: flex"
                      >
                        <el-button type="primary" icon="Upload">上传</el-button>
                      </el-upload>
                    </div>
                  </div>
                </el-popover>
                <el-button type="default" icon="Download">导出</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card shadow="never">
        <div class="toolbar">
          <el-button type="primary" icon="Plus" style="margin-right: 5px">新建咨询</el-button>
        </div>
        <div style="position: relative; height: 400px; overflow: scroll">
          <el-table
            style="position: absolute"
            row-key="id"
            :data="tableData"
            width="100%"
            border
            stripe
          >
            <el-table-column
              label="序号"
              type="index"
              width="60"
              align="center"
              fixed="left"
            ></el-table-column>
            <el-table-column label="意向度" width="150">
              <template #default="scope">
                <el-rate v-model="scope.row.purpose" disabled />
              </template>
            </el-table-column>
            <el-table-column label="学生姓名" prop="name" fixed="left"></el-table-column>
            <el-table-column label="联系电话" prop="mobile" width="100px"></el-table-column>
            <el-table-column label="微信" prop="wechat"></el-table-column>
            <el-table-column label="维护人" prop="whrName"></el-table-column>
            <el-table-column label="性别" prop="gender">
              <template #default="{ row }">
                <template v-for="item in dicts.system_global_gender">
                  <el-text v-if="row.gender == item.v">{{ item.k }}</el-text>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              label="跟进时间"
              prop="followTime"
              :formatter="rendererDateTime"
              width="150px"
            ></el-table-column>
            <el-table-column
              label="下次跟进时间"
              prop="followNextTime"
              :formatter="rendererDateTime"
              width="150px"
            ></el-table-column>
            <el-table-column label="跟进内容" prop="followContent" width="200px">
              <template #default="{ row }">
                <div class="content">
                  {{ row.followContent }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="领取人" prop="collectName"></el-table-column>
            <el-table-column
              label="领取时间"
              prop="collectTime"
              :formatter="rendererDateTime"
              width="150px"
            ></el-table-column>
            <el-table-column label="学历" prop="education" width="100px">
              <template #default="{ row }">
                <template v-for="item in dicts.recruit_education_background">
                  <el-text v-if="row.education == item.v">
                    {{ item.k }}
                  </el-text>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="重要级别" prop="level" width="100px">
              <template #default="{ row }">
                <template v-for="item in dicts.recruit_customer_level">
                  <el-text v-if="row.level == item.v">
                    {{ item.k }}
                  </el-text>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="所在区域" prop="province" width="180px">
              <template #default="{ row }">
                <template v-if="row.provinceName && row.cityName && row.countyName">
                  <el-text>{{
                    row.provinceName + '-' + row.cityName + '-' + row.countyName
                  }}</el-text>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="渠道" prop="channelName" />
            <el-table-column label="成交状态" prop="dealStatus" width="100px">
              <template #default="{ row }">
                <template v-for="item in dicts.recruit_dealStatus">
                  <el-tag v-if="row.dealStatus == item.v">{{ item.k }}</el-tag>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center" fixed="right">
              <template #default="{ row }">
                <el-link :underline="false" type="primary" icon="List">查看详情</el-link>
                <el-link :underline="false" type="success" icon="Avatar">办理报名</el-link>
                <el-link :underline="false" type="danger" icon="Edit" @click="showAdd(row.id)"
                  >跟进信息</el-link
                >
                <el-link :underline="false" type="warning" icon="Edit" @click="edit(row.id)"
                  >编辑信息</el-link
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <pagination
            :total="totals"
            @update:current-page="handleCurrentPageUpdate"
            @update:page-size="handlePageSizeUpdate"
          ></pagination>
        </div>
      </el-card>
    </el-main>
    <updataDialog
      v-if="updataVisible"
      v-model:updataVisible="updataVisible"
      :updataId="updataId"
      @change="getConsultPage"
    >
    </updataDialog>

    <followDialog
      v-if="followVisible"
      v-model:followVisible="followVisible"
      :followId="followId"
      @change="getConsultPage"
    ></followDialog>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { consultPage, IConsultPage, IConsultList, consultImport } from '@api/recruitConsult'
import { dicts } from '@mixins/DIctsPlugin'
import tool from '@utils/tool'
import { ElMessage, type TableColumnCtx } from 'element-plus'
import { useRouter } from 'vue-router'
import updataDialog from './log/updataDialog.vue'
import followDialog from './log/followDialog.vue'
const router = useRouter()
//搜索数据
const form = reactive<IConsultPage>({
  current: 1,
  size: 10,
  selectName: '',
  mobile: '',
  isSelf: false,
  startTime: '',
  endTime: ''
})
//table数据
let tableData = ref<IConsultList[]>([])
//导入文件的headers
let headers = reactive({ 'Content-Type': 'multipart/form-data' })

const chooseTime = ref<string[]>([])

onBeforeMount(() => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    ;(proxy as any).getDicts([
      'system_global_gender',
      'system_global_gender',
      'recruit_education_background',
      'recruit_customer_level',
      'recruit_dealStatus'
    ])
  }
  //客户列表
  getConsultPage()
})

//分页
const totals = ref(0)
//分页-页码
const handleCurrentPageUpdate = (current: number) => {
  Object.assign(form, {
    current
  })
  getConsultPage()
}
//分页-一页显示多少条
const handlePageSizeUpdate = (size: number) => {
  Object.assign(form, {
    size
  })
  getConsultPage()
}

//客户列表
const getConsultPage = async () => {
  let res = await consultPage(form)
  let { records, total } = res.data
  totals.value = total
  tableData.value = records
}

//时间戳转换为标准时间
const rendererDateTime = (
  row: IConsultList,
  column: TableColumnCtx<IConsultList>,
  timeValue: number
) => {
  return tool.dateFormat(timeValue)
}

//下载模版
const downloadModel = () => {
  let modelUrl = 'https://oss.xuexiluxian.cn/xiaoluxian-crm/2023-07-17/1659133900536107008.xlsx'
  if (modelUrl) {
    window.electron.ipcRenderer.invoke('renderer-to-main', {
      name: 'download-http-file',
      data: {
        url: modelUrl
      }
    })
  }
}

//导入
type UploadUserFile = {
  file: File
}
const upload = async (item: UploadUserFile) => {
  ElMessage.info('上传中...')
  let forData = new FormData()
  forData.append('file', item.file)
  let res = await consultImport(forData)
  console.log(res)
  ElMessage.success(res.msg)
  getConsultPage()
}

//新建咨询
const add = () => {
  router.push('/recruit/consult/add')
}

//编辑信息
const updataVisible = ref<boolean>(false)
const updataId = ref('')
const edit = (id: string) => {
  console.log('edit')
  updataId.value = id
  updataVisible.value = true
}

//跟进信息
const followVisible = ref<boolean>(false)
const followId = ref('')
const showAdd = (id: string) => {
  followId.value = id
  followVisible.value = true
}
</script>
<style scoped>
.card-container,
.toolbar {
  margin-bottom: 15px;
}
.el-table {
  font-size: 12px;
}
</style>
