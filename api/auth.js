/**
 *
 *
 * @see https://www.easyapi.com
 */
export const getAuthorize = (params, context) => {
  return context.$axios.get(`${process.env.baseUrl}/oauth/authorize`, {
    params: {
      ...params
    }
  });
};

export const updateAuthorize = (data, context) => {
  return context.$axios.post(`https://account.easyapi.com/oauth/authorize`, data);
};
