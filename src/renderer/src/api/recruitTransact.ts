import http from '@utils/request'

export interface ITransactPage {
  current: number
  size: number
  selectName?: string
  mobile?: string
  source?: string
  startTime?: string
  endTime?: string
}

export interface ITransactPageItem {
  id: string
  name: string
  namePinyin: string
  nameAbbr: string
  mobile: string
  wechat: string
  source: string
  purpose: string
  purposeCourseIds: null
  purposeClassIds: null
  level: string
  dealStatus: number
  dealTime: string
  gender: string
  education: string
  age: number
  school: string
  major: string
  province: string
  city: string
  county: string
  enabled: null
  remark: null
  createBy: string
  createTime: number
  createUnits: null
  updateBy: null
  updateTime: null
  collectBy: null
  collectTime: null
  whrId: string
  whrName: string
  collectName: null
  channelName: null
  provinceName: string
  cityName: string
  countyName: string
  followMethod: null
  followTime: null
  followContent: null
  followNextTime: null
  classId: string
  subjectId: string
  subjectName: string
  className: string
  unitName: string
}

interface ITransactPageData {
  code: string
  msg: string
  data: {
    records: ITransactPageItem[]
    total: number
    size: number
    current: number
    orders: any[]
    optimizeCountSql: boolean
    searchCount: boolean
    countId: null
    maxLimit: null
    pages: number
  }
}

//办理列表
export const transactPage = (data: ITransactPage): Promise<ITransactPageData> => {
  return http.get<ITransactPageData>('/crm/recruit/transact/page', data)
}
