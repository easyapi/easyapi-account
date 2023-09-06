<script setup lang="ts">
const props = defineProps({
  price: {
    type: String,
    default: null,
  },
  visible: {
    type: Boolean,
    default: null,
  },
  weChatPayUrl: {
    type: String,
    default: null,
  },
})
const emit = defineEmits(['visible'])
function handleClose() {
  emit('visible')
}
</script>

<template>
  <el-dialog
    v-model="props.visible"
    title="微信扫码支付"
    width="30%"
    :before-close="handleClose"
    append-to-body
  >
    <div>
      <div class="text-center">
        <p class="text-lg text-red-600">
          支付{{ props.price }}元
        </p>
        <p>
          <img class="my-8 inline-block" :src="props.weChatPayUrl" alt="">
        </p>
        <p>请使用微信扫描二维码以完成支付</p>
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">
        取 消
      </el-button>
      <el-button type="primary" @click="handleClose">
        确 定
      </el-button>
    </template>
  </el-dialog>
</template>
