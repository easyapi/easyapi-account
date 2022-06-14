import "./index.scss";
import "@/icons/svg/money.svg";
import "@/icons/svg/alipay.svg";
import "@/icons/svg/wechatpay.svg";
import { getTeamMoney } from "../../../api/money";
import {
  getServiceList,
  renewBalance,
  getTeamService,
} from "../../../api/service";
import Payment from "../components/Payment";
import SelectPrice from "../components/SelectPrice";
import { getExpirationTime } from "../../../utils/date";
import WeChatPay from "../components/WeChatPay";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import moment from "moment";

export default {
  components: { Payment, SelectPrice, WeChatPay },
  head() {
    return {
      title: "服务续费 - EasyAPI",
      meta: [
        { charset: "utf-8" },
        { hid: "description", name: "description", content: "服务续费" },
        { hid: "keyword", name: "keyword", content: "服务续费" },
      ],
    };
  },
  data() {
    return {
      service: {},
      team: {},
      num: "",
      oldNum: "",
      date: "",
      oldDate: "",
      priceList: [], //价格列表
      balance: "", //账户余额
      payment: "余额支付", //支付方式
      servicePriceId: "",
      price: 0, //销售价格
      wechatPayDialog: false, //微信支付弹框
      weChatPayUrl: null, //微信支付二维码链接
    };
  },
  created() {
    this.getTeamService(this.$route.query.teamServiceId);
    this.getTeamInfo();
  },
  methods: {
    reset() {
      this.getTeamService();
      this.$refs.selectPrice.reset();
    },

    /**
     * 查询服务报价列表
     */
    getServiceList() {
      getServiceList({ serviceId: this.service.serviceId }, this).then(
        (res) => {
          if (res.data.code === 1) {
            this.priceList = res.data.content;
            for (let object of this.priceList) {
              //统一计量
              object.num = object.type === 2 ? object.times : object.month;
              //计算单价
              object.unitPrice = (object.price / object.num).toFixed(4);
            }
          }
        }
      );
    },
    /**
     * 获取团队账户
     */
    getTeamInfo() {
      let teamId = this.$store.state.user.team
        ? this.$store.state.user.team.id
        : "";
      getTeamMoney({ teamId: teamId }, this).then((res) => {
        if (res.data.code === 1) {
          this.balance = res.data.content.balance;
          this.team = res.data.content.team;
        }
      });
    },
    /**
     * 选择服务价格
     */
    selectPrice(event) {
      this.servicePriceId = event.servicePriceId;
      this.price = event.price;
      if (event.type === 3) {
        this.date = moment(this.oldDate)
          .add(event.num, "months")
          .format("YYYY-MM-DD HH:mm:ss");
      }
      if (event.type === 2) {
        this.num = this.oldNum + event.num;
      }
    },

    /**
     * 获取支付方式
     */
    getPayment(event) {
      this.payment = event;
    },

    handleClose() {
      this.wechatPayDialog = false;
    },

    /**
     * 获取团队服务详情
     */
    getTeamService(teamServiceId) {
      getTeamService(teamServiceId, this).then((res) => {
        if (res.data.code === 1) {
          let content = res.data.content;
          this.service = res.data.content.service;
          if (this.service.type === 3) {
            //页面显示的时间
            this.date = moment(content.endTime).format("YYYY-MM-DD HH:mm:ss");
            // 续费开始添加的时间
            this.oldDate = getExpirationTime(content.endTime);
          }
          if (this.service.type === 2) {
            this.num = content.balance;
            this.oldNum = content.balance;
          }
          this.getServiceList();
        } else if (res.data.code === -1) {
          //当前团对没有开通此服务
          this.$message.error(res.data.message);
          setTimeout(() => {
            window.location.href = "/service/";
          }, 2000);
        }
      });
    },

    /**
     * 确定购买
     */
    buy() {
      if (this.price === 0) {
        this.$message.warning("请选择服务价格");
        return;
      }
      this.$confirm("你确定续费吗？", "确认购买", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.determineThePurchase();
      });
    },

    /**
     *
     */
    determineThePurchase() {
      renewBalance(
        {
          servicePriceId: this.servicePriceId,
          payment: this.payment,
        },
        this
      ).then((res) => {
        if (res.data.code === 1) {
          if (this.payment === "支付宝") {
            const { href } = this.$router.resolve({
              path: "/recharge/alipay",
              query: {
                form: res.data.alipay,
              },
            });
            window.open(href, "_blank");
            this.$confirm(
              "请您在新打开的页面上完成充值。充值完成后，根据您的情况点击下面按钮。",
              "提示",
              {
                confirmButtonText: "充值成功",
                cancelButtonText: "充值失败",
                type: "info",
              }
            ).then(() => {
              this.reset();
            });
          } else if (this.payment === "微信支付") {
            this.weChatPayUrl = `https://api.easyapi.com/qr-code?text=${res.data.codeUrl}&bg=ffffff&appKey=f89UK9X5Q3C2YW2y&appSecret=hr2he5ufz6vw0ikz`;
            this.wechatPayDialog = true;
            let socket = new SockJS(
              "https://account-api.easyapi.com/easyapi-socket"
            );
            let stompClient = Stomp.over(socket);
            stompClient.connect({}, (frame) => {
              stompClient.subscribe(
                "/topic/wxpay/" + this.team.user.id,
                (message) => {
                  var json = JSON.parse(message.body);
                  this.wechatPayDialog = false;
                  this.reset();
                  this.$message.success("充值成功！");
                }
              );
            });
          }
          this.$message.success(res.data.message);
        }
      });
    },
  },
};
