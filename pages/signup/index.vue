<template>
  <div class="main">
    <div class="form">
      <div class="headline">用户注册</div>
      <ElForm :model="formData" :rules="rules" ref="ruleForm">
        <ElFormItem label="" prop="username">
          <ElInput placeholder="请输入手机号码" maxlength="11" v-model="formData.username" @blur="findUsername">
            <template slot="prepend">+&nbsp;</template>
            <ElSelect v-model="formData.areaCode" filterable allow-create slot="prepend" style="width: 80px">
              <ElOption v-for="item in areaCodes" :key="item.value" :value="item.value">{{ item.label }}(+{{ item.value
              }})</ElOption>
            </ElSelect>
          </ElInput>
        </ElFormItem>
        <ElFormItem label="" prop="code">
          <ElInput placeholder="请输入验证码" maxlength="6" onkeyup="value=value.replace(/[^\d]/g,'')" v-model="formData.code"
            class="code"></ElInput>
          <ElButton :disabled="sendCodeBtn" class="getCode" @click="sendCode">{{ sendCodeCount }}</ElButton>
        </ElFormItem>
        <ElFormItem label="" prop="nickname">
          <ElInput placeholder="请输入姓名" v-model="formData.nickname"></ElInput>
        </ElFormItem>
        <ElFormItem label="" prop="password">
          <ElInput placeholder="请设置密码" type="password" v-model="formData.password"></ElInput>
        </ElFormItem>
        <ElFormItem label="" prop="confirmPassword">
          <ElInput placeholder="请再输入一次密码" type="password" v-model="formData.confirmPassword"></ElInput>
        </ElFormItem>
        <ElCheckbox class="checkbox" v-model="formData.checked">
          点击注册表示您同意
          <span class="text-success"><a href="/terms" target="_blank">《EasyAPI服务条款》</a></span>
        </ElCheckbox>
        <ElButton style="width: 100%" type="primary" :disabled="disabled" id="btn_sub" @click="signupFn"
          class="btn-block btn btn-lg btn-info">注 册</ElButton>
      </ElForm>
      <div class="other-box">
        <nuxt-link to="/login">我已有EasyAPI账号,直接登录</nuxt-link>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { getCurrentInstance, onMounted, onUpdated, reactive } from 'vue'
import signup from '@/api/signup'
import { ElMessage } from 'element-plus'
import { useCookies } from '@vueuse/integrations/useCookies'
import { isValidPhoneNumber } from 'libphonenumber-js'

export default defineComponent({
  setup() {
    const data = reactive({
      areaCodes,
      disabled: true,
      sendCodeBtn: true, //默认不可以发送验证码
      existUsername: false, //默认用户名不存在
      sendCodeCount: '获取验证码',
      ruleForm: null,
      formData: {
        areaCode: 86,
        country: undefined,
        username: '',
        code: '',
        rememberMe:0,
        nickname: '',
        password: '',
        confirmPassword: '',
        checked: true
      },
      rules: {
        username: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: isValidPhoneNumber, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '验证码格式有误', trigger: 'blur' }
        ],
        nickname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码6~16位之间,建议包含英文和标点符号', trigger: 'blur' }
        ],
        confirmPassword: [{ required: true, message: '请再输入一次密码', trigger: 'blur' }]
      }
    })

    onMounted(() => {
      from()
    })

    onUpdated(() => {
      data.disabled = !(
        isValidPhoneNumber(data.formData.username, data.formData.country) &&
        data.formData.password.length >= 6 &&
        data.formData.confirmPassword.length >= 6 &&
        data.formData.nickname !== '' &&
        data.formData.code !== '' &&
        data.formData.checked
      )
    })
    function signupFn() {
      if (data.existUsername) {
        ElMessage.error('该账号已注册，请直接登录');
        return 
      }
      if (data.formData.password !== data.formData.confirmPassword) {
        ElMessage.error('确认密码不一致');
        return 
      }
      if (!data.formData.checked) {
        ElMessage.error('请勾选同意EasyAPI用户协议');
        return 
      }
      let from = useCookies().get('from');
      signup.sendCode({})
        .then((res) => {
          if (res.data.code === 1) {
            useCookies().set('authenticationToken', res.data.content, {
              expires: data.formData.rememberMe ? 30 : 0.1,
              path: '/',
              domain: useCookies.get('domain')
            });
            ElMessage.success(res.data.message);
            setTimeout(() => {
              // useCookies.remove('from');
              window.location.replace(from);
            }, 1000);
          } else {
            ElMessage.error(res.data.message);
          }
        })
        .catch((error) => {
          ElMessage.error(error.response.data.message);
        });
    }
    return {
      ...toRefs(data),
      signupFn,
      //sendCode,
    }
  }
})
</script>
