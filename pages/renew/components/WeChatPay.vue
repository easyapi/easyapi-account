<script>
import { getCurrentInstance } from 'vue'

const { proxy: $vm } = getCurrentInstance()

const props = defineProps(['price', 'visible', 'weChatPayUrl'])

const emit = defineEmits(['visible'])

function handleCancel() {
	emit('update:visible', false)
}

function handleClose() {
	emit('update:visible', false)
}

function handleConfirm() {
	$vm.$parent.reset()
	emit('update:visible', false)
}
</script>

<template>
  <el-dialog v-model:visible="visible" title="微信扫码支付" width="30%" :before-close="handleClose">
    <div>
      <div class="text-center">
        <p class="text-lg text-red-600">
          支付{{ price }}元
        </p>
        <p>
          <img class="my-8 inline-block" :src="weChatPayUrl" alt="">
        </p>
        <p>请使用微信扫描二维码以完成支付</p>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
