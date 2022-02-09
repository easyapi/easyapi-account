<template>
  <div class="main">
    <div class="form">
      <div class="word_top">
        <span>{{ client }} 想要访问你的账户信息</span>
      </div>
      <div class="word_bottom">
        <span>当前登录账号: {{ account }}</span>
      </div>
    </div>
    <div class="form">
      <form class="mg-b-10" action="https://account.easyapi.com/oauth/authorize" method="post">
        <input name="user_oauth_approval" value="true" type="hidden">
        <input name="authorize" value="Authorize" type="hidden">
        <input name="scope.client" value="true" type="hidden">
        <el-button type="primary" class=" btn-block btn btn-lg btn-info">授 权</el-button>
      </form>
      <form class="mg-b-10" action="https://account-api.easyapi.com/oauth/authorize" method="post">
        <input name="user_oauth_approval" value="true" type="hidden">
        <input name="authorize" value="Authorize" type="hidden">
        <input name="scope.client" value="false" type="hidden">
        <el-button class="btn_right_input">取 消</el-button>
      </form>
      <el-button class="btn_right_p" @click="changeUser">切换账号</el-button>
    </div>
  </div>
</template>

<script>
import Index from './index.js'

export default Index
</script>
