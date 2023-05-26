<script>
import { defineComponent, onMounted } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { from } from '../utils/from'
import { account } from '../api/account'

export default defineComponent({
  name: 'Index',
  setup() {
    const router = useRouter()

    onMounted(() => {
      from()
      if (!useCookies().get('authenticationToken')) {
        router.push({ path: '/login' })
        return
      }
      account.getUser().then((res) => {
        if (res.code === 1)
          window.location.replace(useCookies().get('from'))
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
