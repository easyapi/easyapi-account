  <template>
  <div></div>
</template>
  
<script>
import { defineComponent, onMounted } from 'vue'
import { from } from '../utils/from'
import { useCookies } from '@vueuse/integrations/useCookies'
import { ElMessage } from 'element-plus'
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
      account.getUser()
        .then((res) => {
          if (res.code === 1)
            useCookies().get('from')
          else
            router.push({ path: '/login' })
        })
        .catch((error) => {
          ElMessage.error(error.response.data.message)
        })
    })
  },
})
</script>