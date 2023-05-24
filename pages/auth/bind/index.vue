<script>
import {useCookies} from '@vueuse/integrations/useCookies'
import {isValidPhoneNumber} from 'libphonenumber-js'
import {ElMessage} from 'element-plus'
import bind from '@/api/bind'
import login from '@/api/login'

export default defineComponent({
  setup() {
    const route = useRoute()
    const data = reactive({
      areaCodes,
      disabled: true,
      imageSrc: '',
      providerUserId: '',
      providerId: '',
      options: [],
      ruleForm: {
        areaCode: 86,
        country: null,
        username: '',
        password: '',
        rememberMe: true,
      },
      rules: {
        username: [
          {required: true, message: '请输入手机号码', trigger: 'blur'},
          {validator: isValidPhoneNumber, trigger: 'blur'},
        ],
        password: [
          {required: true, message: '密码6~16位之间,建议包含英文和标点符号', trigger: 'blur'},
          {min: 6, max: 16, message: '密码6~16位之间,建议包含英文和标点符号', trigger: 'blur'},
        ],
      },
    })

    onUpdated(() => {
      data.disabled = !(isValidPhoneNumber(data.ruleForm.username, data.ruleForm.country) && data.ruleForm.password.length >= 6)
    })
    const bindPost = () => {
      const from = useCookies().get('from')
      const params = {
        providerUserId: data.providerUserId,
        providerId: data.providerId,
      }
      bind.postBind(params).then((res) => {
        if (res.data.code !== 1) {
          ElMessage.error(res.data.message)
          return
        }
        window.location.replace(from)
      })
    }

    const loginPost = () => {
      login.postLogin().then((res) => {
        if (res.data.code !== 1) {
          ElMessage.error(res.data.message)
        }
        useCookies().set('authenticationToken', res.data.content.idToken, {
          expires: data.ruleForm.rememberMe ? 30 : 0.1,
          path: '/',
          domain: useCookies().get('domain'),
        })
        bindPost()
        ElMessage.success('绑定成功')
      })
        .catch((error) => {
          ElMessage.error(error.response.data.message)
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
        data.imageSrc = new URL('@/assets/images/static/svg/qq.svg', import.meta.url).href
      else
        data.imageSrc = new URL('@/assets/images/static/svg/weixin.svg', import.meta.url).href
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
      <div class="ath mb-10">
        <img class="image-png" :src="imageSrc" alt="">
        <img class="image-svg" src="@/assets/images/static/svg/bind.svg" alt="">
        <img class="image-png" src="@/assets/images/static/easyapi.png" alt="">
      </div>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
        <el-form-item label="" prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入手机号码" class="input-with-select" maxlength="11">
            <template slot="prepend">
              +&nbsp;
            </template>
            <el-select slot="prepend" v-model="ruleForm.areaCode" filterable allow-create style="width: 80px">
              <el-option v-for="item in areaCodes" :key="item.value" :value="item.value">
                {{ item.label }}(+{{
                  item.value
                }})
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input v-model="ruleForm.password" type="password" placeholder="请输入密码"/>
        </el-form-item>
        <el-checkbox v-model="ruleForm.rememberMe" class="checkbox" checked>
          记住密码
        </el-checkbox>
        <el-button id="btn_sub" style="width: 100%" type="primary" :disabled="disabled"
                   class="btn-block btn btn-lg btn-info" @click="login">
          绑定账号
        </el-button>
      </el-form>
    </div>
  </div>
</template>
<style lang="scss">
@import url(./index.scss);
</style>
