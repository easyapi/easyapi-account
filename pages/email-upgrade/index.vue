<script>
import { onUpdated, reactive } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { ElMessage } from 'element-plus'
import { isValidPhoneNumber } from 'libphonenumber-js'
import email from '@/api/email'




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
        country: undefined,
        username: '',
        email: '',
        mobile: '',
        code: '',
        password: ''
      },
      emailRegex: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, //邮箱正则表达式
      rules: {
        email: [
          { required: true, message: '请输入邮箱账号', trigger: 'blur' },
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: '邮箱账号格式有误',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '验证码格式有误', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码6~16位之间,建议包含英文和标点符号', trigger: 'blur' },
          { min: 6, max: 16, message: '密码6~16位之间,建议包含英文和标点符号', trigger: 'blur' }
        ]
      }
    })

    onUpdated(() => {
      //校验
      data.disabled = !(
        data.emailRegex.test(data.formData.email) &&
        isValidPhoneNumber(data.formData.mobile, data.formData.country) &&
        data.formData.password.length >= 6 &&
        data.formData.code.length === 6
      )
    })
    const upgradeEmail=()=> {
      const from = useCookies().get('from')
      email.upgradeEmail(data.formData)
        .then(res => {
          if (res.data.code === 1) {
            ElMessage.success(res.data.message)
            setTimeout(() => {
              useCookies().remove('from')
              window.location.replace(from)
            }, 1000)
          } else {
            ElMessage.error(res.data.message)
          }
        })
        .catch(error => {
          ElMessage.error(error.response.data.message)
        })
    }

    const sendCode=()=> {
      const telStr = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (telStr.test(data.formData.mobile)) {
        const params = {
          mobile: data.formData.mobile
        }
        email.upgradeEmail(params)
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
        const second = 60
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
      upgradeEmail
    }
  }
})
</script>
<template>
  <div class="main">
    <div class="form">
      <div class="headline">
        邮箱升级
      </div>
      <el-form ref="ruleForm" :model="formData" :rules="rules">
        <el-form-item label="" prop="email">
          <el-input v-model="formData.email" placeholder="请输入原邮箱账号" />
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input v-model="formData.password" placeholder="请输入原邮箱密码" type="password" />
        </el-form-item>
        <el-form-item label="" prop="mobile">
          <el-input v-model="formData.mobile" placeholder="请输入新手机号码" maxlength="11">
            <template slot="prepend">
              +&nbsp;
            </template>
            <el-select slot="prepend" v-model="formData.areaCode" filterable allow-create style="width: 80px">
              <el-option v-for="item in areaCodes" :key="item.value" :value="item.value">
                {{ item.label }}(+{{ item.value }})
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="code">
          <el-input v-model="formData.code" class="code" placeholder="请输入验证码" maxlength="6"
            onkeyup="value=value.replace(/[^\d]/g,'')" />
          <el-button :disabled="sendCodeBtn" class="getCode" @click="sendCode">{{ sendCodeCount }}</el-button>
        </el-form-item>
        <el-button style="width: 100%" type="primary" :disabled="disabled" @click="upgradeEmail">
          升级
        </el-button>
      </el-form>

      <div class="other-box">
        <nuxt-link to="/login">
          我已升级成功，直接登录
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@import url(./index.scss);
</style>

