<template>
  <el-row class="main">
    <el-col :span="12">
      <div class="Title">
        <span class="bigTitle">错误!</span>
        <span class="subTitle">您访问了错误的信息</span>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    props: ["error"],
    layout: "default",
    head() {
      return {
        title: "错误 - EasyAPI服务平台",
        meta: [
          { hid: "description", name: "description", content: "错误" },
          { hid: "keyword", name: "keyword", content: "错误" }
        ]
      };
    }
  };
</script>

<style lang="less" scoped>

</style>
