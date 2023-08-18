<script>
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import auth from '@/api/auth'
import { getToken } from "../../../utils/token";

export default defineComponent({
  setup() {
    useHead({ title: '授权 - EasyAPI服务平台' })
    const route = useRoute()
    const data = reactive({
      account: '',
      client: '',
    })

    const authorization = () => {
      auth.oauthAuthorize(
        qs.stringify({
          'user_oauth_approval': true,
          'authorize': 'Authorize',
          'scope.client': true,
        }),
      ).then()
    }
    const cancel = () => {
      auth.oauthAuthorize(
        qs.stringify({
          'user_oauth_approval': true,
          'authorize': 'Authorize',
          'scope.client': false,
        }),
      ).then()
    }

    const changeUser = () => {
      // 添加三方登录标识
      sessionStorage.setItem('auth', '三方登录')
      window.location.href = '/login'
    }

    onMounted(() => {
      if (!getToken()) {
        // 添加三方登录标识
        sessionStorage.setItem('auth', '三方登录')
        window.location.href = '/login'
      }
      const params = {
        client_id: route.query.client_id,
        response_type: route.query.response_type,
        scope: route.query.scope,
        state: route.query.state,
        redirect_uri: route.query.redirect_uri,
      }
      sessionStorage.setItem('params', JSON.stringify(params))
      // 清空三方登录标识
      sessionStorage.setItem('auth', '')
      if (!getToken())
        changeUser()
      auth.getAuthorize(params).then((res) => {
        if (res.data.code === 1) {
          data.client = res.data.content.name
          data.account = res.data.content.username
        }
      }).catch((error) => {
        ElMessage.error(error.response.data.message)
      })
    })

    return {
      ...toRefs(data),
      authorization,
      cancel,
      changeUser,
    }
  },
})
</script>

<template>
  <div class="authorize-main">
    <div class="authorize-header">
      授权登录
    </div>
    <div class="p-2">
      <div class="mt-2">
        <span class="text-gray-600">{{ client }} 想要访问你的账户信息</span>
      </div>
      <div class="mt-2">
        <span>当前登录账号: {{ account }}</span>
      </div>
    </div>
    <div class="pl-10 flex">
      <div class="mb-10">
        <el-button type="primary" size="small" @click="authorization">
          授 权
        </el-button>
      </div>
      <div class="mb-10 ml-10">
        <el-button size="small" @click="cancel">
          取 消
        </el-button>
      </div>
    </div>
    <el-link class="ml-11">
      切换账号 >
    </el-link>
  </div>
</template>

<style lang="scss" scoped>
@import url(./index.scss);
</style>
