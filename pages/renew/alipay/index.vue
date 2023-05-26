<script>
import { nextTick, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const data = reactive({
  formHtml: '',
})

onMounted(() => {
  if (route.query.form) {
    data.formHtml = route.query.form
    nextTick(() => {
      // 渲染支付宝支付页面
      document.forms[0].submit()
    })
  }
})
</script>

<template>
  <div>
    <p v-html="formHtml" />
  </div>
</template>
