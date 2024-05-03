<template>
  <el-container>
    <el-main>
      <el-card shadow="never" class="card-container">
        <el-form :model="publicForm" label-width="100px">
          <el-row :gutter="15">
            <el-col :span="8">
              <el-form-item label="学员姓名">
                <el-input
                  v-model="publicForm.selectName"
                  placeholder="请输入学员姓名（汉字，拼音，缩写均可）"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学员电话">
                <el-input v-model="publicForm.mobile" placeholder="请输入学员电话" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="0">
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="default" icon="RefreshLeft" @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card shadow="never" style="margin-top: 20px">
        <div class="toolbar">
          <el-button type="warning" @click="batchStudent" :disabled="ids.length <= 0">批量领取</el-button>
        </div>
        <div style="position: relative; height: 400px; overflow: scroll">
          <el-table
            style="position: absolute"
            row-key="id"
            :data="publicData"
            width="100%"
            border
            stripe
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="学生姓名" prop="name" align="center" />
            <el-table-column label="意向度" prop="purpose" align="center" width="170px">
              <template #default="{ row }">
                <el-rate v-model="row.purpose" :disabled="true" size="large" />
              </template>
            </el-table-column>
            <el-table-column label="联系电话" prop="mobile" align="center" width="150px" />
            <el-table-column label="微信" prop="wechat" align="center" width="150px" />
            <el-table-column label="渠道" prop="channelName" align="center" width="130px" />
            <el-table-column label="学历" prop="education" width="100px" align="center">
              <template #default="{ row }">
                <template v-for="item in dicts.recruit_education_background">
                  <el-text v-if="row.education == item.v">
                    {{ item.k }}
                  </el-text>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="重要级别" prop="level">
              <template #default="{ row }">
                <template v-for="item in dicts.recruit_customer_level">
                  <el-text v-if="row.level == item.v">
                    {{ item.k }}
                  </el-text>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="所在区域" prop="province" align="center" width="200px">
              <template #default="{ row }">
                <template v-if="row.provinceName && row.cityName && row.countyName">
                  <el-text>{{
                    row.provinceName + '-' + row.cityName + '-' + row.countyName
                  }}</el-text>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="成交状态" prop="dealStatus" align="center" width="100px">
              <template #default="{ row }">
                <template v-for="item in dicts.recruit_dealStatus">
                  <el-tag v-if="row.dealStatus == item.v">{{ item.k }}</el-tag>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="130" fixed="right" align="center">
              <template #default="{ row }">
                <el-link icon="Tickets" type="primary" :underline="false" @click="detail(row.id)"
                  >查看详情</el-link
                >
                <el-link
                  icon="Pointer"
                  type="primary"
                  :underline="false"
                  @click="takeStudent(row.id)"
                  >领取客户</el-link
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
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, getCurrentInstance, ComponentInternalInstance } from 'vue'
import {
  poolPage,
  IPoolPage,
  IPoolPageRecords,
  poolReceive,
  poolReceiveBatch
} from '@api/recruitPublic'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { dicts } from '@mixins/DIctsPlugin'
const router = useRouter()
//form表单
const publicForm = reactive<IPoolPage>({
  current: 1,
  size: 10,
  selectName: '',
  mobile: ''
})
//table数据
let publicData = ref<IPoolPageRecords[]>([])

onBeforeMount(() => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    ;(proxy as any).getDicts([
      'recruit_education_background',
      'recruit_customer_level',
      'recruit_dealStatus'
    ])
  }
  //共有池数据列表
  getPoolPage()
})
//获取共有池数据列表
const getPoolPage = async () => {
  let res = await poolPage(publicForm)
  let { records, total } = res.data
  totals.value = total
  publicData.value = records
}

//分页
const totals = ref(0)
//分页-页码
const handleCurrentPageUpdate = (current: number) => {
  Object.assign(publicForm, {
    current
  })
  getPoolPage()
}
//分页-一页显示多少条
const handlePageSizeUpdate = (size: number) => {
  Object.assign(publicForm, {
    size
  })
  getPoolPage()
}
//查看详情
const detail = (id: string) => {
  router.push({
    path: '/recruit/consult/detail',
    query: {
      id
    }
  })
}
//领取客户
const takeStudent = (id: string) => {
  ElMessageBox.confirm('是否领取', '领取客户', {
    confirmButtonText: '确定领取',
    cancelButtonText: '取消'
  }).then(async () => {
    let res = await poolReceive(id)
    if (res.code == '200') {
      ElMessage.success('领取成功')
      getPoolPage()
    } else {
      ElMessage.success(res.msg)
    }
  })
}

//table选择数据
let ids = ref<string[]>([])
const handleSelectionChange = (selectData: IPoolPageRecords[]) => {
  ids.value = selectData.map((item) => item.id)
}
//批量领取
const batchStudent = () => {
  ElMessageBox.confirm('是否批量领取', '批量领取客户', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(async () => {
    let res = await poolReceiveBatch(ids.value)
    if (res.code == '200') {
      ElMessage.success('领取成功')
      getPoolPage()
    } else {
      ElMessage.success(res.msg)
    }
  })
}

// 搜索
const search = () => {
  getPoolPage()
}

// 重置
const reset = () => {
  Object.assign(publicForm, {
    selectName: '',
    mobile: ''
  })
  getPoolPage()
}
</script>

<style scoped>
.toolbar {
  margin-bottom: 15px;
}
</style>
