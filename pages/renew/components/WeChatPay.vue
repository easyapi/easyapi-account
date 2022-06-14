<template>
  <el-dialog title='微信扫码支付' :visible.sync='visible' width='30%' :before-close='handleClose'>
    <div>
      <div class='text-center'>
        <p class='text-lg	text-red-600'>支付{{ price }}元</p>
        <p>
          <img class='my-8' :src='weChatPayUrl' alt='' />
        </p>
        <p>请使用微信扫描二维码以完成支付</p>
      </div>
    </div>
    <span slot='footer' class='dialog-footer'>
      <el-button @click='handleCancel'>取 消</el-button>
      <el-button type='primary' @click='handleConfirm'>确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'WeChatPay',
  props: ['price', 'visible', 'weChatPayUrl'],
  data() {
    return {}
  },
  methods: {
    handleCancel() {
      this.$emit('update:visible', false)
    },
    /**
     * 关闭
     */
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleConfirm() {
      this.$parent.reset()
      this.$emit('update:visible', false)
    }
  }
}
</script>
