<template></template>

<script setup lang="ts">

import from from '../../utils/from'

import { onMounted } from 'vue'

// const Cookies = useCookie()

onMounted(() => {
	from(this)
	useCookie().remove('authenticationToken')
	useCookie().remove('authenticationToken', { path: '/', domain: '.easyapi.com' })
	if (document.referrer.indexOf('logout') > -1) {
		window.location.replace('/login')
	} else if (document.referrer.indexOf('account.easyapi.com') > -1) {
		window.location.replace('/login/?from=https://www.easyapi.com')
	} else {
		window.location.replace('/login/?from=' + document.referrer)
	}
})
</script>
