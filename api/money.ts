import http from '~/api/request'

export const money = {
  /**
 * 查询账户信息
 *
 * @see https://www.easyapi.com
 */
  getTeamMoney(params: any) {
    return http.get(`${process.env.baseUrl}/money/team`, params, {}
    )
  },
  /**
  * 余额预警
  *
  * @see https://www.easyapi.com
  */
  warningBalance(id: any, data: any){
    return http.put(`${process.env.baseUrl}/money/${id}/warning-balance`, data,{})
  },
}