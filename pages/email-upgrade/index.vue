<script lang="ts">
import { reactive } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { ElMessage } from 'element-plus'
import { isValidPhoneNumber } from 'libphonenumber-js'
import emailVerify, { areaCodes } from '@/utils/area-code'
import email from '@/api/email'
import signup from '@/api/signup'

export default defineComponent({
  setup() {
    useHead({ title: '邮箱升级 - EasyAPI服务平台' })
    const validPhoneNumber = (rule: any, value: any, callback: any) => {
      if (isValidPhoneNumber(value, data.formData.country))
        callback()
      else
        callback(new Error('手机号码格式有误'))
    }
    const validEmail = (rule: any, value: any, callback: any) => {
      if (emailVerify(value))
        callback()
      else
        callback(new Error('邮箱格式错误'))
    }
    const data = reactive({
      areaCodes,
      disabled: true,
      sendCodeBtn: false,
      sendCodeCount: '获取验证码',
      ruleForm: null,
      formData: {
        areaCode: 86,
        country: 'CN',
        email: '',
        mobile: '',
        code: '',
        password: '',
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱账号', trigger: 'blur' },
          { validator: validEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validPhoneNumber, trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '验证码格式有误', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码6~16位之间,建议包含英文和标点符号', trigger: 'blur' },
          { min: 6, max: 16, message: '密码6~16位之间,建议包含英文和标点符号', trigger: 'blur' },
        ],
      },
    })

    watch(
      () => data.formData,
      () => {
        data.disabled = !(
          emailVerify(data.formData.email)
          && isValidPhoneNumber(data.formData.mobile, data.formData.country)
          && data.formData.password.length >= 6
          && data.formData.code.length === 6
        )
      },
      { deep: true },
    )

    const upgradeEmail = () => {
      const from = useCookies().get('from')
      email.upgradeEmail(data.formData).then((res) => {
        if (res.code === 1) {
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
    return {
      ...toRefs(data),
      sendCode,
      upgradeEmail,
    }
  },
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
          <el-input
            v-model="formData.password"
            placeholder="请输入原邮箱密码"
            type="password"
          />
        </el-form-item>
        <el-form-item label="" prop="mobile">
          <el-input
            v-model="formData.mobile"
            placeholder="请输入新手机号码"
            maxlength="11"
          >
            <template> +&nbsp;</template>
            <el-select
              v-model="formData.areaCode"
              filterable
              allow-create
              style="width: 80px"
            >
              <el-option
                v-for="item in areaCodes"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}(+{{ item.value }})
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="code">
          <el-input
            v-model="formData.code"
            class="code"
            placeholder="请输入验证码"
            maxlength="6"
            onkeyup="value=value.replace(/[^\d]/g,'')"
          >
            <template #append>
              <el-button :disabled="sendCodeBtn" class="getCode" @click="sendCode">
                {{ sendCodeCount }}
              </el-button>
            </template>
          </el-input>
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
