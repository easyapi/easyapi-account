import http from '~/api/request'
export const bind = {
  /**
 * 绑定
 *
 * @see https://www.easyapi.com
 */
  bind(data: any) {
    return http.post(`${process.env.baseUrl}/auth/bind`, data, {})
  }
}

