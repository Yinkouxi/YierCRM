<template>
  <el-container>
    <el-main>
      <div class="toolbar">
        <el-button type="primary" icon="Plus" @click="add">新建咨询</el-button>
        <el-button type="primary" icon="Plus">办理入学</el-button>
      </div>

      <el-row :gutter="15">
        <el-col :span="16">
          <el-card header="我的任务" shadow="never" style="height: 100%">
            <div class="time-box">
              <div class="time-box-picker">
                <el-date-picker
                  v-model="calendarDate"
                  type="date"
                  placeholder="自定义时间"
                  style="width: 200px"
                  @change="onCalendarDate"
                />
              </div>
              <div class="time-box-text">{{ currentDate.dateStr }}</div>
              <div class="time-box-btn" @click="backToday">
                <el-link :underline="false" type="primary">回到今天</el-link>
              </div>
            </div>

            <div class="time-btn">
              <div class="time-btn-item icon" @click="prevDate">
                <el-icon><ArrowLeft /></el-icon>
              </div>

              <div
                v-for="item in weekList"
                :key="item.dateStr"
                :class="
                  item.dateStr == currentDate.dateStr ? 'time-btn-item active' : 'time-btn-item'
                "
                @click="currentDay(item)"
              >
                周{{ item.week }} {{ item.month }}.{{ item.dayOfMonth }}
              </div>

              <div class="time-btn-item icon" @click="nextDate">
                <el-icon><ArrowRight /></el-icon>
              </div>
            </div>

            <div class="time-table" v-if="clientList.length > 0">
              <el-table :data="clientList" border>
                <el-table-column
                  label="序号"
                  type="index"
                  width="55"
                  align="center"
                ></el-table-column>
                <el-table-column label="姓名" prop="name" align="center"></el-table-column>
                <el-table-column label="手机号" prop="mobile" align="center"></el-table-column>
                <el-table-column label="微信" prop="wechat" align="center"></el-table-column>
                <el-table-column label="意向度" width="150" align="center">
                  <template #default="{ row }">
                    <el-rate v-model="row.purpose" disabled />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="140" fixed="right" align="center">
                  <template #default="{ row }">
                    <el-link :underline="false" icon="List" type="primary">查询详情</el-link>
                    <el-link :underline="false" icon="Avatar" type="success">办理报名</el-link>
                    <el-link :underline="false" icon="Edit" type="danger">跟进信息</el-link>
                    <el-link :underline="false" icon="Edit" type="warning">编辑信息</el-link>
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                :total="totals"
                @update:current-page="handleCurrentPageUpdate"
                @update:page-size="handlePageSizeUpdate"
              ></pagination>
            </div>
            <div class="time-table-else" v-else>
              <el-icon size="100px" color="#F2F5F7">
                <el-icon-folderDelete></el-icon-folderDelete>
              </el-icon>
              <p>今天没有任务</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card header="我的成交额" shadow="never" class="aside-card">
            <el-date-picker
              type="daterange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="截止时间"
              style="width: 100%"
            >
            </el-date-picker>
            <div class="aside-card-content">
              <div class="aside-card-content-item">
                <div class="aside-card-content-item-icon">
                  <el-icon size="40" color="#24BCFF"><Monitor /></el-icon>
                </div>
                <div style="margin-left: 5px">
                  成交人数(人)
                  <h2>2</h2>
                </div>
              </div>

              <div class="aside-card-content-item">
                <div class="aside-card-content-item-icon">
                  <el-icon size="40" color="#24BCFF"><Money /></el-icon>
                </div>
                <div style="margin-left: 5px">
                  应收成交额(元)
                  <h2>2</h2>
                </div>
              </div>

              <div class="aside-card-content-item">
                <div class="aside-card-content-item-icon">
                  <el-icon size="40" color="#24BCFF"><EditPen /></el-icon>
                </div>
                <div style="margin-left: 5px">
                  成交订单(笔)
                  <h2>2</h2>
                </div>
              </div>

              <div class="aside-card-content-item">
                <div class="aside-card-content-item-icon">
                  <el-icon size="40" color="#24BCFF"><Calendar /></el-icon>
                </div>
                <div style="margin-left: 5px">
                  订单实收(元)
                  <h2>2</h2>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue'
import { consultPage, IConsultList } from '@api/recruitConsult'
import tool from '@utils/tool'
import { useRouter } from 'vue-router'
const router = useRouter()

interface IDate {
  date: Date
  dateStr: string
  year: number
  month: number
  week: string
  dayOfWeek: number
  dayOfMonth: number
}

const currentDate = reactive<IDate>({
  date: new Date(), //日期对象
  dateStr: '', //年-月-日
  year: 0, //年
  month: 0, //月
  week: '', //星期
  dayOfWeek: 0, //之前的星期
  dayOfMonth: 0 //当前日期
})

//星期数据
const weebDays = ref([
  { index: 0, week: '日' },
  { index: 1, week: '一' },
  { index: 2, week: '二' },
  { index: 3, week: '三' },
  { index: 4, week: '四' },
  { index: 5, week: '五' },
  { index: 6, week: '六' }
])
//星期遍历数据
const weekList = ref<IDate[]>([])
//我的任务
let clientList = ref<IConsultList[]>([])
//我的任务时间
let calendarDate = ref('')
//修改我的任务时间
const onCalendarDate = (options: Date) => {
  changeDate(options)
}

onBeforeMount(() => {
  changeDate()
})

//客户列表分页
const totals = ref(0)
//分页-页码
const handleCurrentPageUpdate = (page: number) => {
  currentForm.page = page
  getConsultPage()
}
//分页-一页显示多少条
const handlePageSizeUpdate = (size: number) => {
  currentForm.size = size
  getConsultPage()
}
//客户列表
let currentForm = reactive({
  page: 1,
  size: 5,
  isSelf: true,
  startTime: '',
  endTime: ''
})
const getConsultPage = async () => {
  let res = await consultPage(currentForm)
  let { records, total } = res.data
  totals.value = total
  clientList.value = records
}
//时间修改
const changeDate = (date = new Date()) => {
  const dateStr = tool.dateFormat(date, 'yyyy-MM-dd')

  Object.assign(currentDate, {
    date: date,
    dateStr,
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    dayOfWeek: date.getDay(),
    dayOfMonth: date.getDate()
  })

  //客户列表时间赋值
  currentForm.startTime = dateStr + ' 00:00:00'
  currentForm.endTime = dateStr + ' 23:59:59'
  //客户列表
  getConsultPage()

  //清空数组
  weekList.value = []

  weebDays.value.forEach((item) => {
    const diffDay = currentDate.dayOfWeek - item.index

    const targetDate = new Date()
    targetDate.setFullYear(currentDate.year)
    targetDate.setMonth(currentDate.month - 1)
    targetDate.setDate(currentDate.date.getDate() - diffDay)

    const targetDateStr = tool.dateFormat(targetDate, 'yyyy-MM-dd')

    const dates: IDate = {
      date: targetDate,
      dateStr: targetDateStr,
      year: targetDate.getFullYear(),
      month: targetDate.getMonth() + 1,
      week: item.week,
      dayOfWeek: targetDate.getDay(),
      dayOfMonth: targetDate.getDate()
    }
    weekList.value.push(dates)
  })
}

//选择日期
const currentDay = (item: IDate) => {
  if (item) {
    //客户列表时间赋值
    currentForm.startTime = item.dateStr + ' 00:00:00'
    currentForm.endTime = item.dateStr + ' 23:59:59'
    getConsultPage()

    Object.assign(currentDate, item)
  }
}
//回到今天
const backToday = () => {
  changeDate()
}
//切换上周
const prevDate = () => {
  const prevWeekDate = new Date()
  prevWeekDate.setFullYear(currentDate.year)
  prevWeekDate.setMonth(currentDate.month - 1)
  prevWeekDate.setDate(currentDate.dayOfMonth - 7)
  changeDate(prevWeekDate)
}
//切换下周
const nextDate = () => {
  const nextWeekDate = new Date()
  nextWeekDate.setFullYear(currentDate.year)
  nextWeekDate.setMonth(currentDate.month - 1)
  nextWeekDate.setDate(currentDate.dayOfMonth + 7)
  changeDate(nextWeekDate)
}
//新建咨询
const add = () => {
  router.push('/recruit/consult/add')
}
</script>

<style scoped lang="less">
.toolbar {
  margin-bottom: 15px;
}
.time-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    flex: 1;
  }
  .time-box-text {
    font-size: 18px;
    font-weight: 700;
    color: #72767b;
    text-align: center;
  }
  .time-box-btn {
    text-align: right;
  }
}
.time-btn {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  .time-btn-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 40px;
    margin-left: 5px;
    padding: 0 3px;
    cursor: pointer;
    font-size: 12px;
    background: #f2f5f7;
    border-radius: 4px 4px 4px 4px;
    &.active {
      background-color: #409eff;
      color: #fff;
    }
    &.icon {
      width: 60px;
    }
  }
}
.time-table {
  margin-top: 20px;
}
.time-table-else {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
  p {
    font-size: 16px;
    color: rgb(168, 180, 181);
  }
}
.aside-card-content {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .aside-card-content-item {
    display: flex;
    width: 50%;
    height: 50px;
    margin-top: 10px;
    font-size: 12px;
    .aside-card-content-item-icon {
      width: 40px;
      height: 40px;
    }
  }
}
</style>
