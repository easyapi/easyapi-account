import http from '~/api/request'
 const bind = {
  /**
   * 绑定
   */
  postBind(data: any) {
    return http.post(`${process.env.baseUrl}/auth/bind`, data, {})
  }
}

export default bind

