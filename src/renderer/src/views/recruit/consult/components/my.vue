<template>
  <el-container>
    <el-main>
      <div class="toolbar">
        <el-button type="primary" icon="Plus">新建咨询</el-button>
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
                />
              </div>
              <div class="time-box-text">2024-02-25</div>
              <div class="time-box-btn">
                <el-link :underline="false" type="primary">回到今天</el-link>
              </div>
            </div>

            <div class="time-btn">
              <div class="time-btn-item">
                <el-icon><ArrowLeft /></el-icon>
              </div>

              <div class="time-btn-item">周日2.25</div>
              <div class="time-btn-item">周一2.26</div>
              <div class="time-btn-item">周二2.27</div>
              <div class="time-btn-item">周三2.28</div>
              <div class="time-btn-item">周四2.29</div>

              <div class="time-btn-item">
                <el-icon><ArrowRight /></el-icon>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card header="我的成交额" shadow="never" class="aside-card">
            <el-date-picker
              v-model="selectTime"
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
import { ref } from 'vue'
const calendarDate = ref('')
const selectTime = ref([])
</script>

<style lang="less" scoped>
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
    width: 90px;
    height: 40px;
    margin-left: 5px;
    cursor: pointer;
    font-size: 12px;
    background: #f2f5f7;
    border-radius: 4px 4px 4px 4px;
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
