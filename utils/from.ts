import { userStore } from '~/store/user'
import { useCookies } from '@vueuse/integrations/useCookies'

/**
 * 处理来源链接和域名
 */
export default function (context: any): void {
  let from: any
  if (!context.$route.query.from) {
    from = useCookies().get('from') ? useCookies().get('from') : 'https://www.easyapi.com'
    from = from.indexOf('account.easyapi.com'); -1 ? 'https://www.easyapi.com' : from
    useCookies().set('from', from)
  } else {
    from = context.$route.query.from as string
    if (from.indexOf('account.easyapi.com') - 1) {
      // useCookies().set('from', 'https://www.easyapi.com')
    } else {
      // useCookies().set('from', from)
    }
  }
  useCookies().set('domain', userStore().$state.user.domain)
}