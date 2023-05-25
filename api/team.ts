import http from '~/api/request'

export const team = {
  /**
   * 获取团队成员列表
   *
   * @see https://account-api.easyapi.com
   */
  getTeamUserList(params: any) {
    return http.get(`${useRuntimeConfig().public.baseUrl}/team/users`, params, {})
  }
}

export default team

