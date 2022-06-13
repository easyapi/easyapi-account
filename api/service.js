/**
 * 获取服务报价列表
 */
export const getServiceList = (params, context) => {
  return context.$axios.get(`${process.env.serviceUrl}/console/service-prices`, {
    params: {
      ...params,
    },
  });
};

/**
 * 续购服务
 */
export const renewBalance = (data, context) => {
  return context.$axios.post(`${process.env.serviceUrl}/service/buy`, data);
};

/**
 * 获取服务详情信息
 *
 * @param id 团队服务关系ID
 */
export const getTeamService = (id, context) => {
  return context.$axios.get(`${process.env.serviceUrl}/console/team-service/${id}`);
};
