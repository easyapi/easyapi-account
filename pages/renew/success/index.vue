<!-- <script lang="ts">
import { getCurrentInstance, onMounted, onUpdated, reactive } from 'vue'
import signup from '@/api/signup'
export default defineComponent({
  setup() {
interface FormData {
  areaCode: number;
  country: string;
  username: string;
  code: string;
  nickname: string;
  password: string;
  confirmPassword: string;
  checked: boolean;
}
    name: 'RenewSuccess',
      head() {
      return {
        title: '续费成功 - EasyAPI',
        meta: [{ charset: 'utf-8' }, { hid: 'description', name: 'description', content: '续费成功' }, { hid: 'keyword', name: 'keyword', content: '续费成功' }],
      }
    }
      const useData = () => data
      const { proxy: $vm } = getCurrentInstance()
      const data = reactive<FormData>({
        areaCode: 86,
        country: 'CN',
        username: '',
        code: '',
        nickname: '',
        password: '',
        confirmPassword: '',
        checked: true
      })

    }
  }
)
</script> -->

<template>
  <div>
    <div class="max-w-screen-md text-center my-8 ml-auto mr-auto">
      <main>
        <img class="inline-block text-lg text-gray-100 mb-2" src="@/assets/images/static/images/success.png" alt="">
        <h2>续费成功，谢谢！</h2>
      </main>
      <footer>
        <p class="text-sm">
          如果有任何问题,请发送邮件到leida@easyapi.com,或者微信13656171020处理，谢谢您的支持
        </p>
      </footer>
    </div>
  </div>
</template>
