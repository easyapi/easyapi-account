<script setup lang="ts">
// import Index from './index.js'
import { onMounted, onUpdated, reactive } from 'vue'

const data = reactive({
  areaCodes,
  disabled: true,
  ruleForm: {
    areaCode: 86,
    username: '',
    password: '',
    rememberMe: true,
  },
  rules: {
    username: [
      { required: true, message: '请输入您注册时手机号码', trigger: 'blur' },
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  },
})

onMounted(() => {
  from(this)
  if (Cookie().get('username') != null) {
    // 从Cookie中获取登录账号
    data.ruleForm.username = useCookie().get('username')
  }
})

onUpdated(() => {
  data.disabled = !(
    data.ruleForm.username !== '' && data.ruleForm.password.length >= 6
  )
})

function login(this: any) {
  const that = this
  const options = {
    path: '/',
    secure: true,
    sameSite: 'none',
  }
  useCookie().set('username', that.ruleForm.username, options)
  const params = sessionStorage.getItem('params')
  const auth = sessionStorage.getItem('auth')
  const from = useCookie().get('from')
  login(that.ruleForm, this)
    .then(
      (res: {
        data: { code: number; content: { idToken: any }; message: any }
      }) => {
        if (res.data.code === 1) {
          useCookie().set('authenticationToken', res.data.content.idToken, {
            expires: that.ruleForm.rememberMe ? 30 : 0.1,
            path: '/api/service',
            domain: useCookie().get('domain'),
          })
          if (params !== '' && auth === '三方登录') {
            const json = JSON.parse(params)
            window.location.href
              = `/auth/authorize?client_id=${
               json.client_id
               }&response_type=${
               json.response_type
               }&scope=${
               json.scope
               }&redirect_uri=${
               json.redirect_uri}`
          } else {
            setTimeout(() => {
              useCookie().remove('from')
              window.location.replace(from)
            }, 1000)
          }
          that.$message.success(res.data.message)
        } else {
          that.$message.error(res.data.message)
        }
      },
    )
    .catch((error: { response: { data: { message: any } } }) => {
      that.$message.error(error.response.data.message)
    })
}
</script>

<template>
  <div class="main">
    <div class="form">
      <div class="headline">
        用户登录
      </div>
      <el-form ref="ruleForm" :model="data.ruleForm" :rules="data.rules">
        <el-form-item label="" prop="username">
          <el-input
            v-model="data.ruleForm.username"
            placeholder="请输入手机号码"
          >
            <template data.slot="prepend">
              +&nbsp;
            </template>
            <el-select
              v-model="data.ruleForm.areaCode"
              style="width: 80px"
              filterable
              allow-create
              data.slot="prepend"
            >
              <el-option
                v-for="item in areaCodes"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}+{{ item.value }}
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            v-model="data.ruleForm.password"
            placeholder="请输入密码"
            type="password"
          />
        </el-form-item>
        <el-checkbox v-model="data.ruleForm.rememberMe" class="checkbox">
          记住密码
        </el-checkbox>
        <el-button
          style="width: 100%"
          :disabled="data.disabled"
          type="primary"
          @click="login"
        >
          登录
        </el-button>
      </el-form>
      <div class="other-box">
        <nuxt-link to="/signup" class="signup">
          立即注册
        </nuxt-link>
        <nuxt-link to="/email-upgrade">
          邮箱升级为手机号码
        </nuxt-link>
        <nuxt-link to="/forget-password" class="forget-password">
          忘记密码？
        </nuxt-link>
      </div>
      <div class="other-login">
        <a href="https://account-api.easyapi.com/auth/wechat">
          <img class="image-svg" src="../../static/svg/weixin.svg" alt="">
        </a>
        <a href="https://account-api.easyapi.com/auth/qq">
          <img class="image-svg" src="../../static/svg/qq.svg" alt="">
        </a>
      </div>
    </div>
  </div>
</template>
