<script>
import { defineComponent, onMounted } from 'vue'
import { useCookie } from 'nuxt/dist/app/composables/cookie'
import { from } from '../utils/from'
import { account } from '../api/account'
import { getToken } from '@/utils/token'

export default defineComponent({
  name: 'Index',
  setup() {
    const router = useRouter()

    onMounted(() => {
      from()
      if (!getToken()) {
        router.push({ path: '/login' })
        return
      }
      account.getUser().then((res) => {
        if (res.code === 1)
          window.location.replace(useCookie('from').value)
        else
          router.push({ path: '/login' })
      })
    })
  },
})
</script>

<template>
  <div />
</template>
