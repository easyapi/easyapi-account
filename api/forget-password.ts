import http from '~/api/request'
export const forget = {
  /**
 * 重置密码
 *
 * @see https://www.easyapi.com
 */
  forgetPasswordApi(data: any) {
    return http.post(`${process.env.baseUrl}/account/forget-password/reset`, data, {})
  }
}
export default forget

