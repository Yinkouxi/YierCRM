import http from '@utils/request'

type Customer = {
  name: string
  mobile: string
  wechat: string
  source: string
  purpose: string
  purposeCourseIds: string
  purposeClassIds: string
  level: string
  dealStatus: string
  dealTime: string
  gender: string
  education: string
  province: string
  city: string
  county: string
  age: number
  school: string
  major: string
  remark: string
}

type Follow = {
  followMethod: string
  followTime: string
  followNextTime: string
  followContent: string
}

export type FollowFile = {
  name: string
  url: string
}

type CustomerData = {
  customer: Customer
  follow: Follow
  followFile: FollowFile[]
}

interface IConsultAddData {
  code: string
  msg: string
  data: null
}

//新建客户
export const consultAdd = (data: CustomerData): Promise<IConsultAddData> => {
  return http.post<IConsultAddData>('/crm/recruit/consult/add', data)
}

interface IConsultPage {
  page: number
  size: number
  isSelf: boolean
  startTime: string
  endTime: string
  selectName?: string
  mobile?: string
}

export type IConsultList = {
  id: string
  name: string
  namePinyin: string
  nameAbbr: string
  mobile: string
  wechat: string
  source: string
  purpose: string
  purposeCourseIds: string
  purposeClassIds: string
  level: string
  dealStatus: number
  dealTime: string
  gender: string
  education: string
  province: string
  city: string
  county: string
  age: number
  school: string
  major: string
  enabled: number
  remark: string
  createBy: string | null
  createTime: number
  createUnits: string
  updateBy: string | null
  updateTime: number | null
  collectBy: string
  collectTime: number
  whrId: string
  whrName: string
  collectName: string | null
  channelName: string
  provinceName: string
  cityName: string
  countyName: string
  followMethod: string
  followTime: number
  followContent: string
  followNextTime: number
  roles: string | null
  classes: string | null
  subjects: string | null
}

type ResponseData = {
  records: IConsultList[]
  total: number
  size: number
  current: number
  orders: any[]
  optimizeCountSql: boolean
  searchCount: boolean
  countId: any
  maxLimit: any
  pages: number
}

interface IConsultPageData {
  code: string
  msg: string
  data: ResponseData
}

//客户列表
export const consultPage = (data: IConsultPage): Promise<IConsultPageData> => {
  return http.get<IConsultPageData>('/crm/recruit/consult/page', data)
}

export interface ITransaction {
  startDate: string
  endDate: string
}

export interface ITransactionApiData {
  peopleNum: number
  orderNum: number
  receivableAmount: number | null
  actualAmount: number | null
}
interface ITransactionData {
  code: string
  msg: string
  data: ITransactionApiData
}

//我的成交额
export const transaction = (data: ITransaction): Promise<ITransactionData> => {
  return http.get<ITransactionData>('/crm/recruit/channel/statistic/transaction', data)
}

export interface IStatisticFunnel {
  name: string
  value: string | number
  labelText: string
}
interface IStatisticFunnelData {
  code: string
  msg: string
  data: IStatisticFunnel[]
}

//漏斗图
export const statisticFunnel = (data: ITransaction): Promise<IStatisticFunnelData> => {
  return http.get<IStatisticFunnelData>('/crm/recruit/channel/statistic/funnel', data)
}
