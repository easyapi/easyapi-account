/**
 * 注册
 *
 * @see https://www.easyapi.com
 */
export const signup = (data, context) => {
  return context.$axios.post(`https://account-api.easyapi.com/api/account/signup`, data);
};

/**
 * 对比账号
 *
 * @see https://www.easyapi.com
 */
export const findUsername = (params, context) => {
    return context.$axios.get(`https://account-api.easyapi.com/api/account/find`, {
      params: {
        ...params
      }
    });
  };

/**
 * 发送验证码
 *
 * @see https://www.easyapi.com
 */
export const sendCode = (params, context) => {
  return context.$axios.get(`https://account-api.easyapi.com/captcha/send`, {
    params: {
      ...params
    }
  });
};
