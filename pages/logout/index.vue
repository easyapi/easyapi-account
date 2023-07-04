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
      cookies.remove('authenticationToken', { path: '/', domain: '.easyapi.com' })
      if (document.referrer.includes('logout'))
        window.location.replace('/login')
      else if (document.referrer.includes('account.easyapi.com'))
        window.location.replace('/login/?from=https://www.easyapi.com')
      else
        window.location.replace(`/login/?from=${document.referrer}`)
    })
  },
})
</script>

<template />
