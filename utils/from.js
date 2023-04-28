// import useCookie() from 'js-cookie'

/**
 * 处理来源链接和域名
 */
export default function (context) {
  let from
  if (!context.$route.query.from) {
    from = useCookie().get('from') ? useCookie().get('from') : 'https://www.easyapi.com'
    from = from.indexOf('account.easyapi.com') > -1 ? 'https://www.easyapi.com' : from
    useCookie().set('from', from)
  } else {
    from = context.$route.query.from
    if (from.indexOf('account.easyapi.com') > -1) {
      // useCookie().set('from', 'https://www.easyapi.com')
    } else {
      // useCookie().set('from', from)
    }
  }
  useCookie().set('domain', context.$store.state.user.domain)
}
