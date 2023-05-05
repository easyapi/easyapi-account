<script>
import Index from './index.js'

export default Index
</script>

<template>
  <div class="main">
    <div class="form">
      <div class="headline">
        用户注册
      </div>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
        <el-form-item label="" prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入手机号码" maxlength="11" @blur="findUsername">
            <template slot="prepend">
              +&nbsp;
            </template>
            <el-select slot="prepend" v-model="ruleForm.areaCode" filterable allow-create style="width: 80px">
              <el-option v-for="item in areaCodes" :key="item.value" :value="item.value">
                {{ item.label }}（+{{ item.value }}）
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="code">
          <el-input v-model="ruleForm.code" placeholder="请输入验证码" maxlength="6" onkeyup="value=value.replace(/[^\d]/g,'')" class="code" />
          <el-button :disabled="sendCodeBtn" class="getCode" @click="sendCode">
            {{ sendCodeCount }}
          </el-button>
        </el-form-item>
        <el-form-item label="" prop="nickname">
          <el-input v-model="ruleForm.nickname" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input v-model="ruleForm.password" placeholder="请设置密码" type="password" />
        </el-form-item>
        <el-form-item label="" prop="confirmPassword">
          <el-input v-model="ruleForm.confirmPassword" placeholder="请再输入一次密码" type="password" />
        </el-form-item>
        <el-checkbox v-model="ruleForm.checked" class="checkbox">
          点击注册表示您同意
          <span class="text-success"><a href="/terms" target="_blank">《EasyAPI服务条款》</a></span>
        </el-checkbox>
        <el-button id="btn_sub" style="width: 100%" type="primary" :disabled="disabled" class="btn-block btn btn-lg btn-info" @click="signup">
          注 册
        </el-button>
      </el-form>
      <div class="other-box">
        <nuxt-link to="/login">
          我已有EasyAPI账号，直接登录
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
