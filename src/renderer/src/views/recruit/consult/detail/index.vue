<template>
  <el-container>
    <el-main>
      <el-card shadow="never" class="card-container">
        <div class="info">
          <div class="img">
            <el-image
              style="width: 150px; height: 150px"
              src="https://oss.xuexiluxian.cn/xiaoluxian-crm/2023-04-04/2.png"
            ></el-image>
          </div>
          <div class="info-content">
            <el-form :model="info" label-width="100px">
              <el-form-item label="姓名" class="in-line">
                <el-text>{{ info.name }}</el-text>
              </el-form-item>

              <el-form-item label="性别" class="in-line">
                <template v-for="item in dicts.system_global_gender">
                  <el-text v-if="info.gender == item.v">{{ item.k }}</el-text>
                </template>
              </el-form-item>

              <el-form-item label="手机" class="in-line">
                <el-text>{{ info.mobile }}</el-text>
              </el-form-item>

              <el-form-item label="微信" class="in-line">
                <el-text>{{ info.wechat }}</el-text>
              </el-form-item>

              <el-form-item label="地区" class="in-line">
                <el-text>
                  <template v-if="info.provinceName && info.cityName && info.countyName">
                    {{ info.provinceName + '/' + info.cityName + '/' + info.countyName }}
                  </template>
                  <template v-else>未知</template>
                </el-text>
              </el-form-item>

              <el-form-item label="成交状态" class="in-line">
                <template v-for="item in dicts.recruit_dealStatus">
                  <el-text v-if="info.dealStatus?.toString() == item.v">{{ item.k }}</el-text>
                </template>
              </el-form-item>

              <el-form-item label="意向课程" class="in-line">
                <el-tag v-for="item in info.subjects" :key="item.id">{{ item.subjectName }}</el-tag>
              </el-form-item>

              <el-form-item label="意向班级" class="in-line">
                <el-tag v-for="item in info.classes" :key="item.id">{{ item.className }}</el-tag>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>

      <el-tabs type="border-card" style="margin-top: 20px">
        <el-tab-pane label="沟通互动">
          <follow></follow>
        </el-tab-pane>
        <!-- <el-tab-pane label="订单">订单</el-tab-pane> -->
        <el-tab-pane label="课程">课程</el-tab-pane>
        <!-- <el-tab-pane label="课程表">课程表</el-tab-pane> -->
        <!-- <el-tab-pane label="上课记录">上课记录</el-tab-pane> -->
        <!-- <el-tab-pane label="成绩">成绩</el-tab-pane> -->
        <!-- <el-tab-pane label="文件夹">文件夹</el-tab-pane> -->
        <!-- <el-tab-pane label="操作日志">操作日志</el-tab-pane> -->
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, getCurrentInstance, ComponentInternalInstance, provide } from 'vue'
import { consultDetail, IConsultDetail } from '@api/recruitConsult'
import { useRoute } from 'vue-router'
import { dicts } from '@mixins/DIctsPlugin'
import follow from './components/follow.vue'
//路由传值
const route = useRoute()
const id = route.query.id as string
//依赖注入
provide('id',id);
//用户详情
let info = reactive<Partial<IConsultDetail>>({})

onBeforeMount(() => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    ;(proxy as any).getDicts(['system_global_gender', 'recruit_dealStatus'])
  }
  //客户详情
  getConsultDetail()
})

//获取客户详情
const getConsultDetail = async () => {
  let { data } = await consultDetail(id)
  data.purposeCourseIds = (data.purposeCourseIds as string).split(',')
  data.purposeClassIds = (data.purposeClassIds as string).split(',')
  Object.assign(info, data)
}
</script>

<style scoped>
.info {
  display: flex;
}
.info-content {
  flex: 1;
}
.in-line {
  margin-right: 20px;
  display: inline-flex;
  vertical-align: middle;
  width: 35%;
}
</style>
