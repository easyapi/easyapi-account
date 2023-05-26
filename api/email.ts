import http from '~/api/request'

export const email = {
  /**
   * 升级邮箱
   *
   * @see https://www.easyapi.com
   */
  upgradeEmail(data: any) {
    return http.post(`${useRuntimeConfig().public.baseUrl}/account/email-upgrade`, data, {})
  },
}

export default email
