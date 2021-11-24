<template>
  <div id="app">
    <div class="container">
      <div class="form">
        <div class="word_top">
          <span>{{ client }} 想要访问你的账户信息</span>
        </div>
        <div class="word_bottom">
          <span>当前登录账号: {{ account }}</span>
        </div>
      </div>
      <div class="form">
        <form class="mg-b-10" action="https://account.easyapi.com/oauth/authorize" method="post">
          <input name="user_oauth_approval" value="true" type="hidden">
          <input name="authorize" value="Authorize" type="hidden">
          <input name="scope.client" value="true" type="hidden">
          <el-button type="primary" class=" btn-block btn btn-lg btn-info">授 权</el-button>
        </form>
        <form class="mg-b-10" action="https://account.easyapi.com/oauth/authorize" method="post">
          <input name="user_oauth_approval" value="true" type="hidden">
          <input name="authorize" value="Authorize" type="hidden">
          <input name="scope.client" value="false" type="hidden">
          <el-button type="primary" class="btn_right_input">取 消</el-button>
        </form>
        <el-button class="btn_right_p" @click="changeUser">切换账号</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Terms",
    head() {
      return {
        title: "授权 - EasyAPI服务平台",
        meta: [
          {
            hid: "description",
            name: "description",
            content: "授权"
          },
          {
            hid: "keyword",
            name: "keyword",
            content: "授权"
          }
        ]
      };
    },
    data() {
      return {
        account: "",
        client: "EasyAPI发票管理"
      };
    },
    methods: {
      /**
       * 切换账号
       */
      changeUser() {
        window.location.href = "https://account.easyapi.com/login";
        //添加三方登录标识
        sessionStorage.setItem("auth", "三方登录");
      }
    },
    mounted() {
      if (!token) {
        window.location.href = "../login/index.vue";
        sessionStorage["auth"] = "三方登录"; //添加三方登录标识
      }
      //获取url中"?"符后的字串
      let url = window.location.search;
      sessionStorage.setItem("url", url);
      //清空三方登录标识
      sessionStorage.setItem("auth", "");
      let token = Cookies.get("authenticationToken");
      if (!token) {
        this.changeUser();
      }
      axios({
        type: "GET",
        url: "https://account.easyapi.com/oauth/authorize" + url,
        headers: {
          "Authorization": "Bearer " + token
        }
      }).then(res => {
        if (res.data.code === 1) {
          this.client = res.data.content.name;
          this.account = res.data.content.username;
        }
      }).catch(error => {
        this.$message.error(error.response.data.message);
      });
    }
  };
</script>

<style lang="less" scoped>

</style>
