<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { from } from '~/utils/from'
import { removeToken } from '~/utils/token'

export default defineComponent({
  setup() {
    onMounted(() => {
      from()
      removeToken()
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
