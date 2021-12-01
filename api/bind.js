/**
 * 绑定
 *
 * @see https://www.easyapi.com
 */
export const bind = (data, context) => {
  return context.$axios.post(`${process.env.baseUrl}/auth/bind`, data);
};
