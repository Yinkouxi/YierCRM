<template>
  <el-container>
    <el-main>
      <el-row :gutter="15">
        <el-col :span="24">
          <el-card header="订单详情">
            <div class="account">
              <table class="order-table" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <th>科目名称</th>
                  <td>
                    <el-text>{{ orderData.subjectName }}</el-text>
                  </td>
                </tr>
                <tr>
                  <th>班级名称</th>
                  <td>
                    <el-text>{{ orderData.className }}</el-text>
                  </td>
                </tr>
                <tr>
                  <th>订单编号</th>
                  <td>
                    <el-text>{{ orderData.orderNumber }}</el-text>
                  </td>
                </tr>
                <tr>
                  <th>下单时间</th>
                  <td>
                    <template v-if="orderData.createTime">
                      <el-text>{{ tool.dateFormat(orderData.createTime) }}</el-text>
                    </template>
                  </td>
                </tr>
              </table>
            </div>
          </el-card>
        </el-col>
        <!-- 支付/分期-->
        <el-col :span="24" style="margin-top: 15px">
          <el-card header="支付信息">
            <div class="discount">
              <div>
                收费模式 :
                <template v-for="item in dicts.recruit_charge_type">
                  <el-text
                    type="primary"
                    v-if="(orderData.chargeMode as unknown as string) == item.v"
                  >
                    {{ item.k }}</el-text
                  >
                </template>
                <span v-if="orderData.chargeMode == 2" style="margin: 0 10px"> * </span>
                <el-text type="primary" v-if="orderData.chargeMode == 2"
                  >{{ orderData.termCounter }}期</el-text
                >
              </div>
              <div>
                优惠前金额(元) :
                <el-text type="primary">¥ {{ orderData.receivableAmount }}</el-text>
              </div>
              <div>
                优惠后金额(元) :
                <el-text type="primary">¥ {{ orderData.actualAmount }}</el-text>
              </div>
            </div>
            <div class="account" v-for="(terms, idx) in orderTerms" :key="idx">
              <table class="payment-table" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td colspan="4">
                    <div style="display: flex; justify-content: space-between">
                      <div class="term-title">
                        {{ terms.termNumber }}期
                        <el-text type="primary">应收{{ terms.receivableAmount }}元</el-text>
                        |
                        <el-text type="primary">实收{{ terms.actualAmount }}元</el-text>
                        <el-tag
                          type="success"
                          class="pay-tag"
                          v-if="terms.receivableAmount == terms.actualAmount && terms.isPay == 1"
                          >已结清
                        </el-tag>
                        <el-tag type="danger" class="pay-tag" v-else>未结清</el-tag>
                      </div>
                      <div>
                        <el-tag>到期付款时间: {{ terms.receivableDate }}</el-tag>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>账户名称</th>
                  <th>对方账户</th>
                  <th>流水/支付单号</th>
                  <th>实收(元)</th>
                </tr>
                <tr v-for="(payment, index) in terms.orderPayments" :key="index">
                  <td>
                    <el-text>{{ payment.payAccountName }}</el-text>
                  </td>
                  <td>
                    <el-text>{{ payment.payAccountNo }}</el-text>
                  </td>
                  <td>
                    <el-text>{{ payment.paySerialNumber }}</el-text>
                  </td>
                  <td>
                    <el-text>{{ payment.payAmount }}</el-text>
                  </td>
                </tr>
              </table>
            </div>
          </el-card>
        </el-col>

        <!--订单标签-->
        <el-col :span="24" style="margin-top: 15px">
          <el-card header="订单标签">
            <div class="label" v-if="tags?.length">
              <el-tag v-for="tag in tags" :key="tag.id">
                {{ tag.name }}
              </el-tag>
            </div>
            <div v-else style="text-align: center">
              <el-text type="info">暂无标签</el-text>
            </div>
          </el-card>
        </el-col>

        <!--经办校区-->
        <el-col :span="24" style="margin-top: 15px">
          <el-card header="其他信息">
            <div class="account">
              <table class="order-table" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <th>经办校区</th>
                  <td>
                    <el-text>{{ orderData.unit?.name }}</el-text>
                  </td>
                </tr>
                <tr>
                  <th>对内备注</th>
                  <td>
                    <el-text>{{ orderData.remark1 }}</el-text>
                  </td>
                </tr>
                <tr>
                  <th>对外备注</th>
                  <td>
                    <el-text>{{ orderData.remark2 }}</el-text>
                  </td>
                </tr>
              </table>
            </div>
          </el-card>
        </el-col>

        <el-col :span="24" style="text-align: center; margin-top: 15px">
          <el-button @click="router.go(-1)">返回</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { orderDetail, OrderTerm, Unit, IOrderDetailDataOrder, Tag } from '@api/recruitOrder'
import { dicts } from '@mixins/DIctsPlugin'
import tool from '@utils/tool'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()

//支付信息
let orderTerms = ref<OrderTerm[]>([])
//其他信息
let unit = reactive<Partial<Unit>>({})
//订单详情
let orderData = reactive<Partial<IOrderDetailDataOrder>>({})
//标签
let tags = ref<Tag[]>([])

onBeforeMount(async () => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    ;(proxy as any).getDicts([
      'recruit_charge_type',
      'system_global_gender',
      'recruit_education_background',
      'recruit_customer_level',
      'recruit_dealStatus'
    ])
  }

  let { data } = await orderDetail(route.query?.id as string)
  Object.assign(orderData, data)
  Object.assign(unit, data.unit)
  orderTerms.value = data.orderTerms
  tags.value = data.tags
})
</script>

<style scoped lang="less">
.term-title {
  color: #72767b;
  font-size: 16px;
  font-weight: bold;
  line-height: 20px;
  text-align: left;

  .pay-tag {
    margin-left: 10px;
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
    text-align: center;
    line-height: 30px;
  }

  th {
    background: #e8eef1;
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    font-weight: bold;
    color: #72767b;
  }
}

.order-table {
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
    background: #e8eef1;
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    font-weight: bold;
    color: #72767b;
    width: 100px;
  }
}

.account {
  width: 100%;
  border-top: 3px solid var(--el-color-primary);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  margin-bottom: 20px;

  .title {
    line-height: 50px;
    height: 50px;
    font-size: 16px;
    background: #e8eef1;
  }
}

.label {
  width: 100%;

  .el-tag {
    margin-right: 10px;
  }
}

.discount {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  height: 40px;
  font-size: 14px;

  div {
    margin-right: 50px;
  }
}
</style>
