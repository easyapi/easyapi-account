import http from '~/api/request'

export const renew = {
  /**
 * 获取续费价格列表
 *
 * @see https://account-api.easyapi.com
 */
  getPriceList(params: any) {
    return http.get(`${process.env.baseUrl}/team/price`, params, {}
    )
  },
  /**
 * 获取团队续费金额
 *
 * @see https://account-api.easyapi.com
 */
  getRenewPrice(params: any) {
    return http.get(`${process.env.baseUrl}/team/renew-price`, params, {}
    )
  },
  /**
 * 文档续费
 *
 * @see https://account-api.easyapi.com
 */
  renew(data: any) {
    return http.post(`${process.env.baseUrl}/team/renew`, data
    )
  }
}

export default renew