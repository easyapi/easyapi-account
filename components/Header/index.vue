<template>
  <el-row class="header">
    <el-col :span="24" class="header-wp">
      <a href="https://www.easyapi.com/">
        <img class="logo" src="https://qiniu.easyapi.com/market/logo.svg" alt=""/>
      </a>
      <div class="buttons">
        <nuxt-link to="/login">登录</nuxt-link>
        <nuxt-link to="/signup">注册</nuxt-link>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Header"
};
</script>
