<script lang="ts">
import { onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
export default defineComponent({
  setup() {

 
    const router = useRouter()
    const store = useStore()

    interface Data {
      team: any;
      date: string;
      oldDate: string;
      priceList: any[];
      selectMonth: number;
      balance: string;
      price: number;
      payment: string;
      nowMemberCount: number;
      memberCount: number;
      wechatPayDialog: boolean;
      weChatPayUrl: string | null;
      totalPrice: number;
      release: string;
      edition: string;
    }

    const data: Data = reactive({
      team: {},
      date: '',
      oldDate: '',
      priceList: [],
      selectMonth: 0,
      balance: '',
      price: 0,
      payment: '余额支付',
      nowMemberCount: 0,
      memberCount: 0,
      wechatPayDialog: false,
      weChatPayUrl: null,
      totalPrice: 0,
      release: '基础版',
      edition: '',
    })

    watch(() => data.wechatPayDialog, (val: boolean) => {
      if (!val) {
        getTeamInfo()
        data.selectMonth = 0
      }
    })

    watch(() => data.memberCount, (_val: number) => {
      getDocumentPrice()
    })

    function onCreated() {
      getTeamInfo()
      getPriceList()
      getTeamUserList()
    }
    onCreated()

    onMounted(() => {
      document.title = '文档续费 - EasyAPI'
    })

    function getDocumentPrice(this: any) {
      if (data.selectMonth === 0)
        return
      getRenewPrice({
        month: data.selectMonth,
        memberCount: data.memberCount,
        release: data.release,
      },
        this,
      ).then((res: { data: { code: number; content: number } }) => {
        if (res.data.code === 1)
          data.totalPrice = res.data.content
      })
    }
    function getTeamUserList(this: any) {
      getTeamUserList().then((res: { data: { code: number; content: string | any[] } }) => {
        if (res.data.code === 1) {
          data.nowMemberCount = res.data.content.length
        }
      })
    }
  }
})
</script>

<template>
  <div>
    <div class="w-full h-auto">
      <div class="w-full h-20 bg-gray-50">
        <span v-if="item.state.user.userInfo.team" class="flex items-center h-20 m-auto max-w-screen-lg text-lg block">
          {{ item.state.user.userInfo.team.name }}团队续费
        </span>
      </div>
      <div class="renew_content max-w-screen-lg">
        <div class="renew_service">
          <strong class="renew_service_title">选择版本：</strong>
          <Edition :edition="data.edition" @event="selectEdition" />
        </div>
        <a class="edition-tips" target="_blank" href="https://www.easyapi.com/info/price">查看不同版本对比</a>
        <div class="renew_service">
          <strong class="renew_service_title">续费价格：</strong>
          <SelectPrice ref="selectPrice" :price-list="data.priceList" @event="selectPrice" />
        </div>
        <div class="renew_service">
          <strong class="renew_service_title">支付方式：</strong>
          <Payment :price="price" :balance="balance" @event="getPayment" />
        </div>
        <div class="renew_fl">
          <strong class="renew_service_title">团队人数：</strong>
          <div class="">
            <el-input-number v-model="data.memberCount" controls-outside :min="nowMemberCount" />
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
          <el-button v-if="data.balance >= data.price || data.payment !== '余额支付'"
            style="border-radius: 4px; background-color: #1cc0d6; color: #fff; font-size: 14px" @click="sure">
            确定购买
          </el-button>
          <el-button v-if="data.balance < data.price && data.payment === '余额支付'"
            style="border-radius: 4px; background-color: #1cc0d6; color: #fff; font-size: 14px" disabled>
            确定购买
          </el-button>
          <span
            style="display: block; padding-top: 5px; color: #888888; font-size: 12px">若在购买过程中遇到任何问题，请联系13656171020，微信同号</span>
        </div>
      </div>
    </div>
    <!-- 微信支付弹窗 -->
    <WeChatPay v-model:visible="data.wechatPayDialog" :we-chat-pay-url="data.weChatPayUrl" :price="price" />
  </div>
</template>
