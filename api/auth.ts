import http from '~/api/request'

export const auth = {
  /**
   * @see https://www.easyapi.com
   */
  getAuthorize(params: any) {
    return http.get(`${useRuntimeConfig().public.baseUrl}/oauth2/authorize`, params, {})
  },

  oauthAuthorize(data: any) {
    return http.post(`${useRuntimeConfig().public.baseUrl}/oauth2/authorize`, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
}
export default auth
