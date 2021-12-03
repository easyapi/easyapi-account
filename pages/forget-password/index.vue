<template>
  <div id="app">
    <div class="main">
      <div class="form">
        <div class="headline">重置密码</div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="" prop="username">
            <el-input placeholder="请输入手机号码" maxlength="11" v-model="ruleForm.username">
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
          <el-form-item label="" prop="password">
            <el-input placeholder="请输入新密码" type="password" v-model="ruleForm.password">
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="confirmPassword">
            <el-input placeholder="请再输入一次密码" type="password" v-model="ruleForm.confirmPassword">
            </el-input>
          </el-form-item>
          <el-button style="width: 100%" type="primary" :disabled="disabled" @click="forgePassword">确定</el-button>
        </el-form>
        <div class="other-box">
          <nuxt-link to="login" class="login">返回登录</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Index from './index.js'

export default Index
</script>
