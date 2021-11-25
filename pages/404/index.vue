<template>
  <el-row class="main">
    <el-col :span="12" :offset="6">
      <div class="error">
        <span class="title">404!</span>
        <span class="subtitle">你访问的页面不存在</span>
      </div>
    </el-col>
  </el-row>
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
