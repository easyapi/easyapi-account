<template>
  <div class="main">
    <div class="form">
      <div class="headline">用户注册</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="" prop="username">
          <el-input placeholder="请输入手机号码" maxlength="11" v-model="ruleForm.username" @blur="findUsername">
            <template slot="prepend">+&nbsp;</template>
            <el-select v-model="ruleForm.areaCode" filterable allow-create slot="prepend" style="width: 80px">
              <el-option v-for="item in areaCodes" :key="item.value" :value="item.value">{{ item.label }}（+{{ item.value
              }}）</el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="code">
          <el-input placeholder="请输入验证码" maxlength="6" onkeyup="value=value.replace(/[^\d]/g,'')" v-model="ruleForm.code"
            class="code"></el-input>
          <el-button :disabled="sendCodeBtn" class="getCode" @click="sendCode">{{ sendCodeCount }}</el-button>
        </el-form-item>
        <el-form-item label="" prop="nickname">
          <el-input placeholder="请输入姓名" v-model="ruleForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input placeholder="请设置密码" type="password" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="" prop="confirmPassword">
          <el-input placeholder="请再输入一次密码" type="password" v-model="ruleForm.confirmPassword"></el-input>
        </el-form-item>
        <el-checkbox class="checkbox" v-model="ruleForm.checked">
          点击注册表示您同意
          <span class="text-success"><a href="/terms" target="_blank">《EasyAPI服务条款》</a></span>
        </el-checkbox>
        <el-button style="width: 100%" type="primary" :disabled="disabled" id="btn_sub" @click="signup"
          class="btn-block btn btn-lg btn-info">注 册</el-button>
      </el-form>
      <div class="other-box">
        <nuxt-link to="/login">我已有EasyAPI账号，直接登录</nuxt-link>
      </div>
    </div>
  </div>
</template>

<!-- <script setup lang="ts">
import Index from './index.js'
import { getCurrentInstance, onMounted, onUpdated, reactive } from 'vue'

const useData = () => data
const { proxy: $vm } = getCurrentInstance()

const data = reactive({
  //areaCodes,
  disabled: true,
  sendCodeBtn: true, //默认不可以发送验证码
  existUsername: false, //默认用户名不存在
  sendCodeCount: '获取验证码',
  ruleForm: {
    areaCode: 86,
    country: 'CN',
    username: '',
    code: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    checked: true
  },
  rules: {
    username: [
      { required: true, message: '请输入手机号码', trigger: 'blur' },
      { validator: validPhoneNumber, trigger: 'blur' }
    ],
    code: [
      { required: true, message: '请输入验证码', trigger: 'blur' },
      { pattern: /^\d{6}$/, message: '验证码格式有误', trigger: 'blur' }
    ],
    nickname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 16, message: '密码6~16位之间，建议包含英文和标点符号', trigger: 'blur' }
    ],
    confirmPassword: [{ required: true, message: '请再输入一次密码', trigger: 'blur' }]
  }
})

onMounted(() => {
  from(this)
})

onUpdated(() => {
  data.disabled = !(
    isValidPhoneNumber(data.ruleForm.username, data.ruleForm.country) &&
    data.ruleForm.password.length >= 6 &&
    data.ruleForm.confirmPassword.length >= 6 &&
    data.ruleForm.nickname !== '' &&
    data.ruleForm.code !== '' &&
    data.ruleForm.checked
  )
})

function signup() {
  let that = this
  if (that.existUsername) {
    that.$message.error('该账号已注册，请直接登录')
    return
  }
  if (that.ruleForm.password !== that.ruleForm.confirmPassword) {
    that.$message.error('确认密码不一致')
    return
  }
  if (!that.ruleForm.checked) {
    that.$message.error('请勾选同意EasyAPI用户协议')
    return
  }
  let from = useCookies().get('from')
  signup(that.ruleForm, this)
    .then(res => {
      if (res.data.code === 1) {
        useCookies().set('authenticationToken', res.data.content, {
          expires: that.ruleForm.rememberMe ? 30 : 0.1,
          path: '/',
          domain: useCookies().get('domain')
        })
        that.$message.success(res.data.message)
        setTimeout(() => {
          useCookies().remove('from')
          window.location.replace(from)
        }, 1000)
      } else {
        that.$message.error(res.data.message)
      }
    })
    .catch(error => {
      that.$message.error(error.response.data.message)
    })
}

function sendCode() {
  if (data.sendCodeBtn) {
    return
  }
  let that = this
  let timer
  sendCode({ mobile: that.ruleForm.username }, this)
    .then(res => {
      if (res.data.code === 1) {
        that.$message.success('验证码发送成功')
        let second = 60
        that.sendCodeBtn = true
        timer = setInterval(() => {
          second--
          if (second === 0) {
            that.sendCodeBtn = false
            that.sendCodeCount = '获取验证码'
            clearInterval(timer)
            return
          }
          that.sendCodeCount = `剩余${second}秒`
        }, 1000)
      } else {
        that.$message.error(res.data.message)
      }
    })
    .catch(error => {
      that.$message.error(error.response.data.message)
    })
}

function findUsername() {
  findUsername({ username: data.ruleForm.username }, this)
    .then(res => {
      data.existUsername = true
      /* Warn: Unknown source: $message */
      $vm.$message.error('该账号已注册，请直接登录')
    })
    .catch(error => {
      data.sendCodeBtn = false
    })
}
</script> -->
