<script setup lang="ts">
import { nextTick, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const data = reactive({
  formHtml: '',
})

useHead({ title: '正在跳转支付宝 - EasyAPI' })

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
    <p v-html="data.formHtml" />
  </div>
</template>
