<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'
import Edition from '../components/Edition.vue'
import SelectPrice from '../components/SelectPrice.vue'
import Payment from '../components/Payment.vue'
import WeChatPay from '../components/WeChatPay.vue'

import userStore from '@/store/user'

import renew from '@/api/renew'
import money from '@/api/money'

export default defineComponent({
  components: {
    Edition,
    SelectPrice,
    Payment,
    WeChatPay
  },
  setup() {
    const router = useRouter()
    const store = userStore()
    const data = reactive({
      team: {},
      date: '',
      oldDate: '',
      priceList: [], // 价格列表
      selectMonth: 0,
      balance: '', // 账户余额
      price: 0, // 销售价格
      payment: '余额支付', // 支付方式
      nowMemberCount: 0, // 目前团队人数
      memberCount: 0, // 可改变团队人数
      wechatPayDialog: false,
      weChatPayUrl: null,
      selectric:null,
      totalPrice: 0, // 应付金额
      release: '基础版', // 版本
      edition: false,
    })

    const handleClose = () => {
      data.wechatPayDialog = false
    }

    const getDocumentPrice = () => {
      if (data.selectMonth === 0) {
        return
      }
      renew.getRenewPrice({
        month: data.selectMonth,
        memberCount: data.memberCount,
        release: data.release
      }).then(res => {
        if (res.code === 1) {
          data.totalPrice = res.content
        }
      })
    }

    const getTeamUserList = () => {
      team.getTeamUserList({}).then(res => {
        if (res.code === 1) {
          data.nowMemberCount = res.content.length
          data.memberCount = res.content.length
        }
      })
    }

    const getPriceList = () => {
      renew.getPriceList({release: data.release}).then(res => {
        if (res.code === 1) {
          data.priceList = res.content
          for (let object of data.priceList) {
            // 统一计量
            object.num = object.month
            // 计算单价
            object.unitPrice = (object.price / object.num).toFixed(4)
          }
        }
      })
    }

    const getPayment = (event) => {
      data.payment = event
    }

    const stand = (pay) => {
      data.payment = pay
    }

    const getTeamInfo = () => {
      let teamId = store.team ? store.team.id : ''
      money.getTeamMoney({ teamId: teamId }).then(res => {
        if (res.code === 1) {
          data.balance = res.content.balance
          data.team = res.content.team
          data.date = moment(res.content.team.endTime).format('YYYY-MM-DD HH:mm:ss')
          data.oldDate = getExpirationTime(res.content.team.endTime)
          data.edition = res.content.team.release
        }
      })
    }

    const selectEdition = (item) => {
      data.release = item.name
      getDocumentPrice()
      getPriceList()
    }

    const selectPrice = (event) => {
      data.selectMonth = event.num
      data.price = event.price
      data.date = moment(data.oldDate).add(event.month, 'months').format('YYYY-MM-DD HH:mm:ss')
      getDocumentPrice()
    }

    const sure = () => {
      if (data.selectMonth === 0) {
        ElMessage.warning('请选择续费时长')
        return
      }
      ElMessageBox.confirm('你确定续费吗？', '确认购买', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        determineThePurchase()
      })
    }

    const determineThePurchase = () => {
      const params = {
        price: Number(data.totalPrice),
        payment: data.payment,
        month: data.selectMonth,
        memberCount: data.memberCount,
        release: data.release,
      }
      renew.getPriceList(params).then((res) => {
        if (data.payment === '支付宝') {
          const href = router.resolve({
            path: '/renew/alipay',
            query: {
              form: res.data.content.alipay,
            },
          })
          window.open(href, '_blank')
        } else if (data.payment === '微信支付') {
          data.weChatPayUrl = `https://api.easyapi.com/qr-code?text=${res.data.codeUrl}&bg=ffffff&appKey=f89UK9X5Q3C2YW2y&appSecret=hr2he5ufz6vw0ikz`
          data.wechatPayDialog = true
        }
        getTeamInfo()
        data.selectMonth = 0
        ElMessage.success(res.data.message)
      })
        .catch(() => {
          if (data.payment === '' || data.payment === null) {
            ElMessage.warning('请选择支付方式')
          }
        })
    }


    watch(() => data.wechatPayDialog, (val) => {
      if (!val) {
        getTeamInfo()
        data.selectMonth = 0
      }
    })

    watch(() => data.memberCount, (val) => {
      getDocumentPrice()
    })

    onMounted(() => {
      document.title = '文档续费 - EasyAPI'
      // getTeamInfo()
      getPriceList()
      // getTeamUserList()
    })

    return {
      ...toRefs(data),
      selectPrice,
      selectEdition,
      handleClose,
      getPayment,
      stand,
      store,
      sure
    }
  }
})
</script>

<template>
  <div>
    <div class="w-full h-auto">
      <div class="w-full h-20 bg-gray-50">
        <span v-if="store.team" class="flex items-center h-20 m-auto max-w-screen-lg text-lg block">
          {{ store.team.name }}团队续费
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
          <SelectPrice ref="selectric" :price-list="priceList" @event="selectPrice" />
        </div>
        <div class="renew_service">
          <strong class="renew_service_title">支付方式：</strong>
          <Payment :price="price" :balance="balance" @event="getPayment" />
        </div>
        <div class="renew_fl">
          <strong class="renew_service_title">团队人数：</strong>
          <div class="">
            <el-input-number v-model="memberCount" controls-outside :min="nowMemberCount" />
          </div>
        </div>
        <p style="margin-top: -10px; margin-bottom: 10px; margin-left: 80px; color: #888888; font-size: 12px">
          提示:团队超出20人,超出人数按5元/人计算，本次新增人数，从下个月开始计算费用。
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
            <span style="color:ww #323232; font-size: 14px">元</span>
          </div>
        </div>
        <div class="renew_fa">
          <el-button v-if="balance >= price || payment !== '余额支付'"
            style="border-radius: 4px; background-color: #1cc0d6; color: #fff; font-size: 14px" @click="sure">
            确定购买
          </el-button>
          <el-button v-if="balance < price && payment === '余额支付'"
            style="border-radius: 4px; background-color: #1cc0d6; color: #fff; font-size: 14px" disabled>
            确定购买
          </el-button>
          <span
            style="display: block; padding-top: 5px; color: #888888; font-size: 12px">若在购买过程中遇到任何问题，请联系13656171020，微信同号</span>
        </div>
      </div>
    </div>
    <!-- 微信支付弹窗 -->
    <WeChatPay v-model:visible="wechatPayDialog" :we-chat-pay-url="weChatPayUrl" :price="price" />
  </div>
</template>
<style lang="scss" scoped>
.renew_content {
  height: auto;
  margin: 0 auto;
}

.renew_service {
  width: 100%;
  height: 100px;
  display: flex;
  margin-top: 30px;
}

.renew_service_title {
  width: 8%;
  height: 100%;
  display: block;
  color: #323232;
  font-size: 14px;
}

.edition-tips {
  margin-left: 8%;
  margin-top: 10px;
  font-size: 12px;
  color: #1bc0d5;
}

.renew_fl {
  width: 100%;
  height: 55px;
  display: flex;
}

.renew_fa {
  width: 100%;
  height: 80px;
  padding-left: 80px;
}

.renew_fa button {
  width: 120px;
  height: 40px;
  text-align: center;
}
</style>
