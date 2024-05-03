<template>
  <el-container>
    <el-main>
      <el-row :gutter="15">
        <el-col :span="24">
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span style="color: #409eff">学员信息</span>
              </div>
            </template>
            <el-form>
              <el-form-item>
                <el-autocomplete
                  v-model="searchName"
                  :fetch-suggestions="querySearch"
                  popper-class="my-autocomplete"
                  placeholder="输入学员姓名/手机号进行搜索"
                  @select="handleSelect"
                  suffix-icon="Search"
                >
                  <template #default="{ item }">
                    <div class="customer">
                      <div class="name">
                        {{ item.name }}（
                        <template v-if="item.gender == 1">男</template>
                        <template v-else-if="item.gender == 2">女</template>
                        <template v-else>未知</template>
                        ）
                      </div>
                      <div class="wechat">
                        <el-icon-iphone style="width: 14px" /> {{ item.mobile }}
                      </div>
                      <div class="wechat">
                        <el-icon-chat-round style="width: 14px" /> {{ item.wechat }}
                      </div>
                    </div>
                  </template>
                </el-autocomplete>
                <el-button type="primary" style="margin-left: 15px" @click="add"
                  >创建学员</el-button
                >
              </el-form-item>
              <el-form-item>
                <div v-if="clientInfo.name" class="info">
                  <div class="person">
                    <span style="font-size: 24px; font-weight: bold">{{ clientInfo.name }}</span>
                    <template v-for="item in dicts.system_global_gender">
                      <el-tag
                        v-if="clientInfo.gender == item.v"
                        style="margin-left: 15px; position: absolute; top: 5px"
                      >
                        {{ item.k }}
                      </el-tag>
                    </template>
                    <span style="margin-left: 80px">{{ clientInfo.mobile }}</span>
                  </div>
                  <div class="lesson">
                    <div>
                      <span>意向课程：</span>
                      <el-tag v-for="item in clientInfo.subjects" style="margin-left: 10px"
                        >{{ item.subjectName }}
                      </el-tag>
                    </div>
                    <div>
                      <span>意向班级：</span>
                      <el-tag v-for="item in clientInfo.classes" style="margin-left: 10px">{{
                        item.className
                      }}</el-tag>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <el-col :span="24" style="margin-top: 15px">
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span style="color: #409eff">报名信息</span>
              </div>
            </template>
            <div class="enroll">
              <div class="choices">
                <el-button type="primary" @click="chooseSubject">选择科目</el-button>
                <el-button type="primary" @click="chooseClass">选择班级</el-button>
              </div>
              <div class="option">
                <div class="left">
                  <el-tag v-if="clientInfo.orders && clientInfo.orders.length > 0" type="warning"
                    >老学员</el-tag
                  >
                  <el-tag v-else type="success">新报名</el-tag>
                  <span style="font-size: 16px; font-weight: bold">
                    <template v-if="enrollInfo.subjectName && enrollInfo.gradeName"
                      >{{ enrollInfo.subjectName }}（{{
                        enrollInfo.gradeName
                      }}）&nbsp;/&nbsp;</template
                    >
                    <template v-if="enrollInfo.className">{{ enrollInfo.className }}</template>
                  </span>
                </div>
                <div class="right">
                  <span>共：</span>
                  <span>{{ enrollInfo.classHour }}</span>
                  <span>课时</span>
                </div>
              </div>
              <div class="discount">
                <div class="title">
                  <h3>活动优惠</h3>
                  <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 12px"
                    @click="addCoupon"
                    >新增优惠</el-button
                  >
                </div>
                <div class="content">
                  <el-row>
                    <el-col :span="6">
                      <el-select
                        placeholder="请选择优惠券"
                        v-model="orderCouponId"
                        @change="handleCoupon"
                        clearable
                      >
                        <el-option
                          v-for="item in couponList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </el-col>
                  </el-row>
                  <div class="fee">
                    <span>应收总计：{{ enrollInfo.amount }} 元 = </span>
                    <span>课程价格：{{ enrollInfo.amount }} 元 + </span>
                    <span
                      >优惠券信息：{{ enrollInfo.coupon ? enrollInfo.coupon : '(暂无优惠)' }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>

  <subjectDialog
    v-if="subjectVisible"
    v-model:subjectVisible="subjectVisible"
    @chooseSubject="handleChooseSubject"
  ></subjectDialog>

  <classDialog
    v-if="classVisible"
    v-model:classVisible="classVisible"
    @chooseClass="handleChooseClass"
  ></classDialog>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, getCurrentInstance, ComponentInternalInstance } from 'vue'
import subjectDialog from './components/subjectDialog.vue'
import classDialog from './components/classDialog.vue'
import { consultPage, IConsultList, consultDetail, IConsultDetail } from '@api/recruitConsult'
import { IGradeListItem } from '@api/teachSubjectGrade'
import { classGet } from '@api/teachClass'
import { useRouter } from 'vue-router'
import { dicts } from '@mixins/DIctsPlugin'
const router = useRouter()
//选择到的用户名称
let searchName = ref('')
//选择到的用户数据
let clientInfo = reactive<Partial<IConsultDetail>>({})

// 优惠券数据
let orderCouponId = ref('')
interface ICouponList{
  id: string,
  name: string,
  amount: number,

}
const couponList = ref<ICouponList[]>([])
//生命周期
onBeforeMount(() => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    ;(proxy as any).getDicts(['system_global_gender'])
  }
})
//搜索用户
const querySearch = async (queryString: string, cb: any) => {
  let res = await consultPage({
    current: 1,
    size: 10,
    selectName: queryString
  })
  let { records } = res.data
  if (res.code == '200') {
    cb(records)
  }
}
//选择用户
const handleSelect = async (item: IConsultList) => {
  searchName.value = item.name
  let res = await consultDetail(item.id)
  Object.assign(clientInfo, res.data)
}

//新建咨询
const add = () => {
  router.push('/recruit/consult/add')
}

//报名信息
let enrollInfo = reactive({
  subjectName: '', //选择科目
  className: '', //选择班级
  gradeName: '', //科目等级
  classHour: '', //班级课时
  amount: '', //应收金额
  coupon: ''
})

//选择科目
let subjectVisible = ref<boolean>(false)
const chooseSubject = () => {
  subjectVisible.value = true
}
//选择某一个科目
const handleChooseSubject = (val: IGradeListItem) => {
  Object.assign(enrollInfo, val)
  console.log(val)
}

//选择班级
let classVisible = ref<boolean>(false)
const chooseClass = () => {
  classVisible.value = true
}
//选择某一个班级
const handleChooseClass = async (id: string) => {
  let res = await classGet(id)
  Object.assign(enrollInfo, res.data)
}

// 新增优惠
const addCoupon = () => {
  console.log('新增优惠')
}

const handleCoupon = () => {
  console.log('优惠券')
}
</script>

<style scoped lang="less">
.info {
  display: flex;
  flex-direction: column;
}

.btn {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.choosenLabel {
  width: 100%;
  height: 30px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;

  span {
    font-size: 12px;
    font-weight: bold;
  }
}

.payment-table {
  border-top: #e2e2e2 solid 1px;
  border-left: #e2e2e2 solid 1px;

  th,
  td {
    border-right: #e2e2e2 solid 1px;
    border-bottom: #e2e2e2 solid 1px;
    padding: 10px;
    line-height: 30px;
  }

  th {
    color: var(--el-text-color-regular);
    background: var(--el-fill-color-lighter);
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    font-weight: bold;
  }
}

.enroll {
  border: 1px solid #d4dfe5;
  border-top: 3px solid var(--el-color-primary);
  padding-top: 6px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  margin-bottom: 15px;

  .choices {
    margin-left: 15px;
    width: 100%;
    height: 40px;
  }

  .option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 65px;
    background: #f2f8ff;
    opacity: 1;
    border-top: 1px solid #d4dfe5;
    border-bottom: 1px solid #d4dfe5;

    > div {
      margin: 15px;
    }

    .left {
      display: flex;
      align-items: center;

      span:nth-child(2) {
        margin-left: 15px;
      }
    }

    .right {
      span {
        margin-left: 10px;
      }

      span:nth-child(2) {
        font-size: 22px;
        font-weight: bold;
      }

      span:nth-child(5) {
        font-size: 22px;
        font-weight: bold;
      }
    }
  }

  .section {
    border-bottom: 1px solid #d4dfe5;
    width: 100%;
    display: flex;
    flex-direction: column;

    > .title {
      color: var(--el-text-color-regular);
      width: 100%;
      height: 50px;
      margin: 0 15px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .content {
      margin: 0 15px;
    }
  }
}

.fee {
  color: var(--el-text-color-regular);
  font-size: 14px;
  font-weight: bold;
  padding-bottom: 15px;
  margin: 15px 0;
}
.account {
  border-top: 3px solid var(--el-color-primary);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  margin-bottom: 15px;
  width: 100%;

  .header {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bold;
    line-height: 20px;
  }

  .form {
    width: 100%;
    height: 50px;
    line-height: 50px;
  }

  .bottom {
    padding: 10px;

    .btn {
      width: 100%;
      height: 50px;
      border: 1px solid #d4dfe5;
      text-align: center;
      line-height: 45px;
    }
  }
}

.gather {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 50px;
  color: var(--el-text-color-regular);
  span {
    margin-right: 15px;
    font-size: 14px;
    font-weight: bold;
  }
}

.customer {
  width: 100%;
  border-bottom: #e2e2e2 dashed 1px;
}

.discount {
  border-bottom: 1px solid #d4dfe5;
  width: 100%;
  display: flex;
  flex-direction: column;

  > .title {
    height: 50px;
    margin: 0 15px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .result {
    margin: 0 15px;
  }

  .content {
    margin: 0 15px 15px 15px;
  }
}

.tag {
  z-index: 999;
  cursor: pointer;
}
</style>
