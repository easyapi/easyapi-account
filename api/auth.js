/**
 *
 *
 * @see https://www.easyapi.com
 */
export const getAuthorize = (params, context) => {
  return context.$axios.get(`${process.env.baseUrl}/oauth2/authorize`, {
    params: {
      ...params
    }
  })
}

export const oauthAuthorize = (data, context) => {
  return context.$axios.post(`${process.env.baseUrl}/oauth2/authorize`, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
