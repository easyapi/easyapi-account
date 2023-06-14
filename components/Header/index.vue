<script>
import { useCookies } from '@vueuse/integrations/useCookies'
import userStore from '@/store/user'
import { ref, unref } from 'vue'
import { Edit, Sort, Monitor, SwitchButton } from '@element-plus/icons-vue'
export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Header',
  components: { Edit, Sort, Monitor, SwitchButton },
  setup() {
    const store = userStore()
    const router = useRouter()
    const data = reactive({
      authenticationToken: useCookies().get('authenticationToken'),
    })

    onMounted(async () => {
      if (data.authenticationToken)
        await store.getUser()
    })
    const buttonRef = ref()
    const popoverRef = ref()
    const onClickOutside = () => {
      unref(popoverRef).popperRef?.delayHide?.()

    }
    const official = () => {
      window.open("https://www.easyapi.com/home")
    }
    const logout = () => {
      useRouter().replace("login")
    }
    return {
      ...toRefs(data),
      store,
      buttonRef,
      popoverRef,
      onClickOutside,
      official,
      logout
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
        <div ref="buttonRef" v-click-outside="onClickOutside" class="images">
          <img class="rounded-[50%] align-top w-[20px] sm:w-[40px]" :src="store.userInfo.photo" alt>
        </div>
        <el-popover ref="popoverRef" :virtual-ref="buttonRef" trigger="click" virtual-triggering>
          <li tabindex="-1" class="el-dropdown-menu__item">
            <a href="https://yiku.easyapi.com/notification">
              <el-icon class="el-icon-edit">
                <Edit />
              </el-icon>
              我的通知
            </a>
          </li>
          <li tabindex="-1" class="el-dropdown-menu__item">
            <a href="https://yiku.easyapi.com/user/edit">
              <el-icon class="el-icon-sort">
                <Sort />
              </el-icon>
              个人设置
            </a>
          </li>
          <li tabindex="-1" class="el-dropdown-menu__item" @click="official">
            <el-icon class="el-icon-monitor">
              <Monitor />
            </el-icon>
            访问官网
          </li>
          <li tabindex="-1" class="el-dropdown-menu__item" @click="logout">
            <el-icon class="el-icon-switch-button">
              <SwitchButton />
            </el-icon>
            退出
          </li>
        </el-popover>

      </div>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
.text-white a {
  margin-left: 25px;
}

.images {
  cursor: pointer;
}

li {
  width: 140px;
  margin-left: -10px;
}

li:hover {
  background-color: rgb(166, 236, 248);
}
</style>
