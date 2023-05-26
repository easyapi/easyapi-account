<script lang="ts">
export default {
  name: 'RenewSuccess',
  head() {
    return {
      title: '续费成功 - EasyAPI',
      meta: [{ charset: 'utf-8' }, { hid: 'description', name: 'description', content: '续费成功' }, { hid: 'keyword', name: 'keyword', content: '续费成功' }],
    }
  },
}
</script>

<template>
  <div>
    <div class="max-w-screen-md text-center my-8 ml-auto mr-auto">
      <main>
        <img class="inline-block text-lg text-gray-100 mb-2" src="assets/images/success.png" alt="">
        <h2>续费成功，谢谢！</h2>
      </main>
      <footer>
        <p class="text-sm">
          如果有任何问题，请发送邮件到leida@easyapi.com，或者微信13656171020处理，谢谢您的支持
        </p>
      </footer>
    </div>
  </div>
</template>

<style lang="scss">
@import url(./index.scss);
</style>
