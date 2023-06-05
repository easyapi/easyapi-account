<script>
import { ElMessage, ElMessageBox } from 'element-plus'

import moment from 'moment'
import SockJS from 'sockjs-client/dist/sockjs.min.js'
import Stomp from 'stompjs'
import Edition from '../components/Edition.vue'
import SelectPrice from '../components/SelectPrice.vue'
import Payment from '../components/Payment.vue'
import WeChatPay from '../components/WeChatPay.vue'
import userStore from '@/store/user'
import money from '@/api/money'
import service from '@/api/service'

export default defineComponent({
  components: {
    Edition,
    SelectPrice,
    Payment,
    WeChatPay,
  },
  setup() {
    useHead({ title: '服务续费 - EasyAPI' })
    const route = useRoute()
    const router = useRouter()
    const store = userStore()

    const data = reactive({
      service: {},
      team: {},
      num: '',
      oldNum: '',
      date: '',
      oldDate: '',
      priceList: [], // 价格列表
      balance: 0, // 账户余额
      payment: '余额支付', // 支付方式
      servicePriceId: '',
      price: 0, // 销售价格
      wechatPayDialog: false, // 微信支付弹框
      weChatPayUrl: '', // 微信支付二维码链接
      selectPri: null,
      teamServiceId: '',
    })

    const handleClose = () => {
      data.wechatPayDialog = false
    }

    const reset = () => {
      getTeamService()
      data.selectPri.reset()
    }

    /**
     * 查询服务报价列表
     */
    const getServiceList = () => {
      service.getServiceList({ serviceId: data.service.serviceId }).then((res) => {
        if (res.code === 1) {
          data.priceList = res.content
          for (const object of data.priceList) {
            // 统一计量
            object.num = object.type === 2 ? object.times : object.month
            // 计算单价
            object.unitPrice = (object.price / object.num).toFixed(4)
          }
        }
      })
    }

    /**
     * 获取团队账户
     */
    const getTeamInfo = () => {
      const teamId = store.team ? store.team.id : ''
      money.getTeamMoney({ teamId }).then((res) => {
        if (res.code === 1) {
          data.balance = res.content.balance
          data.team = res.content.team
        }
      })
    }

    const selectPrice = (event) => {
      data.servicePriceId = event.servicePriceId
      data.price = event.price
      if (event.type === 3)
        data.date = moment(data.oldDate).add(event.num, 'months').format('YYYY-MM-DD HH:mm:ss')

      if (event.type === 2)
        data.num = data.oldNum + event.num
    }

    const getPayment = (event) => {
      data.payment = event
    }

    /**
     * 获取团队服务详情
     */
    const getTeamService = (teamServiceId) => {
      service.getTeamService(teamServiceId).then((res) => {
        if (res.code === 1) {
          const content = res.content
          data.service = res.content.service
          if (data.service.type === 3) {
            // 页面显示的时间
            data.date = moment(content.endTime).format('YYYY-MM-DD HH:mm:ss')
            // 续费开始添加的时间
            data.oldDate = getExpirationTime(content.endTime)
          }
          if (data.service.type === 2) {
            data.num = content.balance
            data.oldNum = content.balance
          }
          getServiceList()
        } else if (res.code === -1) {
          // 当前团队没有开通此服务
          ElMessage.error(res.message)
          setTimeout(() => {
            window.location.href = '/service/'
          }, 2000)
        }
      })
    }

    const buy = () => {
      if (data.price === 0) {
        ElMessage.warning('请选择服务价格')
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
      service.renewBalance(
        {
          servicePriceId: data.servicePriceId,
          payment: data.payment,
        },
      ).then((res) => {
        if (res.code === 1) {
          if (data.payment === '支付宝') {
            const { href } = router.resolve({
              path: '/renew/alipay',
              query: {
                form: res.alipay,
              },
            })
            window.open(href, '_blank')
            ElMessageBox.confirm('请您在新打开的页面上完成充值。充值完成后，根据您的情况点击下面按钮。', '提示', {
              confirmButtonText: '充值成功',
              cancelButtonText: '充值失败',
              type: 'info',
            }).then(() => {
              reset()
            })
          } else if (data.payment === '微信支付') {
            data.weChatPayUrl = `https://api.easyapi.com/qr-code?text=${res.codeUrl}&bg=ffffff&appKey=f89UK9X5Q3C2YW2y&appSecret=hr2he5ufz6vw0ikz`
            data.wechatPayDialog = true
            const socket = new SockJS('https://account-api.easyapi.com/easyapi-socket')
            const stompClient = Stomp.over(socket)
            stompClient.connect({}, (frame) => {
              stompClient.subscribe(`/topic/wxpay/${data.team.user.id}`, (message) => {
                const json = JSON.parse(message.body)
                data.wechatPayDialog = false
                reset()
                ElMessage.success('充值成功！')
              })
            })
          }
          ElMessage.success(res.message)
        }
      })
    }

    onMounted(() => {
      getTeamInfo()
      getTeamService(route.query.teamServiceId)
    })

    return {
      ...toRefs(data),
      selectPrice,
      buy,
      getPayment,
      handleClose,
    }
  },
})
</script>

<template>
  <div>
    <div class="w-full h-auto">
      <div class="w-full h-20 bg-gray-50">
        <span class="flex items-center h-20 m-auto max-w-screen-lg text-lg block">{{ service.name }}服务续费</span>
      </div>
      <div class="renew_content max-w-screen-lg">
        <div class="renew_service">
          <strong class="renew_service_title">服务价格：</strong>
          <SelectPrice ref="selectric" :price-list="priceList" @event="selectPrice" />
        </div>
        <div class="renew_service">
          <strong class="renew_service_title">支付方式：</strong>
          <Payment :price="price" :balance="balance" @event="getPayment" />
        </div>
        <div class="renew_fl">
          <strong class="renew_service_title">
            {{ service.type === 2 ? '剩余次数：' : '到期时间：' }}
          </strong>
          <div class="">
            <strong style="color: #323232; font-size: 14px">
              {{ service.type === 2 ? num : date }}</strong>
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
          <el-button v-if="balance >= price || payment !== '余额支付'" type="primary" @click="buy">
            确定购买
          </el-button>
          <el-button v-if="balance < price && payment === '余额支付'" type="primary" disabled>
            确定购买
          </el-button>
          <span class="renew_btn_tips">若在购买过程中遇到任何问题，请联系13656171020，微信同号</span>
        </div>
      </div>
    </div>
    <WeChatPay :visible="wechatPayDialog" :we-chat-pay-url="weChatPayUrl" :price="price" @visible="handleClose" />
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

.renew_fl {
  width: 100%;
  height: 55px;
  display: flex;
}

.renew_btn {
  width: 100%;
  height: 80px;
  padding-left: 80px;
}

.renew_btn button {
  width: 120px;
  height: 40px;
  text-align: center;
}

.renew_btn_tips {
  display: block;
  padding-top: 5px;
  color: #888888;
  font-size: 12px;
}
</style>
