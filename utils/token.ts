import { useCookies } from '@vueuse/integrations/useCookies'

const key = 'authenticationToken'
const cookies = useCookies()

/**
 * 获取token
 */
export function getToken(): string | undefined {
  return cookies.get(key) as string | undefined
}

/**
 * 移除token
 */
export function removeToken(): void {
  cookies.remove(key)
  cookies.remove(key, { path: '/', domain: '.easyapi.com' })
}
