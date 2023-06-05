<script lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { areaCodes } from '../../utils/area-code'
import forget from '@/api/forget-password'
import signup from '@/api/signup'

export default defineComponent({
  setup() {
    useHead({ title: '忘记密码 - EasyAPI服务平台' })
    const validPhoneNumber = (rule: any, value: any, callback: any) => {
      if (isValidPhoneNumber(value, data.formData.country))
        callback()
      else
        callback(new Error('手机号码格式有误'))
    }
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
        confirmPassword: '',
        country: 'CN',
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur',
          },
          { validator: validPhoneNumber, trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '验证码格式有误', trigger: 'blur' },
        ],
        password: [
          {
            required: true,
            message: '密码6~16位之间，建议包含英文和标点符号',
            trigger: 'blur',
          },
          {
            min: 6,
            max: 16,
            message: '密码6~16位之间，建议包含英文和标点符号',
            trigger: 'blur',
          },
        ],
        confirmPassword: [
          { required: true, message: '请再输入一次密码', trigger: 'blur' },
        ],
      },
    })

    watch(
      () => data.formData,
      () => {
        // 校验
        data.disabled = !(
          data.formData.username !== ''
          && data.formData.code !== ''
          && data.formData.password.length >= 6
          && data.formData.confirmPassword.length >= 6
        )
      },
      { deep: true },
    )

    const forgetPassword = () => {
      data.ruleForm.validate((valid: any) => {
        if (!valid)
          return

        if (data.formData.password !== data.formData.confirmPassword) {
          ElMessage.error('确认密码不一致')
          return
        }
        forget.forgetPassword(data.formData).then((res) => {
          if (res.code !== 1) {
            ElMessage.error(res.message)
            return
          }
          ElMessage.success(res.message)
          setTimeout(() => {
            window.location.replace('/login')
          }, 1000)
        })
      })
    }

    const sendCode = () => {
      if (isValidPhoneNumber(data.formData.username, data.formData.country)) {
        const params = {
          mobile: data.formData.username,
        }
        signup.sendCode(params).then((res) => {
          if (res.code === 1)
            ElMessage.success(res.message)
          else
            ElMessage.error(res.message)
        })
        let second = 60
        data.sendCodeBtn = true
        const timer = setInterval(() => {
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
  },
})
</script>

<template>
  <div id="app">
    <div class="main">
      <div class="form">
        <div class="headline">
          重置密码
        </div>
        <el-form ref="ruleForm" :model="formData" :rules="rules">
          <el-form-item label="" prop="username">
            <el-input v-model="formData.username" size="large" placeholder="请输入手机号码" maxlength="11">
              <template slot="prepend">
                +&nbsp;
              </template>
              <el-select
                slot="prepend"
                v-model="formData.areaCode"
                filterable
                allow-create
              >
                <el-option v-for="item in areaCodes" :key="item.value" :value="item.value">
                  {{ item.label }}(+{{ item.value }})
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="code">
            <el-input
              v-model="formData.code"
              size="large"
              placeholder="请输入验证码"
              maxlength="6"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              class="code"
            >
              <template #append>
                <el-button :disabled="sendCodeBtn" class="getCode" @click="sendCode">
                  {{ sendCodeCount }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input v-model="formData.password" size="large" placeholder="请输入新密码" type="password" />
          </el-form-item>
          <el-form-item label="" prop="confirmPassword">
            <el-input v-model="formData.confirmPassword" size="large" placeholder="请再输入一次密码" type="password" />
          </el-form-item>
          <el-button class="w-full" size="large" type="primary" :disabled="disabled" @click="forgetPassword">
            确定
          </el-button>
        </el-form>
        <div class="other-box">
          <nuxt-link to="/login" class="login">
            返回登录
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.code {
  width: 350px !important;
}
</style>
