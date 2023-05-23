<script lang="ts">
import { getCurrentInstance, onUpdated, reactive } from 'vue'
import forget from '@/api/forget-password'
import signup from '@/api/signup'
import { areaCodes } from '../../utils/area-code'
import { ElMessage } from 'element-plus'

export default defineComponent({
  setup() {
    const data = reactive({
      areaCodes,
      disabled: true,
      sendCodeBtn: false,
      sendCodeCount: '获取验证码',
      ruleForm: null,
      formData: {
        areaCode: 86,
        username: '',
        code: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        username: [{
          required: true,
          message: '请输入手机号码',
          trigger: 'blur'
        },
        {
          pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
          message: '手机号码格式有误',
          trigger: 'blur'
        }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '验证码格式有误', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码6~16位之间,建议包含英文和标点符号', trigger: 'blur' },
          { min: 6, max: 16, message: '密码6~16位之间,建议包含英文和标点符号', trigger: 'blur' }
        ],
        confirmPassword: [{ required: true, message: '请再输入一次密码', trigger: 'blur' }]
      }
    })

    onUpdated(() => {
      // 校验
      data.disabled = !(
        data.formData.username !== '' &&
        data.formData.code !== '' &&
        data.formData.password.length >= 6 &&
        data.formData.confirmPassword.length >= 6
      )
    })

    function forgetPassword() {
      /* Warn: Cannot find refs name */
      let { ctx } = getCurrentInstance() as any
      ctx.$refs['ruleForm'].validate((valid: any) => {
        if (valid) {
          if (data.formData.password !== data.formData.confirmPassword) {
            ElMessage.error('确认密码不一致')
            return
          }
          forget.forgetPasswordApi({}).then(res => {
            if (res.data.code !== 1) {
              ElMessage.error(res.data.message)
              return
            }
            ElMessage.success(res.data.message)
            setTimeout(() => {
              window.location.replace('/login')
            }, 1000)
          }).catch(error => {
            ElMessage.error(error.response.data.message)
          })
        }
      })
    }

    const sendCode = () => {
      const telStr = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (telStr.test(data.formData.username)) {
        const params = {
          mobile: data.formData.username
        }
        signup.sendCodeFn(params)
          .then(res => {
            if (res.data.code === 1) {
              ElMessage.success(res.data.message)
            } else {
              ElMessage.error(res.data.message)
            }
          })
          .catch(error => {
            ElMessage.error(error.response.data.message)
          })
        let second = 60
        data.sendCodeBtn = true
        let timer = setInterval(() => {
          second--
          if (second === 0) {
            data.sendCodeBtn = false
            data.sendCodeCount = '获取验证码'
            clearInterval(timer)
            return
          }
          data.sendCodeCount = `剩余${second}秒`
        }, 1000)
      } else {
        ElMessage.error('请输入正确的手机号码')
      }
    }
    return {
      ...toRefs(data),
      sendCode,
      forgetPassword,
    }
  }
})
</script>
<template>
  <div id="app">
    <div class="main">
      <div class="form">
        <div class="headline">重置密码</div>
        <el-form :model="formData" :rules="rules" ref="ruleForm">
          <el-form-item label="" prop="username">
            <el-input placeholder="请输入手机号码" maxlength="11" v-model="formData.username">
              <template slot="prepend">+&nbsp;</template>
              <el-select v-model="formData.areaCode" filterable allow-create slot="prepend" style="width: 80px">
                <el-option v-for="item in areaCodes" :key="item.value" :value="item.value">{{ item.label }}(+{{ item.value
                }})</el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="code">
            <el-input placeholder="请输入验证码" maxlength="6" onkeyup="value=value.replace(/[^\d]/g,'')"
              v-model="formData.code" class="code" />
            <el-button :disabled="sendCodeBtn" class="getCode" @click="sendCode">{{ sendCodeCount }}</el-button>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input placeholder="请输入新密码" type="password" v-model="formData.password"></el-input>
          </el-form-item>
          <el-form-item label="" prop="confirmPassword">
            <el-input placeholder="请再输入一次密码" type="password" v-model="formData.confirmPassword"></el-input>
          </el-form-item>
          <el-button style="width: 100%" type="primary" :disabled="disabled" @click="forgetPassword">确定</el-button>
        </el-form>
        <div class="other-box">
          <nuxt-link to="/login" class="login">返回登录</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>
