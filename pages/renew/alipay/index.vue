<template>
  <div>
    <p v-html="formHtml"></p>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: '正在跳转支付宝 - EasyAPI',
      meta: [
        { charset: 'utf-8' },
        { hid: 'description', name: 'description', content: '正在跳转支付宝' },
        { hid: 'keyword', name: 'keyword', content: '正在跳转支付宝' }
      ]
    }
  },
  data() {
    return {
      formHtml: ''
    }
  },
  mounted() {
    if (this.$route.query.form) {
      this.formHtml = this.$route.query.form
      this.$nextTick(() => {
        document.forms[0].submit() //渲染支付宝支付页面
      })
    }
  }
}
</script>
