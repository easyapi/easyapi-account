<script setup lang="ts">
import { onMounted } from 'vue'
import from from '../../utils/from'

// const Cookies = useCookie()

onMounted(() => {
  from(this)
  useCookie().remove('authenticationToken')
  useCookie().remove('authenticationToken', { path: '/', domain: '.easyapi.com' })
  if (document.referrer.includes('logout'))
    window.location.replace('/login')
	 else if (document.referrer.includes('account.easyapi.com'))
    window.location.replace('/login/?from=https://www.easyapi.com')
	 else
    window.location.replace(`/login/?from=${document.referrer}`)
})
</script>

<template />
