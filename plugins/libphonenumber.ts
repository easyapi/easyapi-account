import LibphonenumberJs from 'libphonenumber-js'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('libphonenumberjs', LibphonenumberJs)
})
