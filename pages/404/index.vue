<template>
  <div class="main">
    <el-col :span="12">
      <div class="Title">
        <span class="bigTitle">404!</span>
        <span class="subTitle">你访问的页面不存在</span>
      </div>
    </el-col>
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
