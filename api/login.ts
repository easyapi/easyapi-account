import http from '~/api/request'
export const login = {
  /**
 * 登录
 *
 * @see https://www.easyapi.com
 */
  login(data: any) {
    return http.post(`${process.env.baseUrl}/authenticate`, data, {})
  },

}
