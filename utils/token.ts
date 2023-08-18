import { useCookie } from '#app/composables/cookie'

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
export function setToken(token: string, rememberMe : boolean) {
  useCookie(key, { maxAge: rememberMe ? 60 * 60 * 24 * 30 : 1, path: '/', domain: useCookie('domain').value as string | undefined }).value = token
}

/**
 * 移除token
 */
export function removeToken(): void {
  useCookie(key).value = null
  useCookie(key, { path: '/', domain: '.easyapi.com' }).value = null
}
