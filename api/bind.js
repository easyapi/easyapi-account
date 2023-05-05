/**
 * 绑定
 *
 * @see https://www.easyapi.com
 */
export function bind(data, context) {
  return context.$axios.post(`${process.env.baseUrl}/auth/bind`, data)
}
