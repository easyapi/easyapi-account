<template>
  <div>
    <div class="w-full h-auto">
      <div class="w-full h-20 bg-gray-50">
        <span v-if="$store.state.user.userInfo.team" class="flex items-center h-20 m-auto max-w-screen-lg text-lg block">
          {{ $store.state.user.userInfo.team.name }}团队续费
        </span>
      </div>
      <div class="renew_content max-w-screen-lg">
        <div class="renew_service">
          <strong class="renew_service_title">选择版本：</strong>
          <Edition :edition="edition" @event="selectEdition" />
        </div>
        <a class="edition-tips" target="_blank" href="https://www.easyapi.com/info/price">查看不同版本对比</a>
        <div class="renew_service">
          <strong class="renew_service_title">续费价格：</strong>
          <SelectPrice ref="selectPrice" :priceList="priceList" @event="selectPrice" />
        </div>
        <div class="renew_service">
          <strong class="renew_service_title">支付方式：</strong>
          <Payment :price="price" :balance="balance" @event="getPayment" />
        </div>
        <div class="renew_fl">
          <strong class="renew_service_title">团队人数：</strong>
          <div class="">
            <el-input-number v-model="memberCount" controls-outside :min="nowMemberCount"></el-input-number>
          </div>
        </div>
        <p style="margin-top: -10px; margin-bottom: 10px; margin-left: 80px; color: #888888; font-size: 12px">
          提示：团队超出20人，超出人数按5元/人计算，本次新增人数，从下个月开始计算费用。
        </p>
        <div class="renew_fl">
          <strong class="renew_service_title">到期时间：</strong>
          <div class="">
            <strong style="color: #323232; font-size: 14px">{{ date }}</strong>
          </div>
        </div>
        <div class="renew_fl">
          <strong class="renew_service_title" style="padding-top: 10px">应付金额：</strong>
          <div class="">
            <strong style="color: #fa2222; font-size: 26px">{{ totalPrice.toFixed(2) }}</strong>
            &nbsp;
            <span style="color: #323232; font-size: 14px">元</span>
          </div>
        </div>
        <div class="renew_fa">
          <el-button
            v-if="balance >= price || payment !== '余额支付'"
            style="border-radius: 4px; background-color: #1cc0d6; color: #fff; font-size: 14px"
            @click="sure">
            确定购买
          </el-button>
          <el-button
            v-if="balance < price && payment === '余额支付'"
            style="border-radius: 4px; background-color: #1cc0d6; color: #fff; font-size: 14px"
            disabled>
            确定购买
          </el-button>
          <span style="display: block; padding-top: 5px; color: #888888; font-size: 12px">若在购买过程中遇到任何问题，请联系13656171020，微信同号</span>
        </div>
      </div>
    </div>
    <!-- 微信支付弹窗 -->
    <WeChatPay :visible.sync="wechatPayDialog" :weChatPayUrl="weChatPayUrl" :price="price" />
  </div>
</template>
<script>
import Index from './index.js'

export default Index
</script>
