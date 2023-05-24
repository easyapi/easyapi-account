import http from '~/api/request'
/**
 * 获取服务报价列表
 */
export const service = {
  getServiceList(params: any) {
    return http.get(`${useRuntimeConfig().public.baseUrl}/api/services`, params, {})
  },

  /**
   * 续购服务
   */
  renewBalance() {
    return http.post(`${process.env.serviceUrl}/service/buy`, {}, {})
  },

  /**
   * 获取服务详情信息
   *
   * @param id 团队服务关系ID
   */
  getTeamService(id: any) {
    return http.get(`${useRuntimeConfig().public.serviceUrl}/console/team-service/${id}`, {})
  }
}
export default service

