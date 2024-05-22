// 通讯录
import http from '@utils/request'

interface IContactUser {
  id: string
  parentId: string
  name: string
  type: string
  avatar?: string
  gender?: number
  email?: string
  mobile?: string
  realName: string
}
export interface IContactsUnit {
  id: string
  parentId: string
  name: string
  type: string
  avatar?: string
  gender?: number
  email?: string
  mobile?: string
  realName: string
  children?: (IContactsUnit | IContactUser)[]
}
export interface IContactsData {
  code: string
  msg: string
  data: IContactsUnit[]
}

// 通讯录
export const contacts = (data: { keywords?: string }): Promise<IContactsData> => {
  return http.get<IContactsData>('/crm/chat/contacts', data)
}

interface ISessionsMessage {
  id: string
  sessionId: string
  event: string
  msgType: string
  fromUserId: string
  toUserId: string
  messageBodyType: string
  messageBodyContent: string
  status: number
  createBy: number
  createTime: number
  updateBy: string
  updateTime: number
}

export interface ISessions {
  id: string
  sessionName: string
  promoter: string
  promoterUsername: string
  promoterRealname: string
  promoterAvatar: string
  partaker: number
  partakerUsername: string
  partakerRealname: string
  partakerAvatar: string
  isGroup: string
  createBy: number
  createTime: number
  updateBy: string
  updateTime: number
  messages: ISessionsMessage[]
}

export interface ISessionsData {
  code: string
  msg: string
  data: {
    countId: string
    maxLimit: number
    current: number
    size: number
    searchCount: boolean
    optimizeCountSql: boolean
    orders: []
    pages: number
    total: number
    records: ISessions[]
  }
}
// 会话列表
export const sessions = (data: { current?: string; size?: string }): Promise<ISessionsData> => {
  return http.get<ISessionsData>('/crm/chat/sessions', data)
}

interface IChatSessionMessage {
  id: string;
  sessionId: string;
  event: string;
  msgType: string;
  fromUserId: string;
  toUserId: string;
  messageBodyType: string;
  messageBodyContent: string;
  status: number;
  createBy: number;
  createTime: number;
  updateBy: string;
  updateTime: number;
}
export interface IChatSessionsItem {
  id: string;
  sessionName: string;
  promoter: string;
  promoterUsername: string;
  promoterRealname: string;
  promoterAvatar: string;
  partaker: string;
  partakerUsername: string;
  partakerRealname: string;
  partakerAvatar: string;
  isGroup: boolean;
  createBy: number;
  createTime: number;
  updateBy: string;
  updateTime: number;
  messages: IChatSessionMessage[];
}
export interface IChatSessionsData{
  code: string;
  msg: string;
  data: IChatSessionsItem;
}

// 获取会话
export const chatSession = (fromUserId: string, toUserId: string): Promise<IChatSessionsData> => {
  return http.get<IChatSessionsData>(`/crm/chat/session/${fromUserId}/${toUserId}`)
}
