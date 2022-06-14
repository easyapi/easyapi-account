/**
 * 获取续费价格列表
 *
 * @see https://account-api.easyapi.com
 */
export const getPriceList = (release, context) => {
  return context.$axios.get(`${process.env.baseUrl}/team/price`, {
    params: {
      release: release,
    },
  });
};

/**
 * 获取团队续费金额
 *
 * @see https://account-api.easyapi.com
 */
export const getRenewPrice = (params, context) => {
  return context.$axios.get(`${process.env.baseUrl}/team/renew-price`, {
    params: {
      ...params,
    },
  });
};

/**
 * 文档续费
 *
 * @see https://account-api.easyapi.com
 */
export const renew = (data, context) => {
  return context.$axios.post(`${process.env.baseUrl}/team/renew`, data);
};
