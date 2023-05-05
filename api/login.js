/**
 * 登录
 *
 * @see https://www.easyapi.com
 */
export function login(data, context) {
  return context.$axios.post(`${process.env.baseUrl}/authenticate`, data)
}
