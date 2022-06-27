<template>
  <div class="payment">
    <div class="payment-item" :class="{ state: payment === '余额支付' }" @click="stand('余额支付')" v-if="balance >= price">
      <svg-icon icon-class="money" class="svg" />
      <span>余额支付(￥{{ balance }})</span>
    </div>
    <div class="payment_p" :class="{ state: payment === '余额支付' }" @click="stand('余额支付')" v-if="balance < price">
      <span>
        <strong>余额支付(￥{{ balance }})</strong>
      </span>
      <span style="display: block; color: #303030; line-height: 25px; width: 285px">
        余额不足，建议使用其他支付方式，或者
        <a href="/account" style="color: #1cc0d6">充值</a>
      </span>
    </div>
    <div class="payment-item" :class="{ state: payment === '微信支付' }" @click="stand('微信支付')">
      <svg-icon icon-class="wechatpay" class="svg" />
      <span>微信支付</span>
    </div>
    <div class="payment-item" :class="{ state: payment === '支付宝' }" @click="stand('支付宝')">
      <svg-icon icon-class="alipay" class="svg" />
      <span>支付宝</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['price', 'balance'],
  name: 'Payment',
  data() {
    return {
      payment: '余额支付'
    }
  },
  methods: {
    /**
     * 支付方式
     */
    stand(pay) {
      this.payment = pay
      this.$emit('event', pay)
    }
  }
}
</script>

<style lang="scss" scoped>
.payment {
  width: 92%;
  height: auto;
  display: flex;

  .state {
    width: 215px;
    height: 50px;
    background-color: #ffffff;
    border-radius: 4px;
    border: solid 1px #1bc0d5 !important;
    position: relative;
  }

  .state span:before {
    position: absolute;
    left: 194px;
    top: 28px;
    content: ' ';
    width: 20px;
    height: 20px;
    background-image: url('../../../assets/images/checked.png');
    background-size: cover;
  }

  .payment-item {
    width: 216px;
    height: 50px;
    background-color: #ffffff;
    border: solid 1px #dfdfdf;
    font-size: 14px;
    color: #323232;
    margin-left: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;

    .svg {
      width: 25px;
      height: 25px;
      margin: 0 10px;
    }
  }

  .payment_p {
    width: 216px;
    height: 50px;
    line-height: 50px;
    background-color: #eeeeee;
    border-radius: 4px;
    border: solid 1px #dfdfdf;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    color: #676767;
  }

  .payment-item:first-child {
    margin-left: 0;
  }
}
</style>
