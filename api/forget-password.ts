import http from '~/api/request'

export const forget = {
  /**
 * 重置密码
 *
 * @see https://www.easyapi.com
 */
  forgetPassword(data: any) {
    return http.post(`${useRuntimeConfig().public.baseUrl}/account/forget-password/reset`, data, {})
  },
}
export default forget
