<script lang="ts">
import { useCookies } from '@vueuse/integrations/useCookies'
import { defineComponent, onMounted } from 'vue'
import { from } from '~/utils/from'

export default defineComponent({
  setup() {
    interface WindowWithReferrer extends Window {
      referrer: string
    }

    onMounted(() => {
      from()
      const cookies = useCookies()
      cookies.remove('authenticationToken')
      cookies.remove('authenticationToken', { path: '/', domain: '.easyapi.com' })
      const windowWithReferrer = window as unknown as WindowWithReferrer
      if (windowWithReferrer.referrer.includes('logout'))
        window.location.replace('/login')
      else if (windowWithReferrer.referrer.includes('account.easyapi.com'))
        window.location.replace('/login/?from=https://www.easyapi.com')
      else
        window.location.replace(`/login/?from=${windowWithReferrer.referrer}`)
    })
  },
})
</script>

<template />
