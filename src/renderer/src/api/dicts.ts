import http from '@utils/request'

type DictsItem = {
  id: string
  typeId: string
  k: string
  v: string
  sort: number
  remark: string
  createBy: string
  createTime: number
  updateBy: string | null
  updateTime: number | null
}

export type Dicts = {
  system_global_status: DictsItem[]

  // 防止使用dict飘红
  recruit_education_background?: DictsItem[] // 添加缺失的属性
  system_global_gender?: DictsItem[]
  recruit_customer_level?: DictsItem[]
  recruit_follow_method?: DictsItem[]
  recruit_dealStatus?: DictsItem[]
}

interface IDicts {
  code: string
  msg: string
  data: Dicts
}

//查询字典项（批量）
export const queryBatch = (data: string[]): Promise<IDicts> => {
  return http.post<IDicts>('/system/dict/item/queryBatch', data)
}
