// import Cookies from 'js-cookie'

/**
 * 处理来源链接和域名
 */
export default function (context) {
  let from
  if (!context.$route.query.from) {
    from = Cookies.get('from') ? Cookies.get('from') : 'https://www.easyapi.com'
    from = from.indexOf('account.easyapi.com') > -1 ? 'https://www.easyapi.com' : from
    Cookies.set('from', from)
  } else {
    from = context.$route.query.from
    if (from.indexOf('account.easyapi.com') > -1) {
      // Cookies.set('from', 'https://www.easyapi.com')
    } else {
      // Cookies.set('from', from)
    }
  }
  Cookies.set('domain', context.$store.state.user.domain)
}
