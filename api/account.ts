/**
 * 获取用户信息
 *
 * @see https://www.easyapi.com
 */

export function getUser(context: any) {
  return context.$axios.get(`${process.env.baseUrl}/account`)
}
