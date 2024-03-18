import request from '@utils/request'
import { UserRuleForm } from '@interface/login'

//验证码
export const captchaImage = (params: { key: string }): Promise<ArrayBuffer> => {
  return request({
    url: '/captcha/image',
    responseType: 'arraybuffer',
    params
  })
}

interface ILoginRequest {
  code: string
  msg: string
  data?: string | null
}

//用户登录
export const loginByJson = (data: UserRuleForm): Promise<ILoginRequest> => {
  return request({
    url: '/u/loginByJson',
    method: 'post',
    data
    //...
  })
}
