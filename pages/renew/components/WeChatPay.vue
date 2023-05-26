<script setup lang="ts">
import { getCurrentInstance } from 'vue'

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

function handleCancel() {
  emit('visible', false)
}

function handleClose() {
  emit('visible', false)
}

function handleConfirm() {
  emit('visible', false)
}

onMounted(() => {
  console.log(props)
})
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
        <p class="text-lg text-red-600">支付{{ props.price }}元</p>
        <p>
          <img class="my-8 inline-block" :src="props.weChatPayUrl" alt="" />
        </p>
        <p>请使用微信扫描二维码以完成支付</p>
      </div>
    </div>
    <span class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
