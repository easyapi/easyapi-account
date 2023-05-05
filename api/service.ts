import { id } from 'element-plus/es/locale'
import http from '~/api/service'
/**
 * 获取服务报价列表
 */
export const service = {

  getServiceList(params: any): Promise<Response> {
    return http.get(`${useRuntimeConfig().public.baseUrl}/api/services`, params, {})
  },

  /**
   * 续购服务
   */
  renewBalance(): Promise<Response> {
    return http.$axios.post(`${process.env.serviceUrl}/service/buy`, {}, {})
  }

/**
 * 获取服务详情信息
 *
 * @param id 团队服务关系ID
 */
   getTeamService(id:any): Promise<Response> {
    return http.$axios.get(`${process.env.serviceUrl}/console/team-service/${id}`)
  }
}

