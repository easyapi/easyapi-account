<template>
  <div>
    <div class="w-full h-auto">
      <div class="w-full h-20 bg-gray-50">
        <span class="flex items-center h-20 m-auto max-w-screen-lg text-lg block">{{ service.name }}服务续费</span>
      </div>
      <div class="renew_content max-w-screen-lg">
        <div class="renew_service">
          <strong class="renew_service_title">服务价格：</strong>
          <SelectPrice ref="selectPrice" :priceList="priceList" @event="selectPrice" />
        </div>
        <div class="renew_service">
          <strong class="renew_service_title">支付方式：</strong>
          <Payment :price="price" :balance="balance" @event="getPayment" />
        </div>
        <div class="renew_fl">
          <strong class="renew_service_title">{{ service.type === 2 ? '剩余次数：' : '到期时间：' }}</strong>
          <div class="">
            <strong style="color: #323232; font-size: 14px">{{ service.type === 2 ? num : date }}</strong>
          </div>
        </div>
        <div class="renew_fl">
          <strong class="renew_service_title" style="padding-top: 10px">应付金额：</strong>
          <div class="frequency">
            <strong style="color: #fa2222; font-size: 26px">{{ price.toFixed(2) }}</strong>
            &nbsp;
            <span style="color: #323232; font-size: 14px">元</span>
          </div>
        </div>
        <div class="renew_btn">
          <el-button type="primary" v-if="balance >= price || payment !== '余额支付'" @click="buy">确定购买</el-button>
          <el-button type="primary" v-if="balance < price && payment === '余额支付'" disabled>确定购买</el-button>
          <span class="renew_btn_tips">若在购买过程中遇到任何问题，请致电：13656171020</span>
        </div>
      </div>
    </div>
    <WeChatPay :visible.sync="wechatPayDialog" :weChatPayUrl="weChatPayUrl" :price="price" />
  </div>
</template>
<script>
import Index from './index.js'

export default Index
</script>
