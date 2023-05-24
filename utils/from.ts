import { useCookies } from '@vueuse/integrations/useCookies'
import { userStore } from '~/store/user'

/**
 * 处理来源链接和域名
 */
export async function from() {
  let fromData = ''
  if (!useRoute().query.from) {
    fromData = await useCookies().get('from') ? useCookies().get('from') : 'https://www.easyapi.com'
    fromData = fromData.includes('account.easyapi.com') ? 'https://www.easyapi.com' : fromData
    useCookies().set('from', fromData)
  } else {
    fromData = await useRoute().query.from as string
    if (fromData && fromData.includes('account.easyapi.com'))
      useCookies().set('from', 'https://www.easyapi.com')
    else
      useCookies().set('from', from)
  }
  useCookies().set('domain', userStore().user.domain)
}
