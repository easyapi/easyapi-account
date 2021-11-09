<template>
  <el-row class="header">
    <el-col :span="24" class="header-wp">
      <a href="https://www.easyapi.com/">
        <img class="logo" src="https://static.easyapi.com/images/logo.png" alt=""/>
      </a>
      <div class="">
        <a href="./login">登录</a>
        <a href="./signup">注册</a>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "Header"
  };
</script>

<style scoped lang="scss">

</style>
