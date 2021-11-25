/**
 *
 *
 * @see https://www.easyapi.com
 */
export const getAuthorize = (params, context) => {
  return context.$axios.get(`https://account.easyapi.com/oauth/authorize`, {
    params: {
      ...params
    }
  });
};
