import { useRuntimeConfig } from 'nuxt/app'
import http from '~/api/request'

export const signup = {

  /**
   * 注册
   *
   * @see https://www.easyapi.com
   */
  signup(data: any) {
    return http.post(`${useRuntimeConfig().public.baseUrl}/account/signup`, data, {})
  },

  /**
   * 对比账号
   *
   * @see https://www.easyapi.com
   */
  findUsername(params: any) {
    return http.get(`${useRuntimeConfig().public.baseUrl}/account/find`, params, {})
  },

  /**
   * 发送验证码
   *
   * @see https://www.easyapi.com
   */
  sendCode(params: any) {
    return http.get(`${useRuntimeConfig().public.baseUrl}/captcha/send`, params, {},
    )
  },
}

export default signup
