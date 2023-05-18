import LibphonenumberJs from 'libphonenumber-js'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('libphonenumberjs', LibphonenumberJs)
})