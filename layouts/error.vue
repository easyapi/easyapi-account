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
    layout: "default"
  };
</script>

<style lang="less" scoped>

</style>
