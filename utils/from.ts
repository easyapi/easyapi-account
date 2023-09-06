import { useCookie } from 'nuxt/dist/app/composables/cookie'
import { useRoute } from 'vue-router'
import { userStore } from '~/store/user'

/**
 * 处理来源链接和域名
 */
export function from() {
  let url: string | null | undefined = ''
  if (!useRoute().query.from) {
    url = useCookie('from').value ? useCookie('from').value : 'https://www.easyapi.com'
    url = url?.includes('account.easyapi.com') ? 'https://www.easyapi.com' : url
    useCookie('from', { path: '/' }).value = url
  } else {
    url = useRoute().query.from as string
    if (url?.includes('account.easyapi.com'))
      useCookie('from', { path: '/' }).value = 'https://www.easyapi.com'
    else
      useCookie('from', { path: '/' }).value = url
  }
  useCookie('domain', { path: '/' }).value = userStore().domain
}
