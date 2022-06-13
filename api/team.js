/**
 * 获取团队成员列表
 *
 * @see https://account-api.easyapi.com
 */
export const getTeamUserList = (params, context) => {
  return context.$axios.get(`${process.env.baseUrl}/api/team/users`, {
    params: {
      ...params,
    },
  });
};
