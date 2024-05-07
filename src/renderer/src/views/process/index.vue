<template>
  <el-container>
    <el-main>
      <el-card shadow="never" style="margin-bottom: 15px">
        <div class="header">
          <div class="quick-menu-item" @click="goEnroll">
            <img src="../../assets/images/idcard.png" />
            <el-text>报名</el-text>
          </div>
          <div class="quick-menu-item" @click="goRefund">
            <img src="../../assets/images/rocket.png" />
            <el-text>退费</el-text>
          </div>
          <div class="quick-menu-item" @click="goInstallment">
            <img src="../../assets/images/creditcard.png" />
            <el-text>还款</el-text>
          </div>
        </div>
      </el-card>
      <el-card shadow="never" style="margin-bottom: 15px">
        <el-form :model="searchForm">
          <el-row :gutter="15">
            <el-col :span="8">
              <el-form-item label="学员姓名">
                <el-input v-model="searchForm.selectName" placeholder="请输入学员姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号">
                <el-input v-model="searchForm.mobile" placeholder="请输入学员手机号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="渠道来源">
                <el-select v-model="searchForm.source" placeholder="请选择渠道来源">
                  <el-option
                    v-for="item in channels"
                    :key="item.id"
                    :value="item.id"
                    :label="item.channelName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="时间范围">
                <el-date-picker
                  v-model="chooseTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="截止时间"
                  format="YYYY/MM/DD "
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button class="bottom-btn" type="primary" icon="search" @click="search"
                >搜索</el-button
              >
              <el-button type="default" icon="RefreshLeft" @click="reset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card shadow="never">
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
            @selection-change="chooseStudent"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="学员姓名" prop="name"></el-table-column>
            <el-table-column label="联系方式" prop="mobile"></el-table-column>
            <el-table-column label="微信" prop="wechat"></el-table-column>
            <el-table-column label="性别" prop="gender">
              <template #default="{ row }">
                <template v-for="item in dicts.system_global_gender">
                  <el-text v-if="row.gender == item.v">{{ item.k }}</el-text>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="专业" prop="major" width="100px"></el-table-column>
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
            <el-table-column label="渠道来源" prop="channelName" />
            <el-table-column label="成交状态" prop="dealStatus" width="100">
              <template #default="{ row }">
                <template v-for="item in dicts.recruit_dealStatus">
                  <el-tag v-if="row.dealStatus == item.v">{{ item.k }}</el-tag>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="招生老师" prop="whrName"></el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-link :underline="false" type="primary" @click="orderDetail(row)"
                  >订单详情</el-link
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
  </el-container>
  <orderDialog
    v-if="orderVisible"
    v-model:orderVisible="orderVisible"
    :orderName="orderName"
    :orderId="orderId"
  ></orderDialog>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { transactPage, ITransactPage, ITransactPageItem } from '@api/recruitTransact'
import { dicts } from '@mixins/DIctsPlugin'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import orderDialog from './components/orderDialog.vue'
const router = useRouter()

//表单数据
const searchForm = reactive<ITransactPage>({
  current: 1,
  size: 10,
  selectName: '',
  mobile: '',
  source: '',
  startTime: '',
  endTime: ''
})
//table数据
let tableData = ref<ITransactPageItem[]>([])

interface channel {
  id: number
  channelName: string
}
// 渠道数据
const channels = ref<channel[]>([
  {
    id: 1,
    channelName: '渠道1'
  },
  {
    id: 2,
    channelName: '渠道2'
  }
])

const chooseTime = ref<string[]>([])
//生命周期
onBeforeMount(() => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    ;(proxy as any).getDicts([
      'system_global_gender',
      'recruit_education_background',
      'recruit_customer_level',
      'recruit_dealStatus'
    ])
  }
  // 获取列表
  getTransactPage()
})
//办理列表
const getTransactPage = async () => {
  let res = await transactPage(searchForm)
  let { records, total } = res.data
  totals.value = total
  tableData.value = records
}

//分页
const totals = ref(0)
//分页-页码
const handleCurrentPageUpdate = (current: number) => {
  Object.assign(searchForm, {
    current
  })
  getTransactPage()
}
//分页-一页显示多少条
const handlePageSizeUpdate = (size: number) => {
  Object.assign(searchForm, {
    size
  })
  getTransactPage()
}

//搜索
const search = () => {
  Object.assign(searchForm, {
    startTime: chooseTime.value[0],
    endTime: chooseTime.value[1]
  })
  getTransactPage()
}

// 重置
const reset = () => {
  Object.assign(searchForm, {
    selectName: '',
    mobile: '',
    source: '',
    startTime: '',
    endTime: ''
  })
  chooseTime.value = []
  getTransactPage()
}

// 当前选择的用户
let currentObj = reactive<Partial<ITransactPageItem>>({})
// 被选中学员数
let chooseNum = ref(0)
// 选择学员
const chooseStudent = (val: ITransactPageItem[]) => {
  chooseNum.value = val.length
  if (val.length > 1) {
    ElMessage.warning('只能选择一个学员')
  }
  let row = val[0]
  Object.assign(currentObj, row)
}

// 去报名
const goEnroll = () => {
  if (currentObj.id && chooseNum.value == 1) {
    router.push({
      path: '/process/payment',
      query: {
        id: currentObj.id
      }
    })
  } else if (chooseNum.value > 1) {
    ElMessage.warning('只能选择一个学员')
  } else {
    router.push({
      path: '/process/payment'
    })
  }
}

//去退费
const goRefund = () => {
  if (currentObj.id) {
    orderName.value = currentObj.name as string
    orderId.value = currentObj.id as string
    orderVisible.value = true
  } else {
    ElMessage.error('请选择学员')
  }
}

//还款
const goInstallment = () => {
  if (currentObj.id) {
    orderName.value = currentObj.name as string
    orderId.value = currentObj.id as string
    orderVisible.value = true
  } else {
    ElMessage.error('请选择学员')
  }
}

//订单详情
let orderVisible = ref(false)
let orderName = ref('')
let orderId = ref('')
const orderDetail = (row: ITransactPageItem) => {
  const { name, id } = row
  orderName.value = name
  orderId.value = id
  orderVisible.value = true
}
</script>

<style scoped lang="less">
.el-table {
  font-size: 12px;
}
.pagi {
  width: 98%;
  display: flex;
  justify-content: flex-end;
}
.header {
  display: flex;
  .quick-menu-item {
    margin-right: 40px;
    display: flex;
    cursor: pointer;
    flex-direction: column;
    align-items: center;
    img {
      width: 70px;
      height: 70px;
      margin-bottom: 5px;
    }
  }
}
:deep(.el-table__header .el-checkbox__inner) {
  display: none;
}
</style>
