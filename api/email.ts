import http from '~/api/request'
export const email = {
  /**
   * 升级邮箱
   *
   * @see https://www.easyapi.com
   */
  upgradeEmail(data: any) {
    return http.post(`${process.env.baseUrl}/account/email-upgrade`, data, {})
  }
}

