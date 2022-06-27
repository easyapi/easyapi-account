<template>
  <div>
    <Header v-if="$nuxt.$route.path.indexOf('/alipay') == -1" />
    <nuxt />
    <Footer v-if="$nuxt.$route.path.indexOf('/renew') == -1" />
  </div>
</template>
<script>
import Header from '~/components/Header'
import Footer from '~/components/Footer'

export default {
  components: {
    Header,
    Footer
  }
}
</script>
<style></style>