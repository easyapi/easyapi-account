/**
 * 注册
 *
 * @see https://www.easyapi.com
 */
export function signup(data, context) {
  return context.$axios.post(`${process.env.baseUrl}/account/signup`, data)
}

/**
 * 对比账号
 *
 * @see https://www.easyapi.com
 */
export function findUsername(params, context) {
  return context.$axios.get(`${process.env.baseUrl}/account/find`, {
    params: {
      ...params,
    },
  })
}

/**
 * 发送验证码
 *
 * @see https://www.easyapi.com
 */
export function sendCode(params, context) {
  return context.$axios.get(`${process.env.baseUrl}/captcha/send`, {
    params: {
      ...params,
    },
  })
}
