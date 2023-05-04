<script setup lang="ts">
import { reactive, ref } from 'vue'
import { LocationQueryValue, useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessageBox } from '@element-plus'
import dayjs from 'dayjs'
import { getTeamMoney } from '~/api/money'
import { renewBalance } from '~/api/service'

const route = useRoute();
const router = useRouter();
const store = useStore();

const selectPrice = ref()

const data = reactive({
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
  weChatPayUrl: "", //微信支付二维码链接
});


function onCreated() {
  getTeamService(route.query.teamServiceId);
  getTeamInfo();
}
onCreated();

function reset() {
  getTeamService(route.query.teamServiceId);
  selectPrice.reset();
}

function getServiceList() {
  getServiceList().then(
    (res: { data: { code: number; content: never[] } }) => {
      if (res.data.code === 1) {
        data.priceList = res.data.content;
        for (let object of data.priceList) {
          //统一计量
          object.num = object.type === 2 ? object.times : object.month;
          //计算单价
          object.unitPrice = (object.price / object.num).toFixed(4);
        }
      }
    }
  );
}

function getTeamInfo(this: any) {
  let teamId = store.state.user.userInfo.team
    ? store.state.user.userInfo.team.id
    : "";
  getTeamMoney({ teamId: teamId }, this).then(
    (res: {
      data: { code: number; content: { balance: string; team: {} } };
    }) => {
      if (res.data.code === 1) {
        data.balance = res.data.content.balance;
        data.team = res.data.content.team;
      }
    }
  );
}

function selectPrice(event: {
  servicePriceId: string;
  price: number;
  type: number;
  num: string | number;
}) {
  data.servicePriceId = event.servicePriceId;
  data.price = event.price;
  if (event.type === 3) {
    data.date = dayjs(data.oldDate)
      .add(event.num, "months")
      .format("YYYY-MM-DD HH:mm:ss");
  }
  if (event.type === 2) {
    data.num = data.oldNum + event.num;
  }
}

function getPayment(event: string) {
  data.payment = event;
}

function handleClose() {
  data.wechatPayDialog = false;
}

function getTeamService(
  this: any,
  teamServiceId: LocationQueryValue | LocationQueryValue[] | undefined
) {
  getTeamService(teamServiceId).then(
    (res: {
      data: {
        code: number;
        content: {
          balance: string
          endTime(endTime: any): unknown;
          service: {};
        };
        message: any;
      };
    }) => {
      if (res.data.code === 1) {
        let content = res.data.content;
        data.service = res.data.content.service;
        if (data.service === 3) {
          //页面显示的时间
          data.date = dayjs(content.endTime).format("YYYY-MM-DD HH:mm:ss");
          // 续费开始添加的时间
          data.oldDate = getExpirationTime(content.endTime);
        }
        if (data.service === 2) {
          data.num = content.balance;
          data.oldNum = content.balance;
        }
        getServiceList();
      } else if (res.data.code === -1) {
        //当前团队没有开通此服务
        /* Warn: Unknown source: $message */
        ElMessageBox.$message.error(res.data.message);
        setTimeout(() => {
          window.location.href = "/service/";
        }, 2000);
      }
    }
  );
}

function buy() {
  if (data.price === 0) {
    /* Warn: Unknown source: $message */
    ElMessageBox.$message.warning("请选择服务价格");
    return;
  }
  /* Warn: Unknown source: $confirm */
  ElMessageBox.$confirm("你确定续费吗？", "确认购买", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    determineThePurchase();
  });
}

function determineThePurchase(this: any) {
  renewBalance(
    {
      servicePriceId: data.servicePriceId,
      payment: data.payment,
    },
    // this
  ).then(
    (res: {
      data: { code: number; alipay: any; codeUrl: any; message: any };
    }) => {
      if (res.data.code === 1) {
        if (data.payment === "支付宝") {
          const { href } = router.resolve({
            path: "/renew/alipay",
            query: {
              form: res.data.alipay,
            },
          });
          window.open(href, "_blank");
          /* Warn: Unknown source: $confirm */
          ElMessageBox.confirm(
            "请您在新打开的页面上完成充值。充值完成后，根据您的情况点击下面按钮。",
            "提示",
            {
              confirmButtonText: "充值成功",
              cancelButtonText: "充值失败",
              type: "info",
            }
          ).then(() => {
            reset();
          });
        } else if (data.payment === "微信支付") {
          data.weChatPayUrl = `https://api.easyapi.com/qr-code?text=${res.data.codeUrl}&bg=ffffff&appKey=f89UK9X5Q3C2YW2y&appSecret=hr2he5ufz6vw0ikz`;
          data.wechatPayDialog = true;
          // let socket = new SockJS(
          //   "https://account-api.easyapi.com/easyapi-socket"
          // );
          // let stompClient = stop.over(socket);
          // stompClient.connect({}, (frame: any) => {
          //   stompClient.subscribe(
          //     "/topic/wxpay/" + data.team.user.id,
          //     (message: { body: string; }) => {
          //       var json = JSON.parse(message.body);
          //       data.wechatPayDialog = false;
          //       reset();
          //       /* Warn: Unknown source: $message */
          //       ElMessageBox.$message.success("充值成功！");
          //     }
          //   );
          // });
        }
        /* Warn: Unknown source: $message */
        ElMessageBox.$message.success(res.data.message);
      }
    }
  );
}
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
          <SelectPrice ref="selectPrice" :priceList="data.priceList" @event="selectPrice" />
        </div>
        <div class="renew_service">
          <strong class="renew_service_title">支付方式：</strong>
          <Payment :price="data.price" :balance="data.balance" @event="getPayment" />
        </div>
        <div class="renew_fl">
          <strong class="renew_service_title">{{
            data.service.type === 2 ? "剩余次数：" : "到期时间："
          }}</strong>
          <div class="">
            <strong style="color: #323232; font-size: 14px">{{
              data.service.type === 2 ? num : date
            }}</strong>
          </div>
        </div>
        <div class="renew_fl">
          <strong class="renew_service_title" style="padding-top: 10px">应付金额：</strong>
          <div class="frequency">
            <strong style="color: #fa2222; font-size: 26px">{{
              data.price.toFixed(2)
            }}</strong>
            &nbsp;
            <span style="color: #323232; font-size: 14px">元</span>
          </div>
        </div>
        <div class="renew_btn">
          <el-button type="primary" v-if="data.balance >= data.price || data.payment !== '余额支付'" @click="buy">确定购买</el-button>
          <el-button type="primary" v-if="data.balance < data.price && data.payment === '余额支付'" disabled>确定购买</el-button>
          <span class="renew_btn_tips">若在购买过程中遇到任何问题,请联系13656171020,微信同号</span>
        </div>
      </div>
    </div>
    <WeChatPay :visible="data.wechatPayDialog" :weChatPayUrl="data.weChatPayUrl" :price="price" />
  </div>
</template>
