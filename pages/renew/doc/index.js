import './index.scss'
import { getExpirationTime } from '../../../utils/date'
import { getPriceList, renew, getRenewPrice } from '../../../api/renew.js'
import { getTeamUserList } from '../../../api/team'
import { getTeamMoney } from '../../../api/money'
import Edition from '../components/Edition.vue'
import SelectPrice from '../components/SelectPrice.vue'
import Payment from '../components/Payment'
import WeChatPay from '../components/WeChatPay'
import dayjs from 'dayjs'

export default {
  components: { Edition, Payment, SelectPrice, WeChatPay },
  data() {
    return {
      team: {},
      date: '',
      oldDate: '',
      priceList: [], //价格列表
      selectMonth: 0,
      balance: '', //账户余额
      price: 0, //销售价格
      payment: '余额支付', //支付方式
      nowMemberCount: 0, //目前团队人数
      memberCount: 0, //可改变团队人数
      wechatPayDialog: false,
      weChatPayUrl: null,
      totalPrice: 0, //应付金额
      release: '基础版', //版本
      edition: ''
    }
  },
  head() {
    return {
      title: '文档续费 - EasyAPI',
      meta: [{ charset: 'utf-8' }, { hid: 'description', name: 'description', content: '文档续费' }, { hid: 'keyword', name: 'keyword', content: '文档续费' }]
    }
  },
  watch: {
    wechatPayDialog(val) {
      if (!val) {
        this.getTeamInfo()
        this.selectMonth = 0
      }
    },
    memberCount(val) {
      this.getDocumentPrice()
    }
  },
  created() {
    this.getTeamInfo()
    this.getPriceList()
    this.getTeamUserList()
  },
  mounted() {
    document.title = '文档续费 - EasyAPI'
  },
  methods: {
    handleClose() {
      this.wechatPayDialog = false
    },
    /**
     * 获取续费价格
     */
    getDocumentPrice() {
      if (this.selectMonth === 0) {
        return
      }
      getRenewPrice(
        {
          month: this.selectMonth,
          memberCount: this.memberCount,
          release: this.release
        },
        this
      ).then(res => {
        if (res.data.code === 1) {
          this.totalPrice = res.data.content
        }
      })
    },

    /**
     * 获取团队成员列表
     */
    getTeamUserList() {
      getTeamUserList({}, this).then(res => {
        if (res.data.code === 1) {
          this.nowMemberCount = res.data.content.length
          this.memberCount = res.data.content.length
        }
      })
    },
    /**
     * 查询文档报价列表
     */
    getPriceList() {
      getPriceList(this.release, this).then(res => {
        if (res.data.code === 1) {
          this.priceList = res.data.content
          for (let object of this.priceList) {
            //统一计量
            object.num = object.month
            //计算单价
            object.unitPrice = (object.price / object.num).toFixed(4)
          }
        }
      })
    },
    /**
     * 获取支付方式
     * @param event
     */
    getPayment(event) {
      this.payment = event
    },
    /**
     * 支付方式
     */
    stand(pay) {
      this.payment = pay
    },
    /**
     * 获取团队账户
     */
    getTeamInfo() {
      let teamId = this.$store.state.user.userInfo.team ? this.$store.state.user.userInfo.team.id : ''
      getTeamMoney({ teamId: teamId }, this).then(res => {
        if (res.data.code === 1) {
          this.balance = res.data.content.balance
          this.team = res.data.content.team
          this.date = dayjs(res.data.content.team.endTime).format('YYYY-MM-DD HH:mm:ss')
          this.oldDate = getExpirationTime(res.data.content.team.endTime)
          this.edition = res.data.content.team.release
        }
      })
    },
    /**
     * 选择版本
     * @param item
     */
    selectEdition(item) {
      this.release = item.name
      this.getDocumentPrice()
      this.getPriceList()
    },
    /**
     * 选择服务价格
     */
    selectPrice(event) {
      this.selectMonth = event.num
      this.price = event.price
      this.date = dayjs(this.oldDate).add(event.month, 'months').format('YYYY-MM-DD HH:mm:ss')
      this.getDocumentPrice()
    },
    /**
     * 确定购买
     */
    sure() {
      if (this.selectMonth === 0) {
        this.$message.warning('请选择续费时长')
        return
      }
      this.$confirm('你确定续费吗？', '确认购买', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.determineThePurchase()
      })
    },
    /**
     *
     */
    determineThePurchase() {
      let data = {
        price: Number(this.totalPrice),
        payment: this.payment,
        month: this.selectMonth,
        memberCount: this.memberCount,
        release: this.release
      }
      renew(data, this)
        .then(res => {
          if (this.payment === '支付宝') {
            const { href } = this.$router.resolve({
              path: '/renew/alipay',
              query: {
                form: res.data.content.alipay
              }
            })
            window.open(href, '_blank')
          } else if (this.payment === '微信支付') {
            this.weChatPayUrl = `https://api.easyapi.com/qr-code?text=${res.data.codeUrl}&bg=ffffff&appKey=f89UK9X5Q3C2YW2y&appSecret=hr2he5ufz6vw0ikz`
            this.wechatPayDialog = true
          }
          this.getTeamInfo()
          this.selectMonth = 0
          this.$message.success(res.data.message)
        })
        .catch(error => {
          if (this.payment === '' || this.payment === null) {
            this.$message.warning('请选择支付方式')
          }
        })
    }
  }
}
