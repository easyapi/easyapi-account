<template>
  <div class="main">
    <div class="form">
      <div class="headline ">用户登录</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="" prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入手机号码">
            <template slot="prepend">+&nbsp;</template>
            <el-select style="width: 80px" v-model="ruleForm.areaCode" filterable allow-create slot="prepend">
              <el-option v-for="item in areaCodes" :key="item.value" :value="item.value">
                {{ item.label }}（+{{ item.value }}）
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input v-model="ruleForm.password" placeholder="请输入密码" type="password">
          </el-input>
        </el-form-item>
        <el-checkbox class="checkbox" v-model="ruleForm.rememberMe">记住密码</el-checkbox>
        <el-button style="width: 100%" :disabled="disabled" type="primary" @click="login">登录</el-button>
      </el-form>
      <div class="other-box">
        <nuxt-link to="/signup" class="signup">立即注册</nuxt-link>
        <nuxt-link to="/email-upgrade">邮箱升级为手机号码</nuxt-link>
        <nuxt-link to="/forget-password" class="forget-password">忘记密码？</nuxt-link>
      </div>
      <div class="other-login">
        <a href="https://account-api.easyapi.com/auth/wechat"><i class="iconfont success icon-iconfontweixin"></i>
        </a>
        <a href="https://account-api.easyapi.com/auth/qq"><i class="iconfont icon-QQ"></i> </a>
      </div>
    </div>
  </div>
</template>

<script>
import Index from './index.js'

export default Index
</script>
