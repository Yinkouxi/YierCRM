import http from '@utils/request'

interface ITagData {
  msg: string
  code: string
  data: null | string
}

export interface ITagPage {
  current: number
  size: number
}

export interface ITagPageItem {
  id: string
  name: string
  createTime: string
  createBy: null
  updateBy: null
  updateTime: null
}

export interface ITagPageData {
  code: string
  msg: string
  data: {
    records: ITagPageItem[]
    size: number
    pages: number
    total: number
    current: number
    orders: []
    optimizeCountSql: boolean
    searchCount: boolean
    countId: null
    maxLimit: null
  }
}

//查询标签
export const tagPage = (data: ITagPage): Promise<ITagPageData> => {
  return http.get<ITagPageData>('/crm/recruit/tag/page', data)
}

//增加标签
export const tagAdd = (data: { name: string }): Promise<ITagData> => {
  return http.post<ITagData>('/crm/recruit/tag/add', data)
}
