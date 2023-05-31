<script>
import { onMounted, reactive } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { ElMessage } from 'element-plus'
import { areaCodes } from '../../utils/area-code'
import userStore from '@/store/user'

import login from '~/api/login'

export default defineComponent({
  setup() {
    useHead({ title: '登录 - EasyAPI服务平台' })
    const store = userStore()
    const data = reactive({
      areaCodes,
      disabled: true,
      ruleForm: {
        areaCode: 86,
        username: '',
        password: '',
        rememberMe: false,
      },
      rules: {
        username: [
          { required: true, message: '请输入您注册时手机号码', trigger: 'blur' },
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
    })

    onMounted(() => {
      // from()
      if (useCookies().get('username') != null) {
        // 从Cookie中获取登录账号
        data.ruleForm.username = useCookies().get('username')
      }
    })

    watch(
      () => data.ruleForm,
      () => {
        data.disabled = !(
          data.ruleForm.username !== '' && data.ruleForm.password && data.ruleForm.password.length >= 6
        )
      },
      { deep: true },
    )

    /**
     * 登录
     */
    function register() {
      const options = {
        path: '/',
        secure: true,
        sameSite: 'none',
      }
      useCookies().set('username', data.ruleForm.username, options)
      const params = sessionStorage.getItem('params')
      const auth = sessionStorage.getItem('auth')
      const from = useCookies().get('from')
      login.postLogin(data.ruleForm).then((res) => {
        if (res.code === 1) {
          useCookies().set('authenticationToken', res.content.idToken, {
            maxAge: data.ruleForm.rememberMe ? 60 * 60 * 24 * 30 : 1,
            path: '/',
            domain: useCookies().get('domain'),
          })
          store.getUser()
          if (params !== '' && auth === '三方登录') {
            const json = JSON.parse(params)
            window.location.href
              = `/auth/authorize?client_id=${json.client_id
              }&response_type=${json.response_type
              }&scope=${json.scope
              }&redirect_uri=${json.redirect_uri}`
          } else {
            setTimeout(() => {
              useCookies().remove('from')
              window.location.replace(from)
            }, 1000)
          }
          ElMessage.success(res.message)
        } else {
          ElMessage.error(res.message)
        }
      },
      )
    }
    return {
      ...toRefs(data),
      register,
    }
  },
})
</script>

<template>
  <div class="main">
    <div class="form">
      <div class="headline">
        用户登录
      </div>
      <el-form ref="refForm" :model="ruleForm" :rules="rules">
        <el-form-item label="" prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入手机号码">
            <template data.slot="prepend">
              +&nbsp;
            </template>
            <el-select
              v-model="ruleForm.areaCode"
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
            v-model="ruleForm.password"
            placeholder="请输入密码"
            type="password"
          />
        </el-form-item>
        <el-checkbox v-model="ruleForm.rememberMe" class="checkbox">
          记住密码
        </el-checkbox>
        <el-button :disabled="disabled" type="primary" @click="register">
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
          <img
            class="image-svg"
            src="@/assets/svg/weixin.svg"
            alt=""
          >
        </a>
        <a href="https://account-api.easyapi.com/auth/qq">
          <img
            class="image-svg"
            src="@/assets/svg/qq.svg"
            alt=""
          >
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import url(./index.scss);
</style>
