import http from '@utils/request'

export type IConfigPageDataItem = {
  enabled: number
  fieldType: string
  group: string
  id: string
  k: string
  label: string
  type: number
  v: string
}
export interface IConfigPageDataList {
  items: IConfigPageDataItem[]
  group: string
}
interface IConfigPageData {
  code: string
  msg: string
  data: IConfigPageDataList[]
}

//查询
export const configPage = (data: {
  k: string
  type: number
  enabled: number
}): Promise<IConfigPageData> => {
  return http.get<IConfigPageData>('/crm/recruit/config/page', data)
}

interface IConfigUpdate {
  id: string
  k: string
  v: string
  type?: string
  enabled?: string
  fieldType?: string
  label?: string
}
interface IConfigUpdateData {
  msg: string
  code: string
  data: null
}
//修改
export const configUpdate = (data: IConfigUpdate): Promise<IConfigUpdateData> => {
  return http.post<IConfigUpdateData>('/crm/recruit/config/update', data)
}
