<template>
  <el-container>
    <el-main>
      <el-row :gutter="15">
        <!-- 学员信息 -->
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

        <!-- 班级信息 -->
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
              <div class="content">
                <div class="fee">
                  <span>课程价格：{{ enrollInfo.amount }} 元 </span>
                  <span>应收总计：{{ enrollInfo.amount }} 元 </span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 收费模式 -->
        <el-col :span="24" style="margin-top: 15px">
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span style="color: #409eff">支付信息</span>
              </div>
            </template>
            <div class="discount">
              <el-form-item label="收费模式" label-width="100px" style="margin: 15px">
                <div style="display: flex; align-items: center">
                  <el-select
                    v-model="order.chargeMode"
                    placeholder="选择收费模式"
                    style="width: 150px"
                    @change="choosePayType"
                  >
                    <el-option
                      v-for="item in dicts.recruit_charge_type"
                      :key="item.k"
                      :label="item.k"
                      :value="item.v"
                    />
                  </el-select>
                  <span v-if="order.chargeMode == '2'" style="margin: 0 10px"> * </span>
                  <el-select
                    v-if="order.chargeMode == '2'"
                    v-model="order.termCounter"
                    placeholder="选择分期数"
                    style="width: 150px"
                    @change="choosePayNum"
                  >
                    <el-option
                      v-for="item in dicts.installment_count"
                      :key="item.k"
                      :label="item.k"
                      :value="item.v"
                    />
                  </el-select>
                </div>
              </el-form-item>
            </div>
            <div class="account" v-for="item in orderTerms" :key="item.termNumber">
              <table class="payment-table" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td colspan="4">
                    <div class="header">
                      <div class="term-title">第{{ item.termNumber }}期</div>
                      <div class="installment">本期应收{{ item.installment }}元</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>账户名称</th>
                  <th>对方账户</th>
                  <th>流水/支付单号</th>
                  <th>实收</th>
                </tr>
                <tr v-for="(payment, index) in item.orderPayments" :key="index">
                  <td>
                    <el-input
                      placeholder="请输入账户名称"
                      v-model="payment.payAccountName"
                    ></el-input>
                  </td>
                  <td>
                    <el-input
                      placeholder="请输入对方账号"
                      v-model="payment.payAccountNo"
                    ></el-input>
                  </td>
                  <td>
                    <el-input
                      placeholder="请输入流水单号"
                      v-model="payment.paySerialNumber"
                    ></el-input>
                  </td>
                  <td>
                    <el-input placeholder="实收金额" v-model="payment.payAmount"></el-input>
                  </td>
                </tr>
                <tr>
                  <td colspan="4" align="center">
                    <el-button type="default" icon="CirclePlus" @click="addPayment(item)"
                      >新增账户</el-button
                    >
                  </td>
                </tr>
              </table>
            </div>
            <div class="content">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="对内备注" label-width="100px">
                    <el-input
                      v-model="order.remark1"
                      type="textarea"
                      maxlength="200"
                      show-word-limit
                      placeholder="该备注只有内部操作人员可见"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="对外备注" label-width="100px">
                    <el-input
                      v-model="order.remark2"
                      type="textarea"
                      maxlength="200"
                      show-word-limit
                      placeholder="该备注将会打印"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="gather">
              <span>实收总计:{{ enrollInfo.amount }}元</span>
            </div>
          </el-card>
        </el-col>

        <!-- 订单标签 -->
        <el-col :span="24" style="margin-top: 15px">
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span style="color: #409eff">订单标签</span>
              </div>
            </template>
            <div class="choosenLabel">
              <span style="width: 60px">已选标签：</span>
              <el-tag
                v-for="(tag, index) in orderTags"
                :key="index"
                type="success"
                :disable-transitions="false"
                closable
                style="margin-right: 15px"
                @close="handleClose(tag)"
                class="tag"
              >
                {{ tag.name }}
              </el-tag>
              <el-input
                v-if="inputVisible"
                ref="InputRef"
                v-model="inputValue"
                size="default"
                class="tag"
                @keyup.enter="handleInputConfirm"
                style="width: 200px"
              />
              <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput"
                >+ 新建标签</el-button
              >
            </div>
            <div class="label">
              <el-tag
                v-for="tag in tags"
                :key="tag.id"
                :disable-transitions="false"
                style="margin-right: 10px"
                class="tag"
                @click="clickTag(tag)"
                >{{ tag.name }}</el-tag
              >
              <el-tag
                type="success"
                :disable-transitions="false"
                style="margin-right: 15px; cursor: pointer"
                @click="moreTag"
                >更多标签</el-tag
              >
            </div>
          </el-card>
        </el-col>

        <!-- 经办信息 -->
        <el-col :span="24" style="margin-top: 15px">
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span style="color: #409eff">经办信息</span>
              </div>
            </template>
            <div class="operator">
              <el-form label-width="100px">
                <el-row :gutter="15">
                  <el-col :span="8">
                    <el-form-item label="经办校区">
                      <el-input v-model="processinfo.area" placeholder="经办人" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="经办人">
                      <el-input
                        v-model="processinfo.oprator"
                        placeholder="经办人"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="经办日期">
                      <el-date-picker
                        v-model="processinfo.date"
                        style="width: 100%"
                        disabled
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-card>
        </el-col>

        <el-col :span="24" style="margin-top: 15px">
          <el-card shadow="never" class="btn">
            <el-button type="primary" @click="submit">保存</el-button>
            <el-button @click="cancel">取消</el-button>
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
import { useRouter, useRoute } from 'vue-router'
import { dicts } from '@mixins/DIctsPlugin'
import { tagPage, ITagPage, ITagPageItem, tagAdd } from '@api/recruitTag'
import { ElMessage } from 'element-plus'
const router = useRouter()
const route = useRoute()
//选择到的用户名称
let searchName = ref('')
//选择到的用户数据
let clientInfo = reactive<Partial<IConsultDetail>>({})

//支付信息
const order = reactive({
  customerId: '', //学员id
  classId: '', //班级id
  gradeId: '', //等级id
  chargeMode: '', //收费模式（1：全款；2：分期）
  termCounter: '', //期数 全款就是1期
  subjectId: '', //课程id
  remark1: '', //对内备注1
  remark2: '' //对内备注2
})

//全款/分期数据
let orderTerms = ref([
  {
    termNumber: 1, //期数
    installment: 0, //
    orderPayments: [
      {
        payAccountName: '', //支付账号名称
        payAccountNo: '', //支付账号
        paySerialNumber: '', //流水号
        payAmount: '' //支付金额
      }
    ]
  }
])

//生命周期
onBeforeMount(() => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    ;(proxy as any).getDicts(['system_global_gender', 'recruit_charge_type', 'installment_count'])
  }
  //获取选择的用户
  let id = route.query?.id as string
  if (id) {
    getConsultDetail(id)
  }
  //获取标签
  getTags()
  // 经办信息
  getCurrentUser()
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
// 获取用户
const getConsultDetail = async (id: string) => {
  let res = await consultDetail(id)
  Object.assign(clientInfo, res.data)
  //赋值学员id
  order.customerId = id
}
//选择用户
const handleSelect = async (item: IConsultList) => {
  searchName.value = item.name
  getConsultDetail(item.id)
  //赋值学员id
  order.customerId = item.id
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
  amount: 0, //应收金额
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
  //赋值等级id和科目id
  order.gradeId = val.id
  order.subjectId = val.subjectId
  //默认全款方式
  choosePayType('1')
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
  //赋值班级id
  order.classId = id
}

//选择支付模式
const choosePayType = (val: string) => {
  //选择全款
  if (val == '1') {
    order.termCounter = '1'
    orderTerms.value = [
      {
        termNumber: 1, //期数
        installment: enrollInfo.amount, //
        orderPayments: [
          {
            payAccountName: '', //支付账号名称
            payAccountNo: '', //支付账号
            paySerialNumber: '', //流水号
            payAmount: '' //支付金额
          }
        ]
      }
    ]
  }
}
//选择分期
const choosePayNum = (val: number) => {
  const basePayment = {
    payAccountName: '', //支付账号名称
    payAccountNo: '', //支付账号
    paySerialNumber: '', //流水号
    payAmount: '' //支付金额
  }
  orderTerms.value = Array.from({ length: val }, (item, index) => {
    return {
      termNumber: index + 1,
      installment: enrollInfo.amount / val,
      orderPayments: [Object.assign({}, basePayment)]
    }
  })
}

//新增账号
const addPayment = (item) => {
  item.orderPayments.push({
    payAccountName: '', //支付账号名称
    payAccountNo: '', //支付账号
    paySerialNumber: '', //流水号
    payAmount: '' //支付金额
  })
}

// 订单标签
let inputVisible = ref<boolean>(false)
let inputValue = ref<string>('')
let orderTags = ref<{ id: string; name: string }[]>([])
//新建标签
const showInput = () => {
  inputVisible.value = true
}
//输入标签确认
const handleInputConfirm = async () => {
  if (
    inputValue.value.trim() !== '' &&
    !orderTags.value.some((item) => item.name == inputValue.value)
  ) {
    let { data } = await tagAdd({ name: inputValue.value })
    orderTags.value.push({
      id: data,
      name: inputValue.value
    })
    inputValue.value = ''
  }
  inputVisible.value = false
}
//删除当前标签
const handleClose = (tag: { id: string; name: string }) => {
  orderTags.value = orderTags.value.filter((item) => item != tag)
}

//获取更多标签
const tagForm = reactive<ITagPage>({
  current: 0,
  size: 5
})
const getTags = async () => {
  let res = await tagPage(tagForm)
  let { records, total } = res.data
  tags.value = tags.value.concat(records)
  if (total === tags.value.length) {
    ElMessage.warning('没有更多标签了')
  }
}
//更多标签
let tags = ref<ITagPageItem[]>([])
const moreTag = () => {
  tagForm.current += 1
  getTags()
}
//点击更多标签
const clickTag = (tag: ITagPageItem) => {
  if (!orderTags.value.some((item) => item.name === tag.name)) {
    orderTags.value.push(tag)
  }
}

//经办信息
const processinfo = reactive<{
  area: string
  oprator: string
  date: Date
}>({
  area: '',
  oprator: '',
  date: new Date()
})
import { useUserStore } from '@store/useUserStore'
import { orderAdd } from '@api/recruitOrder'
const userStore = useUserStore()
const getCurrentUser = () => {
  processinfo.area = userStore.units.name as string
  processinfo.oprator = userStore.userInfo.username as string
}

//取消
const cancel = () => {
  router.go(-1)
}

//保存
const submit = async () => {
  let form = {
    order: order,
    orderTerms: orderTerms.value,
    orderTags: orderTags.value.map((item) => item.id), // 标签id
    orderBooks: {}, //教材id
    orderCouponId: '' //优惠卷id
  }
  let res = await orderAdd(form)
  if (res.code == '200') {
    ElMessage.success('保存成功')
    router.go(-1)
  } else {
    ElMessage.error(res.msg)
  }
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
  }
}
.content {
  margin: 0 15px;

  // 最后一个span
  span:nth-child(2) {
    margin-left: 15px;
  }

  .fee {
    color: var(--el-text-color-regular);
    font-size: 14px;
    font-weight: bold;
    padding-bottom: 15px;
    margin-top: 15px;
  }
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
