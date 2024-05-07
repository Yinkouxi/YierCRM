import http from '@utils/request'

interface IOrderAdd {
  code: string
  msg: string
  data: string | null
}

//报名
export const orderAdd = (data): Promise<IOrderAdd> => {
  return http.post<IOrderAdd>('/crm/recruit/order/add', data)
}

export interface IOrderPage {
  customerId: string
  current?: number
  size?: number
}
export interface IOrderPageItem {
  id: string
  customerId: string
  classId: string
  subjectId: string
  gradeId: string
  chargeMode: 1 | 2 // 收费模式（1：全款；2：分期）
  termCounter: number // 分期期数
  receivableAmount: number // 应付总金额
  handleUnit: string // 经办校区
  handleUnits: string // 经办校区层级
  orderNumber: string // 订单号
  actualAmount: number // 优惠后总金额
  remark1: string // 对内备注
  remark2: string // 对外备注
  createBy: string
  createTime: number
  updateBy: string | null
  updateTime: number | null
  subjectName: string // 科目名
  className: string // 班级名
  refundId: string // 退款id
  sourceOrderId: string // 源订单ID
  refundOrderNumber: string // 退款订单号
  receivableName: string // 收款人姓名
  receivableAccount: string // 收款人账户
  refundAmount: number // 退款金额
  payAmount: number // 实收金额
  reasonType: string // 原因类型（需要定义具体的类型）
  supplementDesc: string // 补充描述
  voucherImages: string // 凭证截图
  verifyed: -1 | 0 | 1 | 2 // 审核状态（-1：已撤销；0：待审核；1：通过；2：拒绝）
  verifyedOpinion: string // 审核意见
  status: 0 | 1 // 状态（0：退款中；1：已退款）
  termFinish: boolean // 分期是否全部支付完成 true 全部支付 false 未全部支付
}

interface IOrderPageData {
  code: string
  msg: string
  data: {
    records: IOrderPageItem[]
    total: number
    size: number
    current: number
    orders: any[] // 根据实际数据定义具体类型
    optimizeCountSql: boolean
    searchCount: boolean
    countId: string | null
    maxLimit: number | null
    pages: number
  }
}
//订单列表
export const orderPage = (data: IOrderPage): Promise<IOrderPageData> => {
  return http.get<IOrderPageData>('/crm/recruit/order/page', data)
}
