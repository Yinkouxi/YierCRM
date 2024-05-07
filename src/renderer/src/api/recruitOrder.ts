import http from '@utils/request'

interface IOrderAdd {
  code: string
  msg: string
  data: string | null
}

//报名
export const orderAdd = (data: any): Promise<IOrderAdd> => {
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

interface IOrderDetailData {
  msg: string
  code: string
  data: IOrderDetailDataOrder
}

export interface IOrderDetailDataOrder {
  id: string
  customerId: string
  classId: string
  subjectId: string | null
  chargeMode: number
  termCounter: number
  receivableAmount: number
  handleUnit: string
  handleUnits: string
  orderNumber: string
  actualAmount: number
  remark1: string
  remark2: string
  createBy: string
  createTime: number | null
  updateBy: string | null
  updateTime: number | null
  subjectName: string
  className: string
  sourceOrderId: string
  refundOrderNumber: string
  receivableName: string
  receivableAccount: string
  refundAmount: number
  reasonType: string
  supplementDesc: string
  voucherImages: string
  verifyed: number
  verifyedOpinion: string
  refundStatus: number
  orderTerms: OrderTerm[]
  orderCoupon: OrderCoupon
  orderBook: OrderBook[]
  tags: Tag[]
  unit: Unit
}

interface OrderCoupon {
  id: number | null
  orderId: number | null
  name: string
  type: number
  minRequire: number
  discount: number
  stock: number
  createBy: string | null
  createTime: string | null
  updateBy: string | null
  updateTime: string | null
}

interface OrderBook {
  id: number | null
  orderId: number | null
  name: string
  litpic: string
  description: string
  author: string
  singlePrice: number
  counter: number
  amount: number
  createBy: string | null
  createTime: string | null
  updateBy: string | null
  updateTime: string | null
}

export interface Tag {
  id: number | null
  name: string
  createBy: string | null
  createTime: string | null
  updateBy: string | null
  updateTime: string | null
}

export interface Unit {
  id: number | null
  name: string
  code: string
  codeseq: string
  contact: string
  mobile: string
  email: string
  web: string
  parentId: string
  system: number
  enabled: boolean | null
  leaderId: number | null
  createBy: string | null
  createTime: string | null
  updateBy: string | null
  updateTime: string | null
  address: string
}

export interface OrderTerm {
  id: string | null
  orderId: string | null
  termName: string
  termNumber: number
  receivableDate: string
  receivableAmount: number
  termRate: number | null
  actualAmount: number
  isPay: number
  createBy: string | null
  createTime: number | null
  updateBy: string | null
  updateTime: number | null
  orderPayments: OrderPayment[]
}

interface OrderPayment {
  id: string | null
  orderId: string | null
  termId: string | null
  payAccountName: string
  payAccountNo: string
  paySerialNumber: string
  payAmount: number
  createBy: string | null
  createTime: number | null
  updateBy: string | null
  updateTime: number | null
}

interface Order {
  id: string
  customerId: string
  classId: string
  subjectId: string | null
  chargeMode: number
  termCounter: number
  receivableAmount: number
  handleUnit: string
  handleUnits: string
  orderNumber: string
  actualAmount: number
  remark1: string
  remark2: string
  createBy: string
  createTime: number | null
  updateBy: string | null
  updateTime: number | null
  subjectName: string
  className: string
  sourceOrderId: string
  refundOrderNumber: string
  receivableName: string
  receivableAccount: string
  refundAmount: number
  reasonType: string
  supplementDesc: string
  voucherImages: string
  verifyed: number
  verifyedOpinion: string
  refundStatus: number
  orderTerms: OrderTerm[]
}
//订单详情
export const orderDetail = (data: string): Promise<IOrderDetailData> => {
  return http.get<IOrderDetailData>(`/crm/recruit/order/detail/${data}`)
}
