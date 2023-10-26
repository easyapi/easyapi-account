<script>
import { useHead } from '@unhead/vue'
import { onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useCookie } from 'nuxt/app'
import { areaCodes } from '../../utils/area-code'
import { setToken } from '../../utils/token'
import { from } from '@/utils/from'
import user from '@/api/user'
import userStore from '@/store/user'

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
      from()
      if (useCookie('username').value != null) {
        // 从Cookie中获取登录账号
        data.ruleForm.username = useCookie('username').value
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
    function login() {
      const options = {
        path: '/',
        secure: true,
        sameSite: 'none',
      }
      useCookie('username', options).value = data.ruleForm.username
      const params = sessionStorage.getItem('params')
      const auth = sessionStorage.getItem('auth')
      const from = useCookie('from').value

      user.login(data.ruleForm).then(async (res) => {
        if (res.code === 1) {
          ElMessage.success(res.message)
          await setToken(res.content.idToken, data.ruleForm.rememberMe)
          await store.getUser()
          setTimeout(() => {
            if (params !== '' && auth === '三方登录') {
              const json = JSON.parse(params)
              window.location.href
                = `/auth/authorize?client_id=${json.client_id
              }&response_type=${json.response_type
              }&scope=${json.scope
              }&redirect_uri=${json.redirect_uri}`
            }
            else {
              setTimeout(() => {
                window.location.replace(from)
                useCookie('from').value = null
              }, 1000)
            }
          }, 2000)
        }
        else {
          ElMessage.error(res.message)
        }
      },
      )
    }
    return {
      ...toRefs(data),
      login,
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
          <el-input v-model="ruleForm.username" size="large" placeholder="请输入手机号码">
            <template data.slot="prepend">
              +&nbsp;
            </template>
            <el-select v-model="ruleForm.areaCode" filterable allow-create data.slot="prepend">
              <el-option v-for="item in areaCodes" :key="item.value" :value="item.value">
                {{ item.label }}+{{ item.value }}
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input v-model="ruleForm.password" size="large" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-checkbox v-model="ruleForm.rememberMe" class="checkbox">
          记住密码
        </el-checkbox>
        <el-button size="large" :disabled="disabled" type="primary" class="w-ful" @click="login">
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
          <img class="image-svg" src="@/assets/svg/weixin.svg" alt="">
        </a>
        <a href="https://account-api.easyapi.com/auth/qq">
          <img class="image-svg" src="@/assets/svg/qq.svg" alt="">
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import url(./index.scss);
</style>
