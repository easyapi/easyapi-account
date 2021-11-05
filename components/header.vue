<template>
  <div class="header">
    <div class="header-wp">
      <a href="https://www.easyapi.com/">
        <img class="logo" src="https://static.easyapi.com/images/logo.png" alt=""/>
      </a>
      <div class="">
        <a href="./login">登录</a>
        <a href="./signup">注册</a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Header"
  };
</script>

<style scoped lang="scss">
  .header {
    width: 100%;
    height: 72px;
    background-color: #18c1d6;

    .header-wp {
      padding: 0 20px;
      height: 72px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .logo {
        width: 160px;
      }

      a {
        color: #ffffff;
      }
    }
  }
</style>
