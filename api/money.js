/**
 * 查询账户信息
 *
 * @see https://www.easyapi.com
 */
export function getTeamMoney(params, context) {
  return context.$axios.get(`${process.env.baseUrl}/money/team`, {
    params: {
      ...params,
    },
  })
}

/**
 * 余额预警
 *
 * @see https://www.easyapi.com
 */
export function warningBalance(id, data, context) {
  return context.$axios.put(`${process.env.baseUrl}/money/${id}/warning-balance`, data)
}
