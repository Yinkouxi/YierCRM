import http from '@utils/request'

export interface IChannelData {
  id: string
  channelName: string
  description: string
  createBy: string
  updateBy: string
  createTime: number
  updateTime: number
  cnt: number
}
interface IChannelPage {
  code: string
  msg: string
  data: {
    records: IChannelData[]
    total: number
    size: number
    current: number
    pages: number
    orders: []
    optimizeCountSql: boolean
    searchCount: boolean
    countId: boolean
    maxLimit: boolean
  }
}

//渠道列表
export const channelPage = (): Promise<IChannelPage> => {
  return http.get<IChannelPage>('/crm/media/channel/page')
}
