<script lang="ts">
import { useHead } from '@unhead/vue'
import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useCookies } from '@vueuse/integrations/useCookies'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { from } from '~/utils/from'
import signup from '@/api/signup'
import { areaCodes } from '~/utils/area-code'

export default defineComponent({
  setup() {
    useHead({ title: '注册 - EasyAPI服务平台' })
    const validPhoneNumber = (rule: any, value: any, callback: any) => {
      if (isValidPhoneNumber(value, data.formData.country))
        callback()
      else
        callback(new Error('手机号码格式有误'))
    }
    const data = reactive({
      areaCodes,
      disabled: true,
      sendCodeBtn: true, // 默认不可以发送验证码
      existUsername: false, // 默认用户名不存在
      sendCodeCount: '获取验证码',
      ruleForm: null,
      formData: {
        areaCode: 86,
        country: 'CN',
        username: '',
        code: '',
        mobile: '',
        rememberMe: true,
        nickname: '',
        password: '',
        confirmPassword: '',
        checked: false,
      },
      rules: {
        username: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validPhoneNumber, trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '验证码格式有误', trigger: 'blur' },
        ],
        nickname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码6~16位之间,建议包含英文和标点符号', trigger: 'blur' },
        ],
        confirmPassword: [{ required: true, message: '请再输入一次密码', trigger: 'blur' }],
      },
    })

    onMounted(() => {
      from()
    })

    watch(
      () => data.formData,
      () => {
        data.disabled = !(
          isValidPhoneNumber(data.formData.username, data.formData.country)
          && data.formData.password.length >= 6
          && data.formData.confirmPassword.length >= 6
          && data.formData.nickname !== ''
          && data.formData.code !== ''
          && data.formData.checked
          && !data.existUsername
        )
      },
      { deep: true },
    )

    watch(
      () => data.existUsername,
      () => {
        data.disabled = !(
          isValidPhoneNumber(data.formData.username, data.formData.country)
          && data.formData.password.length >= 6
          && data.formData.confirmPassword.length >= 6
          && data.formData.nickname !== ''
          && data.formData.code !== ''
          && data.formData.checked
          && !data.existUsername
        )
      },
    )

    function enroll() {
      if (data.existUsername) {
        ElMessage.error('该账号已注册，请直接登录，')
        return
      }
      if (data.formData.password !== data.formData.confirmPassword) {
        ElMessage.error('确认密码不一致')
        return
      }
      if (!data.formData.checked) {
        ElMessage.error('请勾选同意EasyAPI用户协议')
        return
      }
      const from = useCookies().get('from')
      signup.signup(data.formData)
        .then((res) => {
          if (res.code === 1) {
            useCookies().set('authenticationToken', res.content, {
              maxAge: data.formData.rememberMe ? 60 * 60 * 24 * 30 : 1,
              path: '/',
              domain: useCookies().get('domain'),
            })
            ElMessage.success(res.message)
            setTimeout(() => {
              useCookies().remove('from')
              window.location.replace(from)
            }, 1000)
          } else {
            ElMessage.error(res.message)
          }
        })
    }

    /**
     * 发送验证码
     */
    const sendCode = () => {
      if (isValidPhoneNumber(data.formData.mobile, data.formData.country)) {
        const params = {
          mobile: data.formData.mobile,
        }
        signup.sendCode(params)
          .then((res) => {
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

    function findUsername() {
      signup.findUsername({ username: data.formData.username })
        .then((res) => {
          if (res.code === 1) {
            data.existUsername = true
            data.sendCodeBtn = true
            ElMessage.error('该账号已注册，请直接登录')
          } else {
            data.existUsername = false
            data.sendCodeBtn = false
          }
        })
        .catch(() => {
          data.existUsername = false
          data.sendCodeBtn = false
        })
    }

    return {
      ...toRefs(data),
      enroll,
      sendCode,
      findUsername,
    }
  },
})
</script>

<template>
  <div class="main">
    <div class="form">
      <div class="headline">
        用户注册
      </div>
      <el-form ref="ruleForm" :model="formData" :rules="rules">
        <el-form-item label="" prop="username">
          <el-input v-model="formData.username" size="large" placeholder="请输入手机号码" maxlength="11" @blur="findUsername" />
        </el-form-item>
        <el-form-item label="" prop="code">
          <el-input
            v-model="formData.code" placeholder="请输入验证码" size="large" maxlength="6"
            onkeyup="value=value.replace(/[^\d]/g,'')" class="code"
          >
            <template #append>
              <el-button :disabled="sendCodeBtn" class="getCode" @click="sendCode">
                {{ sendCodeCount }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="nickname">
          <el-input v-model="formData.nickname" size="large" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input v-model="formData.password" size="large" placeholder="请设置密码" type="password" />
        </el-form-item>
        <el-form-item label="" prop="confirmPassword">
          <el-input v-model="formData.confirmPassword" size="large" placeholder="请再输入一次密码" type="password" />
        </el-form-item>
        <el-checkbox v-model="formData.checked" class="checkbox">
          点击注册表示您同意
          <span class="text-success"><a href="/terms" target="_blank">《EasyAPI服务条款》</a></span>
        </el-checkbox>
        <el-button
          id="btn_sub" size="large" type="primary" :disabled="disabled"
          class="btn-block btn btn-lg btn-info w-full" @click="enroll"
        >
          注 册
        </el-button>
      </el-form>
      <div class="other-box">
        <nuxt-link to="/login">
          我已有EasyAPI账号,直接登录
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.code {
  width: 350px !important;
}

.text-success {
  color: #1bc0d5;
  margin-left: 5px;
}
</style>
