import http from '~/api/request'

export const auth = {
  /**
   * @see https://www.easyapi.com
   */
  getAuthorize(params: any) {
    return http.get(`${process.env.baseUrl}/oauth2/authorize`, params, {})
  },

  oauthAuthorize(data: any) {
    return http.post(`${process.env.baseUrl}/oauth2/authorize`, data, {
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  }
}
export default auth
