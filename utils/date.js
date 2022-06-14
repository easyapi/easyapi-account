import moment from "moment";

/**
 * 获取服务的到期时间
 */
export const getExpirationTime = (endTime) => {
  if (moment(endTime).isBefore(moment())) {
    // 如果结束时间小于当前日期，代表已过期，返回当前时间
    return moment().format("YYYY-MM-DD HH:mm:ss");
  } else {
    //否则返回结束时间
    return moment(endTime).format("YYYY-MM-DD HH:mm:ss");
  }
};
