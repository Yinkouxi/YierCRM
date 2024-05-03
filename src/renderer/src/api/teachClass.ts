import http from '@utils/request'

export interface IClassPage {
  current: number
  size: number
  className?: string
  teachingMethod?: string
  mainTeacherUsername?: string
  assistTeacherUsername?: string
  manageTeacherUsername?: string
  subjectId?: string
  status?: string
}

export interface ClassRecord {
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
  subjectName: string | null
  mainTeacherUsername: string | null
  assistTeacherUsername: string
  manageTeacherUsername: string | null
  applyNum: string
  arranged: number
}

interface IClassPageData {
  code: string
  msg: string
  data: {
    records: ClassRecord[]
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
}

//班级列表
export const classPage = (data: IClassPage): Promise<IClassPageData> => {
  return http.get<IClassPageData>('/crm/teach/class/page', data)
}

interface IClassExport {
  className?: string
  teachingMethod?: string
  mainTeacherUsername?: string
  assistTeacherUsername?: string
  manageTeacherUsername?: string
  subjectId?: string
  status?: string
}

interface IclassData {
  code: string
  msg: string
  data: null
}

//导出班级
export const classExport = (data: IClassExport): Promise<IclassData> => {
  return http.get<IclassData>('/crm/teach/class/export', data)
}

export interface IClassAdd {
  id?: string
  className: string
  teachingMethod: string
  subjectId: string
  fullPeople: string
  mainTeacherId: string
  assistTeacherId: string
  manageTeacherId: string
  classHour: string
  beginDate: string
  endDate: string
  teachingDay: string | string[]
  teachingTime: string
}

interface IClassAddData {
  msg: string
  code: string
  data: null | any
}
//添加班级
export const classAdd = (data: IClassExport): Promise<IClassAddData> => {
  return http.post<IClassAddData>('/crm/teach/class/add', data)
}

//删除班级
export const classDelete = (data: string): Promise<IClassAddData> => {
  return http.get<IClassAddData>(`/crm/teach/class/delete/${data}`)
}

interface IclassGetData {
  msg: string
  code: string
  data: any
}

//班级详情
export const classGet = (data: string): Promise<IclassGetData> => {
  return http.get<IclassGetData>(`/crm/teach/class/get/${data}`)
}

//修改班级
export const classUpdate = (data: IClassAdd): Promise<IclassGetData> => {
  return http.post<IclassGetData>('/crm/teach/class/update', data)
}

export interface IRecruitWorkGet {
  called: number
  classId: string
  createBy: string
  createTime: number
  date: string
  dateStr: string
  id: string
  subjectId: string
  teached: number
  updateBy: string | null
  updateTime: number | null
}

interface IRecruitWorkGetData {
  msg: string
  code: string
  data: IRecruitWorkGet[]
}

//排课：查询
export const recruitWorkGet = (data: { classId: string }): Promise<IRecruitWorkGetData> => {
  return http.get<IRecruitWorkGetData>('/crm/recruit/work/get', data)
}

//排课 ： 增加或修改
export const recruitWorkSave = (data: IRecruitWorkGet[]): Promise<IclassGetData> => {
  return http.post<IclassGetData>('/crm/recruit/work/save', data)
}
