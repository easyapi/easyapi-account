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
        <nuxt-link class="mr-2" to="/login">
          登录
        </nuxt-link>
        <nuxt-link to="/signup">
          注册
        </nuxt-link>
      </div>
      <div v-else>
        <img class="rounded-[50%] align-top w-[20px] sm:w-[40px]" :src="store.userInfo.photo" alt>
        <!-- <ul data-v-292b24ab="" class="el-dropdown-menu el-popper" id="dropdown-menu-555"
          style="position: absolute; top: 45px; left: 1269px; transform-origin: center top; z-index: 2014;"
          x-placement="bottom-end">
          <li data-v-292b24ab="" tabindex="-1" class="el-dropdown-menu__item"><i class="el-icon-edit"></i>我的通知</li>
          <li data-v-292b24ab="" tabindex="-1" class="el-dropdown-menu__item"><i class="el-icon-sort"></i>个人设置</li>
          <li data-v-292b24ab="" tabindex="-1" class="el-dropdown-menu__item"><i class="el-icon-monitor"></i>访问官网</li>
          <li data-v-292b24ab="" tabindex="-1" class="el-dropdown-menu__item"><i class="el-icon-switch-button"></i>退出</li>
          <div x-arrow="" class="popper__arrow" style="left: 94px;"></div>
        </ul> -->
      </div>
    </el-col>
  </el-row></template>
<style lang="scss" scoped>.text-white a {
  margin-left: 25px;
}</style>
