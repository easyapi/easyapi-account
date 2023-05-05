import dayjs from 'dayjs'

/**
 * 获取服务的到期时间
 */
export const getExpirationTime = (endTime: any) =>{
  if (dayjs(endTime).isBefore(dayjs())) {
    // If the end time is before the current date, return the current time as it has expired.
    return dayjs().format('YYYY-MM-DD HH:mm:ss');
  } else {
    // Otherwise, return the end time.
    return dayjs(endTime).format('YYYY-MM-DD HH:mm:ss');
  }
};
