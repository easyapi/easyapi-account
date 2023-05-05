<script setup lang="ts">
import { getCurrentInstance, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { proxy: $vm } = getCurrentInstance()

const data = reactive({
  account: '',
  client: '',
})

onMounted(() => {
  const token = useCookie().get('authenticationToken')
  if (!token) {
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
  if (!token)
    changeUser()

  getAuthorize(params, this)
    .then((res: { data: { code: number; content: { name: string; username: string } } }) => {
      if (res.data.code === 1) {
        data.client = res.data.content.name
        data.account = res.data.content.username
      }
    })
    .catch((error: { response: { data: { message: any } } }) => {
      /* Warn: Unknown source: $message */
      $vm.$message.error(error.response.data.message)
    })
})
function authorization(this: { data: { account: string; client: string }; authorization: () => void; cancel: () => void; changeUser: () => void }) {
  oauthAuthorize(
    qs.stringify({
      'user_oauth_approval': true,
      'authorize': 'Authorize',
      'scope.client': true,
    }),
    this,
  ).then()
}

function cancel(this: { data: { account: string; client: string }; authorization: () => void; cancel: () => void; changeUser: () => void }) {
  oauthAuthorize(
    qs.stringify({
      'user_oauth_approval': true,
      'authorize': 'Authorize',
      'scope.client': false,
    }),
    this,
  ).then()
}

function changeUser() {
  // 添加三方登录标识
  sessionStorage.setItem('auth', '三方登录')
  window.location.href = '/login'
}

function getAuthorize(params: { client_id: import('vue-router').LocationQueryValue | import('vue-router').LocationQueryValue[]; response_type: import('vue-router').LocationQueryValue | import('vue-router').LocationQueryValue[]; scope: import('vue-router').LocationQueryValue | import('vue-router').LocationQueryValue[]; state: import('vue-router').LocationQueryValue | import('vue-router').LocationQueryValue[]; redirect_uri: import('vue-router').LocationQueryValue | import('vue-router').LocationQueryValue[] }, arg1: undefined) {
  throw new Error('Function not implemented.')
}

function oauthAuthorize(arg0: any, arg1: any) {
  throw new Error('Function not implemented.')
}
</script>

<template>
  <div class="authorize-main">
    <div class="authorize-header">
      授权登录
    </div>
    <div class="p-2">
      <div class="mt-2">
        <span class="text-gray-600">{{ data.client }} 想要访问你的账户信息</span>
      </div>
      <div class="mt-2">
        <span>当前登录账号: {{ data.account }}</span>
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
    <el-button class="ml-10" type="text" @click="changeUser">
      切换账号 >
    </el-button>
  </div>
</template>
