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

export interface IConsultPage {
  current: number
  size: number
  isSelf?: boolean
  startTime?: string
  endTime?: string
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

interface IConsultImport {
  msg: string
  code: string
  data: null
}
//导入客户
export const consultImport = (data: FormData): Promise<IConsultImport> => {
  return http.post<IConsultImport>('/crm/recruit/consult/import', data)
}

export interface IConsultDetail {
  id: string
  name: string
  namePinyin: string
  nameAbbr: string
  mobile: string
  wechat: string
  source: string
  purpose: string
  purposeCourseIds: string | string[]
  purposeClassIds: string | string[]
  level: string
  dealStatus: number
  dealTime: string
  gender: string
  education: string
  province: string
  city: string
  county: string
  enabled: number
  remark: string
  createBy: string | null
  createTime: number
  createUnits: string
  updateBy: string
  updateTime: number
  collectBy: string
  collectTime: number
  whrId: string
  whrName: string
  collectName: string
  channelName: string | null
  provinceName: string
  cityName: string
  countyName: string
  followMethod: string | null
  followTime: string | null
  followContent: string | null
  followNextTime: string | null
  roles: {
    id: string
    customerId: string
    roleType: string
    roleManId: string
    createBy: string
    createTime: number
    updateBy: string
    updateTime: number
  }[]
  classes: {
    id: string
    className: string
    teachingMethod: string
    subjectId: string
    fullPeople: number
    mainTeacherId: string
    assistTeacherId: string
    manageTeacherId: string
    classHour: number
    beginDate: string
    endDate: string
    teachingDay: string
    teachingTime: string
    status: number
    createBy: string
    createTime: number
    updateBy: string
    updateTime: number
  }[]
  subjects: {
    id: string
    subjectName: string
    amount: null
    protocol: null
    enabled: string | number
    createBy: string | number
    createTime: string | number
    updateBy: string | number
    updateTime: string | number
  }[]
  orders: {
    id: string
    customerId: string
    classId: string
    subjectId: string
    chargeMode: number
    termCounter: number
    receivableAmount: number
    handleUnit: string
    handleUnits: string
    orderNumder: string
    actualAmount: number
    remark1: string
    remark2: string
    status: number
    createBy: string
    createTime: number
    updateBy: null
    updateTime: null
  }[]
  refunds: {
    id: string
    customerId: string
    sourceOrderId: string
    refundOrderNumber: string
    receivableName: string
    receivableAccount: string
    refundAmount: null
    reasonType: null
    supplementDesc: null
    voucherImages: null
    verifyed: number
    verifyedOpinion: null
    status: number
    createBy: null
    createTime: number
    updateBy: null
    updateTime: null
  }[]
}
interface IConsultDetailData {
  code: string
  msg: string
  data: IConsultDetail
}

//客户详情
export const consultDetail = (data: string): Promise<IConsultDetailData> => {
  return http.get<IConsultDetailData>(`/crm/recruit/consult/detail/${data}`)
}

export interface IConsultUpdate {
  id: string
  name?: string
  mobile?: string
  wechat: string
  source: string
  purpose: string
  purposeCourseIds: string | string[]
  purposeClassIds: string | string[]
  level: string
  gender: string
  education: string
  province: string
  city: string
  county: string
  age: number | string
  school: string
  major: string
  remark: string
}

interface IConsultUpdateData {
  code: string
  msg: string
  data: null | string
}

//修改客户
export const consultUpdate = (data: IConsultUpdate): Promise<IConsultUpdateData> => {
  return http.post<IConsultUpdateData>('/crm/recruit/consult/update', data)
}

interface IFollowPage {
  page: number
  size: number
  customerId: string
}

export interface IFiles {
  id: string | null
  followId: string | null
  name: string | null
  url: string | null
  fileType: string | null
  fileSize: number | null
  createBy: null
  createTime: null
  updateBy: null
  updateTime: null
}

export interface IFollowPageRecords {
  id: string
  customerId: string
  followMethod: string
  followTime: string
  followNextTime: string
  followContent: string
  createTime: string | number
  createBy: null
  updateBy: null
  updateTime: null
  files: IFiles[]
  roleManName: string
}
interface IFollowPageData {
  msg: string
  code: string
  data: {
    total: number | string
    size: number | string
    current: number | string
    orders: []
    optimizeCountSql: boolean
    searchCount: boolean
    countId: null
    maxLimit: null
    pages: number | string
    records: IFollowPageRecords[]
  }
}

//跟进列表
export const followPage = (data: IFollowPage): Promise<IFollowPageData> => {
  return http.get<IFollowPageData>('/crm/recruit/consult/follow/page', data)
}

export interface IFollowAddParams {
  customerId: string
  followMethod: string
  followTime: string
  followContent: string
  followNextTime: string
}
export interface IFollowAddFiles {
  name: string
  url: string
  fileType: string
  fileSize: number
}
interface IFollowAdd {
  follow: IFollowAddParams
  followFiles: IFollowAddFiles[]
}
interface IFollowAddData {
  code: string
  msg: string
  data: null
}
//增加跟进
export const followAdd = (data: IFollowAdd): Promise<IFollowAddData> => {
  return http.post<IFollowAddData>('/crm/recruit/consult/follow/add', data)
}

//转移客户
export const consultTransfer = (data: {
  customerIds: string[]
  userId: string
}): Promise<IFollowAddData> => {
  return http.post<IFollowAddData>('/crm/recruit/consult/transfer', data)
}

