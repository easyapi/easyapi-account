<template>
  <div class="mheight wp">
    <div class="con_nofound">
      <div class="Title">
        <span class="bigTitle">403!</span>
        <span class="subTitle">访问被拒绝!</span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '403',
  head() {
    return {
      title: '访问被拒绝 - EasyAPI服务平台',
      meta: [
        {hid: 'description', name: 'description', content: '访问被拒绝'},
        {hid: 'keyword', name: 'keyword', content: '访问被拒绝'}
      ],
      link: [
        {rel: 'stylesheet', href: 'https://static.easyapi.com/styles/base.css'}
      ]
    }
  },
}
</script>

<style lang="less" scoped>

</style>
