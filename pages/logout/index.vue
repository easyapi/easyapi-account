<template>

</template>

<script>
import Cookies from "js-cookie";
import from from "../../utils/from"

export default {
  name: 'Logout',

  mounted() {
    from(this)
    Cookies.remove("authenticationToken", {path: '', domain: '.easyapi.com'})
    if (document.referrer.indexOf("logout") > -1) {
      window.location.replace('/login')
    } else if (document.referrer.indexOf("account.easyapi.com") > -1) {
      window.location.replace('/login?from=https://www.easyapi.com')
    } else {
      window.location.replace('/login?from=' + document.referrer)
    }
  }
}
</script>
