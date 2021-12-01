/**
 * 重置密码
 *
 * @see https://www.easyapi.com
 */
export const reset = (data, context) => {
  return context.$axios.get(`${process.env.baseUrl}/api/account/forget-password/reset`, data);
};
