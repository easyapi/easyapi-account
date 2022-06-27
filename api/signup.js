/**
 * 注册
 *
 * @see https://www.easyapi.com
 */
export const signup = (data, context) => {
  return context.$axios.post(`${process.env.baseUrl}/api/account/signup`, data)
}

/**
 * 对比账号
 *
 * @see https://www.easyapi.com
 */
export const findUsername = (params, context) => {
  return context.$axios.get(`${process.env.baseUrl}/api/account/find`, {
    params: {
      ...params
    }
  })
}

/**
 * 发送验证码
 *
 * @see https://www.easyapi.com
 */
export const sendCode = (params, context) => {
  return context.$axios.get(`${process.env.baseUrl}/captcha/send`, {
    params: {
      ...params
    }
  })
}
