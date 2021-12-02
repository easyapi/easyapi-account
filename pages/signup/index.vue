<template>
  <div class="main">
    <div class="form">
      <div class="headline">用户注册</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="" prop="username">
          <el-input placeholder="请输入手机号码" maxlength="11" v-model="ruleForm.username"
                    @input="findUsername">
            <template slot="prepend">+&nbsp;</template>
            <el-select v-model="ruleForm.areaCode" filterable allow-create slot="prepend" style="width:80px;">
              <el-option v-for="item in areaCodes" :key="item.value" :value="item.value">
                {{ item.label }}（+{{ item.value }}）
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="code">
          <el-input placeholder="请输入验证码" maxlength="6" onkeyup="value=value.replace(/[^\d]/g,'')"
                    v-model="ruleForm.code" class="code"></el-input>
          <el-button :disabled="sendCodeBtn" class="getCode" @click="sendCode">{{ sendCodeCount }}</el-button>
        </el-form-item>
        <el-form-item label="" prop="nickname">
          <el-input placeholder="请输入姓名" v-model="ruleForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input placeholder="请设置密码" type="password" v-model="ruleForm.password">
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="confirmPassword">
          <el-input placeholder="请再输入一次密码" type="password" v-model="ruleForm.confirmPassword">
          </el-input>
        </el-form-item>
        <el-checkbox class="checkbox" v-model="ruleForm.checked">点击注册表示您同意
          <span class="text-success"><a href="terms" target="_blank">《EasyAPI服务条款》</a></span>
        </el-checkbox>
        <el-button style="width: 100%" type="primary" :disabled="disabled" id="btn_sub" @click="signup"
                   class="btn-block btn btn-lg btn-info">注 册
        </el-button>
      </el-form>
      <div class="other-box">
        <nuxt-link to="login">我已有EasyAPI账号，直接登录</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import Index from './index.js'

export default Index
</script>
