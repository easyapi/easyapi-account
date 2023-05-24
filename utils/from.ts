import { useCookies } from '@vueuse/integrations/useCookies'
import { userStore } from '~/store/user'

/**
 * 处理来源链接和域名
 */
export function from(): void {
  let from: any
  if (!useRoute().query.from) {
    from = useCookies().get('from') ? useCookies().get('from') : 'https://www.easyapi.com'
    from = from.indexOf('account.easyapi.com') > -1 ? 'https://www.easyapi.com' : from
    useCookies().set('from', from)
  } else {
    from = useRoute().query.from as string
    if (from.indexOf('account.easyapi.com') > -1) {
      useCookies().set('from', 'https://www.easyapi.com')
    } else {
      useCookies().set('from', from)
    }
  }
  useCookies().set('domain', userStore().$state.user.domain)
}
