/**
 * 绑定
 *
 * @see https://www.easyapi.com
 */
export const bind = (data, context) => {
  return context.$axios.post(`https://account-api.easyapi.com/auth/bind`, data);
};
