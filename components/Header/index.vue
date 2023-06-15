<script>
import { useCookies } from '@vueuse/integrations/useCookies'
import userStore from '@/store/user'
import { Edit, Sort, Monitor, SwitchButton } from '@element-plus/icons-vue'
import { ArrowDown } from '@element-plus/icons-vue'
export default defineComponent({

  name: 'Header',
  components: { Edit, Sort, Monitor, SwitchButton },
  setup() {
    const store = userStore()
    const router = useRouter()
    const data = reactive({
      authenticationToken: useCookies().get('authenticationToken'),
      isLogin: true
    })

    onMounted(async () => {
      if (data.authenticationToken) {
        await store.getUser()
        return
      }
      data.isLogin = false
    })
    const inform = () => {
      window.open(`https://${store.userInfo.team.url}.easyapi.com/notification`, "_self")
    }

    const personal = () => {
      window.open(`https://${store.userInfo.team.url}.easyapi.com/user/edit`, "_self")
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
      router,
      ArrowDown,
      inform,
      personal,
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
      <div v-if="!isLogin" class="text-white">
        <nuxt-link class="mr-2" to="/login">
          登录
        </nuxt-link>
        <nuxt-link to="/signup">
          注册
        </nuxt-link>
      </div>
      <div v-if="store.userInfo">
        <el-dropdown trigger="click" class="images">
          <span class="el-dropdown-link">
            <img class="rounded-[50%] align-top w-[20px] sm:w-[40px]" :src="store.userInfo.photo" alt>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="inform">
                <el-icon class="el-icon-edit">
                  <Edit />
                </el-icon>
                我的通知
              </el-dropdown-item>
              <el-dropdown-item @click="personal">
                <el-icon class="el-icon-sort">
                  <Sort />
                </el-icon>
                个人设置
              </el-dropdown-item>
              <el-dropdown-item @click="official">
                <el-icon class="el-icon-monitor">
                  <Monitor />
                </el-icon>
                访问官网
              </el-dropdown-item>
              <el-dropdown-item @click="logout">
                <el-icon class="el-icon-switch-button">
                  <SwitchButton />
                </el-icon>
                退出
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
.text-white a {
  margin-left: 25px;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
