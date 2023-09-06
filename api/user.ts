import { useRuntimeConfig } from 'nuxt/app'
import http from '~/api/request'

const user = {
  /**
   * 登录
   *
   * @see https://www.easyapi.com
   */
  login(data: any) {
    return http.post(`${useRuntimeConfig().public.baseUrl}/authenticate`, data, {})
  },
}
export default user
