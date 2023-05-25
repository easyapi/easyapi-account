import http from '~/api/request'
const login = {
  /**
 * 登录
 *
 * @see https://www.easyapi.com
 */
  postLogin(data: any) {
    return http.post(`${useRuntimeConfig().public.baseUrl}/authenticate`, data, {})
  }
}
export default login
