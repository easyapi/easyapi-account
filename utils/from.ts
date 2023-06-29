import { useCookies } from '@vueuse/integrations/useCookies'
import { useRoute } from 'vue-router'
import { userStore } from '~/store/user'

/**
 * 处理来源链接和域名
 */
export function from() {
  let fromData = ''
  if (!useRoute().query.from) {
    fromData = useCookies().get('from') ? useCookies().get('from') : 'https://www.easyapi.com'
    fromData = fromData?.includes('account.easyapi.com') ? 'https://www.easyapi.com' : fromData
    useCookies().set('from', fromData)
  } else {
    fromData = useRoute().query.from as string
    if (fromData?.includes('account.easyapi.com'))
      useCookies().set('from', 'https://www.easyapi.com')
    else
      useCookies().set('from', fromData)
  }
  useCookies().set('domain', userStore().domain)
}
