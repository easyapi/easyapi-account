<template>
  <el-row class="main">
    <el-col :span="12" :offset="6">
      <div class="error">
        <span class="title">403!</span>
        <span class="subtitle">访问被拒绝!</span>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "403",
    head() {
      return {
        title: "访问被拒绝 - EasyAPI服务平台",
        meta: [
          { hid: "description", name: "description", content: "访问被拒绝" },
          { hid: "keyword", name: "keyword", content: "访问被拒绝" }
        ]
      };
    }
  };
</script>

<style lang="less" scoped>

</style>
