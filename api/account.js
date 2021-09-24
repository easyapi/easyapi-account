/**
 * 获取用户信息
 *
 * @see https://www.easyapi.com
 */
export const getUser = (context) => {
  return context.$axios.get(`https://account-api.easyapi.com/account`)
}
