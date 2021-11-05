<template>
  <div class="mheight wp">
    <div class="con_nofound">
      <div class="Title">
        <span class="bigTitle">404!</span>
        <span class="subTitle">你访问的页面不存在</span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "404",
    head() {
      return {
        title: "页面不存在 - EasyAPI服务平台",
        meta: [
          { hid: "description", name: "description", content: "页面不存在" },
          { hid: "keyword", name: "keyword", content: "页面不存在" }
        ]
      };
    }
  };
</script>

<style lang="less" scoped>

</style>
