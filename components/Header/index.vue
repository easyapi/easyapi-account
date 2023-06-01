<script>
import { useCookies } from '@vueuse/integrations/useCookies'
import userStore from '@/store/user'

export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Header',
  setup() {
    const store = userStore()
    const data = reactive({
      authenticationToken: useCookies().get('authenticationToken'),
    })

    onMounted(async () => {
      if (data.authenticationToken)
        await store.getUser()
    })

    return {
      ...toRefs(data),
      store,
    }
  },
})
</script>

<template>
  <el-row class="bg-[#18c1d6] w-full h-[36px] sm:h-[72px]">
    <el-col :span="24" class="px-[20px] h-[36px] flex justify-between items-center sm:h-[72px]">
      <a href="https://www.easyapi.com/" class="text-white">
        <img class="w-[60px] sm:w-[120px]" src="https://qiniu.easyapi.com/market/logo.svg" alt="">
      </a>
      <div v-if="!store.userInfo" class="text-white">
        <nuxt-link to="/login">
          登录
        </nuxt-link>
        <nuxt-link to="/signup">
          注册
        </nuxt-link>
      </div>
      <div v-else>
        <img class="rounded-[50%] align-top w-[20px] sm:w-[40px]" :src="store.userInfo.photo" alt>
      </div>
    </el-col>
  </el-row>
</template>
