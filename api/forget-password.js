/**
 * 重置密码
 *
 * @see https://www.easyapi.com
 */
export const forgetPassword = (data, context) => {
  return context.$axios.post(`${process.env.baseUrl}/api/account/forget-password/reset`, data);
};
