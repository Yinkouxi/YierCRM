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

export interface IStudentList {
  name?: string
  mobile?: string
  companyName?: string
  classId?: string
  current?: number
  size?: number
}

export interface IStudentListItem {
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
  age: number
  school: string | null
  major: string | null
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
  createBy: string
  createTime: number
  createUnits: string
  updateBy: string
  updateTime: number
  collectBy: string
  collectTime: number
  provinceName: string
  cityName: string
  countyName: string
  whrId: string
  whrName: string
  subjectId: string
  subjectName: string
  gradeId: string
  gradeName: string
  amount: number
  classId: string
  className: string
  unitName: string | null
}

interface IStudentListData {
  code: string
  msg: string
  data: {
    records: IStudentListItem[]
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

// 学生列表
export const studentList = (data: IStudentList): Promise<IStudentListData> => {
  return http.get<IStudentListData>('/crm/teach/class/student/list', data)
}

export interface IStudentGetInfo {
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
  age: number
  school: string | null
  major: string | null
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
  provinceName: string
  cityName: string
  countyName: string
  channelName: string | null
  whrId: string
  whrName: string
  subjectId: string
  subjectName: string
  classId: string | null
  className: string | null
  unitName: string
}

 interface IStudentGetData {
  code: string
  msg: string
  data: IStudentGetInfo
}
// 学生详情
export const studentGet = (data: string): Promise<IStudentGetData> => {
  return http.get<IStudentGetData>(`/crm/teach/class/student/get/${data}`)
}


export interface ISuccessClassGetItem{
  id: string;
  className: string;
  teachingMethod: string;
  subjectId: string;
  fullPeople: number;
  mainTeacherId: string;
  assistTeacherId: string;
  manageTeacherId: string;
  classHour: number;
  beginDate: string;
  endDate: string;
  teachingDay: string;
  teachingTime: string;
  arranged: number;
  status: number;
  createBy?: any; // 如果createBy可以是null，可以用any或更具体的类型
  createTime: number;
  updateBy: string;
  updateTime: number;
  subjectName: string;
}
interface ISuccessClassGetData {
  code: string
  msg: string
  data: ISuccessClassGetItem[]
}
//报读课程
export const successClassGet = (data: string): Promise<ISuccessClassGetData> => {
  return http.get<ISuccessClassGetData>(`/crm/recruit/consult/course/successClass/${data}`)
}
