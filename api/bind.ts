import http from '~/api/request'

const bind = {
  /**
   * 绑定
   */
  postBind(data: any) {
    return http.post(`${useRuntimeConfig().public.baseUrl}/auth/bind`, data, {})
  },
}

export default bind
