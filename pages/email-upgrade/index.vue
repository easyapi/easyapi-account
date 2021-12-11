<template>
  <div class="main">
    <div class="form">
      <div class="headline">邮箱升级</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="" prop="email">
          <el-input placeholder="请输入原邮箱账号" v-model="ruleForm.email">
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input placeholder="请输入原邮箱密码" type="password" v-model="ruleForm.password">
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="mobile">
          <el-input placeholder="请输入新手机号码" maxlength="11" v-model="ruleForm.mobile">
            <template slot="prepend">+&nbsp;</template>
            <el-select v-model="ruleForm.areaCode" filterable allow-create slot="prepend" style="width:80px;">
              <el-option v-for="item in areaCodes" :key="item.value" :value="item.value">
                {{ item.label }}（+{{ item.value }}）
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="code">
          <el-input class="code" placeholder="请输入验证码" maxlength="6" onkeyup="value=value.replace(/[^\d]/g,'')"
                    v-model="ruleForm.code"></el-input>
          <el-button class="getCode" :disabled="sendCodeBtn" @click="sendCode">{{sendCodeCount}}</el-button>
        </el-form-item>
        <el-button style="width: 100%" type="primary" :disabled="disabled" @click="onSubmit">升级</el-button>
      </el-form>

      <div class="other-box">
        <nuxt-link to="/login">我已升级成功，直接登录</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import Index from './index.js'

export default Index
</script>
