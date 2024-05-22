// 通讯录
import http from '@utils/request'

export interface IContactsData {
  code: string
  msg: string
  data: any
}

// 通讯录
export const contacts = (data: { keywords?: string }): Promise<IContactsData> => {
  return http.get<IContactsData>('/crm/chat/contacts', data)
}

// 会话列表
export const sessions = (data: { current?: string; size?: string }): Promise<IContactsData> => {
  return http.get<IContactsData>('/crm/chat/sessions', data)
}
// export const sessions = (data) => {
//   return http.get('/crm/chat/session', data)
// }
