<template>
  <el-dialog v-model="props.orderVisible" title="订单详情" width="1200px" @close="close">
    <el-table
      row-key="id"
      :data="tableData"
      width="100%"
      border
      stripe
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column width="50" type="index"></el-table-column>
      <el-table-column label="当前客户">
        <el-text>{{ props.orderName }}</el-text>
      </el-table-column>
      <el-table-column label="订单号" prop="orderNumber" width="200">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.orderNumber }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="购买课程" prop="subjectName" />
      <el-table-column label="参与班级" prop="className" />
      <el-table-column label="付款方式" prop="chargeMode">
        <template #default="{ row }">
          <template v-for="item in dicts.recruit_charge_type">
            <el-tag v-if="row.chargeMode == item.v">{{ item.k }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="分期期数" prop="termCounter"></el-table-column>
      <el-table-column label="订单原始金额" prop="receivableAmount"></el-table-column>
      <el-table-column label="订单实际金额" prop="actualAmount"></el-table-column>
      <el-table-column
        label="下单时间"
        prop="createTime"
        :formatter="rendererDateTime"
        width="150"
      ></el-table-column>
      <el-table-column label="支付状态" prop="termFinish">
        <template #default="{ row }">
          <el-tag v-if="Boolean(row.termFinish)" type="success">已完成</el-tag>
          <el-tag v-else type="danger">未完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="订单状态">
        <template #default="{ row }">
          <el-tag v-if="row.status == 1" type="success">有效</el-tag>
          <el-tag v-else type="danger">退款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="scope">
          <el-button-group>
            <el-button @click="signment(scope.row)" icon="List" text type="primary"
              >签署协议</el-button
            >
            <el-button icon="List" text type="primary">办理退款</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { orderPage, IOrderPageItem, IOrderPage } from '@api/recruitOrder'
import { ElMessage, type TableColumnCtx } from 'element-plus'
import tool from '@utils/tool'
import { dicts } from '@mixins/DIctsPlugin'
const props = defineProps({
  orderVisible: {
    type: Boolean,
    default: false
  },
  orderName: {
    type: String,
    default: ''
  },
  orderId: {
    type: String,
    default: ''
  }
})

let form = reactive<IOrderPage>({
  customerId: '',
  current: 1,
  size: 1
})
let tableData = ref<IOrderPageItem[]>([])

//生命周期
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
  Object.assign(form, {
    customerId: props.orderId
  })
  getOrderPage()
})

//订单列表
const getOrderPage = async () => {
  let res = await orderPage(form)
  const { records, total } = res.data
  tableData.value = records
}
//下单时间
const rendererDateTime = (
  row: IOrderPageItem,
  column: TableColumnCtx<IOrderPageItem>,
  timeValue: number
) => {
  return tool.dateFormat(timeValue)
}
//签署协议
const signment = async (row: IOrderPageItem) => {
  if (row.status == 0) {
    ElMessage.error('该订单退款中，无法签署协议')
  } else {
    try {
      let contractText = `关注公众号“小鹿线就业”，菜单中选择“签署协议”，在页面中填写正确的个人信息进行验证后签署协议。订单号：${row.orderNumber}`
      await navigator.clipboard.writeText(contractText)
      ElMessage.success('复制成功')
    } catch (err) {
      ElMessage.error('复制失败!')
    }
  }
}

//关闭dialog
const emit = defineEmits()
const close = () => {
  emit('update:orderVisible', false)
}
//保存
const onSubmit = async () => {
  close()
}
</script>

<style scoped>
.el-table {
  font-size: 12px;
}
.pagi {
  width: 100%;
  margin: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>
