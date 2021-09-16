<template>
  <div style="margin: 0 0 100px 0">
    <div class="toper">
      <div class="wp">
        <a href="https://www.easyapi.com/"><img class="logo pl" src="https://static.easyapi.com/images/logo.png" alt=""/></a>
        <div class="navs pr">
          <a href="./login">登录</a>
          <a href="./signup">注册</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped lang="less">
.footer {
  text-align: center;
  background: #fafafa;
  color: #777;
  margin: 20px 0 0 0;
  padding: 70px 0 50px 0;
  font-size: 12px;
}

.footer p {
  margin-bottom: 10px;
}

.footer a {
  color: #777;
  padding: 0 20px;
}
</style>
