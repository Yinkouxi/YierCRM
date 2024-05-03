import http from '@utils/request'

//增加等级
interface IgradeAdd {
  id?: string
  gradeName: string
  amount: string
  enabled: string
  subjectId: string
  protocol: string
}
interface IgradeAddData {
  code: string
  msg: string
  data: null
}

//新增等级
export const gradeAdd = (data: IgradeAdd): Promise<IgradeAddData> => {
  return http.post<IgradeAddData>('/crm/teach/grade/add', data)
}

//删除等级
export const gradeDelete = (data: string): Promise<IgradeAddData> => {
  return http.get<IgradeAddData>(`/crm/teach/grade/delete/${data}`)
}

//修改等级
export const gradeUpdate = (data: IgradeAdd): Promise<IgradeAddData> => {
  return http.post<IgradeAddData>('/crm/teach/grade/update', data)
}

//等级详情
export const gradeGet = (data: string): Promise<IgradeAddData> => {
  return http.get<IgradeAddData>(`/crm/teach/grade/get/${data}`)
}

export interface IGradeList {
  current: number
  size: number
  subjectName: string
  gradeName: string
}
export interface IGradeListItem {
  id: string
  subjectId: string
  gradeName: string
  protocol: string
  createBy: string
  updateBy: string
  subjectName: string
  amount: number
  enabled: number
  delFlag: number
  createTime: number
  updateTime: number
}

interface IGradeListData {
  msg: string
  code: string
  data: {
    records: IGradeListItem[]
    total: number
    size: number
    current: number
    pages: number
    orders: []
    optimizeCountSql: boolean
    searchCount: boolean
    countId: null
    maxLimit: null
  }
}
//列表
export const gradeList = (data: IGradeList): Promise<IGradeListData> => {
  return http.get<IGradeListData>('/crm/teach/grade/list', data)
}
