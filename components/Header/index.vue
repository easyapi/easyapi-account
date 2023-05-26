<script>
import { useCookies } from '@vueuse/integrations/useCookies'
import userStore from '@/store/user'


export default defineComponent({
  name: 'Header',
  setup() {
    const store = userStore()
    const data = reactive({
      authenticationToken: useCookies().get('authenticationToken')
    })

    onMounted(() => {
      if (data.authenticationToken) {
        store.getUser()
        console.log(store);
      }

    })

    return {
      ...toRefs(data),
      store
    }
  },
})
</script>

<template>
  <el-row class="header">
    <el-col :span="24" class="header-wp">
      <a href="https://www.easyapi.com/">
        <img class="logo" src="https://qiniu.easyapi.com/market/logo.svg" alt="">
      </a>
      <div v-if="!store.userInfo" class="buttons">
        <nuxt-link to="/login">
          登录
        </nuxt-link>
        <nuxt-link to="/signup">
          注册
        </nuxt-link>
      </div>
      <div v-else>
        <img class="photo" :src="store.userInfo.photo" alt>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.header {
  width: 100%;
  background-color: #18c1d6;

  .header-wp {
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    a {
      color: #ffffff;
    }

    .photo {
      border-radius: 50%;
      vertical-align: top;
    }
  }
}

@media screen and (min-width: 450px) {
  .header {
    height: 72px;

    .header-wp {
      height: 72px;

      .logo {
        width: 120px;
      }

      .photo {
        width: 40px;
        height: 40px;
      }
    }
  }
}

@media screen and (max-width: 450px) {
  .header {
    height: 36px;

    .header-wp {
      height: 36px;

      .logo {
        width: 60px;
      }

      .photo {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
