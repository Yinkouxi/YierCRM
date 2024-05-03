import http from '@utils/request'

export interface IPoolPage {
  current: number
  size: number
  selectName: string
  mobile: string
}

export interface IPoolPageRecords {
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
  gender: string // 学员性别（字典）
  education: string // 学员学历（字典）
  province: string // 学员所在省
  city: string // 学员所在市
  county: string // 学员所在县
  enabled: number
  remark: string
  createBy: string
  createTime: number
  createUnits: string
  updateBy: string
  updateTime: number
  collectBy: string
  collectTime: number
  whrId: string | null
  whrName: string | null
  collectName: string | null
  channelName: string
  provinceName: string | null
  cityName: string | null
  countyName: string | null
  followMethod: string // 跟进方式（手机、微信、QQ等）
  followTime: number
  followContent: string
  followNextTime: number
  roles: any[] | null
  classes: any[] | null
  subjects: any[] | null
}

interface IPoolPageData {
  code: string
  msg: string
  data: {
    records: IPoolPageRecords[]
    total: number
    size: number
    current: number
    orders: any[]
    optimizeCountSql: boolean
    searchCount: boolean
    countId: string | null
    maxLimit: string | null
    pages: number
  }
}

//公有池列表
export const poolPage = (data: IPoolPage): Promise<IPoolPageData> => {
  return http.get<IPoolPageData>('/crm/recruit/pool/page', data)
}

interface IPoolData {
  code: string
  msg: string
  data: null | string
}

//领取客户（单条）
export const poolReceive = (data: string): Promise<IPoolData> => {
  return http.get<IPoolData>(`/crm/recruit/pool/receive/${data}`)
}

//领取客户（多条）
export const poolReceiveBatch = (data: string[]): Promise<IPoolData> => {
  return http.post<IPoolData>('/crm/recruit/pool/receiveBatch', data)
}
