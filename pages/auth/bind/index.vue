<script>
import { useHead } from '@unhead/vue'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { ElMessage } from 'element-plus'
import { onMounted, toRefs } from 'vue'
import { useCookie } from 'nuxt/app'
import { setToken } from '../../../utils/token'
import bind from '@/api/bind'
import user from '@/api/user'

export default defineComponent({
  setup() {
    useHead({ title: '用户绑定 - EasyAPI服务平台' })
    const validPhoneNumber = (rule, value, callback) => {
      if (isValidPhoneNumber(value, data.ruleForm.country))
        callback()
      else
        callback(new Error('手机号码格式有误'))
    }
    const route = useRoute()
    const data = reactive({
      areaCodes,
      disabled: true,
      imageSrc: '',
      providerUserId: '',
      providerId: '',
      options: [],
      ruleRef: null,
      ruleForm: {
        areaCode: 86,
        country: 'CN',
        username: '',
        password: '',
        rememberMe: true,
      },
      rules: {
        username: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validPhoneNumber, trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码6~16位之间,建议包含英文和标点符号', trigger: 'blur' },
          { min: 6, max: 16, message: '密码6~16位之间,建议包含英文和标点符号', trigger: 'blur' },
        ],
      },
    })

    watch(
      () => data.ruleForm,
      () => {
        data.disabled = !(isValidPhoneNumber(data.ruleForm.username, data.ruleForm.country) && data.ruleForm.password.length >= 6)
      },
      { deep: true },
    )

    const bindPost = () => {
      const from = useCookie('from').value
      const params = {
        providerUserId: data.providerUserId,
        providerId: data.providerId,
      }
      bind.postBind(params).then((res) => {
        if (res.code !== 1) {
          ElMessage.error(res.message)
          return
        }
        window.location.replace(from)
      })
    }

    const loginPost = () => {
      user.login(data.ruleForm).then((res) => {
        if (res.code === 1) {
          setToken(res.content.idToken, data.ruleForm.rememberMe)
          bindPost()
          ElMessage.success('绑定成功')
        }
      })
    }

    onMounted(() => {
      const providerUserId = route.query.providerUserId
      const providerId = route.query.providerId
      if (providerUserId && providerId) {
        data.providerUserId = providerUserId
        data.providerId = providerId
      }

      if (providerId === 'qq')
        data.imageSrc = new URL('@/assets/svg/qq.svg', import.meta.url).href
      else
        data.imageSrc = new URL('@/assets/svg/weixin.svg', import.meta.url).href
    })

    return {
      ...toRefs(data),
      loginPost,
    }
  },
})
</script>

<template>
  <div class="main">
    <div class="form">
      <div class="headline">
        绑定账号
      </div>
      <div class="lg-subtitle mb-10">
        第一次使用
        <span>{{ providerId === 'wechat' ? '微信' : 'QQ' }}</span>
        帐号登录，您需要填写账号和密码，以后您也可以使用此账号和密码登录
      </div>
      <div class="auth mb-10">
        <img class="image-png" :src="imageSrc" alt="">
        <img
          class="image-svg"
          src="@/assets/svg/bind.svg"
          alt=""
        >
        <img
          class="image-png"
          src="@/assets/images/easyapi.png"
          alt=""
        >
      </div>
      <el-form ref="ruleRef" :model="ruleForm" :rules="rules">
        <el-form-item label="" prop="username">
          <el-input
            v-model="ruleForm.username"
            size="large"
            placeholder="请输入手机号码"
            class="input-with-select"
            maxlength="11"
          >
            <template> +&nbsp; </template>
            <el-select
              v-model="ruleForm.areaCode"
              filterable
              allow-create
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
        <el-form-item label="" prop="password">
          <el-input
            v-model="ruleForm.password"
            type="password"
            size="large"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-checkbox v-model="ruleForm.rememberMe" class="checkbox" checked>
          记住密码
        </el-checkbox>
        <el-button
          id="btn_sub"
          size="large"
          type="primary"
          :disabled="disabled"
          class="btn-block btn btn-lg btn-info w-ful"
          @click="loginPost"
        >
          绑定账号
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss">
@import url(./index.scss);
</style>
