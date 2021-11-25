/**
 * 升级邮箱
 *
 * @see https://www.easyapi.com
 */
export const updateEmail = (data, context) => {
  return context.$axios.post(`https://account-api.easyapi.com/api/account/email-upgrade`, data);
};
