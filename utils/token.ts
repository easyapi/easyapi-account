import { useCookie } from 'nuxt/app'

const key = 'authenticationToken'

/**
 * 获取token
 */
export function getToken() {
  return useCookie(key).value
}

/**
 * 存储token
 */
export function setToken(token: string, rememberMe: boolean): void {
  const option = {} as object
  option.maxAge = rememberMe ? 60 * 60 * 24 * 30 : 1
  option.path = '/'
  if (useCookie('domain').value)
    option.domain = useCookie('domain').value
  useCookie(key, option).value = token
}

/**
 * 移除token
 */
export function removeToken(): void {
  useCookie(key).value = null
  useCookie(key, { path: '/', domain: '.easyapi.com' }).value = null
}
