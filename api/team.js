/**
 * 获取团队成员列表
 *
 * @see https://account-api.easyapi.com
 */
export function getTeamUserList(params, context) {
  return context.$axios.get(`${process.env.baseUrl}/team/users`, {
    params: {
      ...params,
    },
  })
}
