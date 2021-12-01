/**
 * 升级邮箱
 *
 * @see https://www.easyapi.com
 */
export const updateEmail = (data, context) => {
  return context.$axios.post(`${process.env.baseUrl}/api/account/email-upgrade`, data);
};
