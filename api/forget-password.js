/**
 * 重置密码
 *
 * @see https://www.easyapi.com
 */
export const reset = (data, context) => {
  return context.$axios.get(`https://account-api.easyapi.com/api/account/forget-password/reset`, data);
};
