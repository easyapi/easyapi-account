import http from '~/api/request'

export const renew = {
  /**
   * 获取团队成员列表
   *
   * @see https://account-api.easyapi.com
   */
  getTeamUserList(params: any) {
    return http.get(`${process.env.baseUrl}/team/users`, params, {})
  }
}


