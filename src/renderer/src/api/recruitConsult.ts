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

//查询地区（通过上级ID）
export const consultAdd = (data: CustomerData): Promise<IConsultAddData> => {
  return http.post<IConsultAddData>('/crm/recruit/consult/add', data)
}
