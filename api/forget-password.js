/**
 * 重置密码
 *
 * @see https://www.easyapi.com
 */
export const forgePassword = (data, context) => {
  return context.$axios.post(`${process.env.baseUrl}/api/account/forget-password/reset`, data);
};
