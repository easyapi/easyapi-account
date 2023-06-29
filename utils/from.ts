import { useCookies } from '@vueuse/integrations/useCookies'
import { useRoute } from 'vue-router'
import { userStore } from '~/store/user'

/**
 * 处理来源链接和域名
 */
export function from() {
  let url = ''
  if (!useRoute().query.from) {
    url = useCookies().get('from') ? useCookies().get('from') : 'https://www.easyapi.com'
    url = url?.includes('account.easyapi.com') ? 'https://www.easyapi.com' : url
    useCookies().set('from', url, { path: '/' })
  } else {
    url = useRoute().query.from as string
    if (url?.includes('account.easyapi.com'))
      useCookies().set('from', 'https://www.easyapi.com', { path: '/' })
    else
      useCookies().set('from', url, { path: '/' })
  }
  useCookies().set('domain', userStore().domain, { path: '/' })
}
