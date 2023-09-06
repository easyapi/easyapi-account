import svgIcon from '@/components/SvgIcon/index.vue'
import 'virtual:svg-icons-register'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('svg-icon', svgIcon)
})
