import { isValidPhoneNumber } from 'libphonenumber-js'
/**
 * 地区代码
 */
export const areaCodes = [
  { value: 86, label: '中国大陆', country: 'CN' },
  { value: 852, label: '中国香港', country: 'HK' },
  { value: 886, label: '中国台湾', country: 'TW' },
  { value: 81, label: '日本', country: 'JP' },
  { value: 1, label: '美国', country: 'US' },
]
const emailRegex = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
export default function emailVerify(email: any) {
  return emailRegex.test(email)
}
