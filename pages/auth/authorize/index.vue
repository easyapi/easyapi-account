<template>
  <div class="authorize-main">
    <div class="authorize-header">
      授权登录
    </div>
    <div class="authorize-form-top">
      <div class="word_top">
        <span><<{{ client }}>> 想要访问你的账户信息</span>
      </div>
      <div class="word_bottom">
        <span>当前登录账号: {{ account }}</span>
      </div>
    </div>
    <div class="authorize-form-bottom">
      <div class="mg-b-10">
        <input name="user_oauth_approval" value="true" type="hidden">
        <input name="authorize" value="Authorize" type="hidden">
        <input name="scope.client" value="true" type="hidden">
        <el-button type="primary" class=" btn-block btn btn-lg btn-info" size="small" @click="authorization">
          授 权
        </el-button>
      </div>
      <div class="mg-b-10 mg-l-10">
        <input name="user_oauth_approval" value="true" type="hidden">
        <input name="authorize" value="Authorize" type="hidden">
        <input name="scope.client" value="false" type="hidden">
        <el-button class="btn_right_input" size="small" @click="cancel">取 消</el-button>
      </div>
    </div>
    <el-button class="btn_right_p" @click="changeUser" type="text">切换账号 ></el-button>
  </div>
</template>

<script>
import Index from "./index.js";

export default Index;
</script>
