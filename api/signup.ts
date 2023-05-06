import http from '~/api/request'
/**
 * 注册
 *
 * @see https://www.easyapi.com
 */
export const signup = {
  signup(data: any) {
    return http.post(`${process.env.baseUrl}/account/signup`, data, {})
  },
  /**
   * 对比账号
   *
   * @see https://www.easyapi.com
   */
  findUsername(params: any) {
    return http.get(`${process.env.baseUrl}/account/find`, params, {})
  },
  /**
 * 发送验证码
 *
 * @see https://www.easyapi.com
 */
  sendCode(params: any) {
    return http.get(`${process.env.baseUrl}/captcha/send`, params, {}
    )
  }
}











