<template>

</template>

<script>
export default {
  name: 'Logout',
  mounted() {
    Cookies.remove('authenticationToken', {
      path: '',
      domain: 'easyapi.com'
    });
    window.location.replace('/login?from=' + document.referrer ? document.referrer : "".indexOf("account.easyapi.com") >= 0 ? "https://www.easyapi.com" : document.referrer);
  }
}
</script>

<style lang="less" scoped>

</style>
