<script>
export default {
  data() {
    return {
      formHtml: '',
    }
  },
  head() {
    return {
      title: '正在跳转支付宝 - EasyAPI',
      meta: [
        { charset: 'utf-8' },
        { hid: 'description', name: 'description', content: '正在跳转支付宝' },
        { hid: 'keyword', name: 'keyword', content: '正在跳转支付宝' },
      ],
    }
  },
  mounted() {
    if (this.$route.query.form) {
      this.formHtml = this.$route.query.form
      this.$nextTick(() => {
        document.forms[0].submit() // 渲染支付宝支付页面
      })
    }
  },
}
</script>

<template>
  <div>
    <p v-html="formHtml" />
  </div>
</template>
