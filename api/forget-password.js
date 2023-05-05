/**
 * 重置密码
 *
 * @see https://www.easyapi.com
 */
export function forgetPassword(data, context) {
  return context.$axios.post(`${process.env.baseUrl}/account/forget-password/reset`, data)
}
