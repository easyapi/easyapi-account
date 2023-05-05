/**
 * 升级邮箱
 *
 * @see https://www.easyapi.com
 */
export function upgradeEmail(data, context) {
  return context.$axios.post(`${process.env.baseUrl}/account/email-upgrade`, data)
}
