<template>
  <div id="app">
    <div class="wrapper">
      <div class="w_top">
        <div class="word_top">
          <span>{{ client }} 想要访问你的账户信息</span>
        </div>
        <div class="word_bottom">
          <span>当前登录账号: {{ account }}</span>
        </div>
      </div>
      <div class="w_bottom">
        <div class="btn_w">
          <div class="btn_left">
            <form action="https://account.easyapi.com/oauth/authorize" method="post">
              <input name="user_oauth_approval" value="true" type="hidden">
              <input name="authorize" value="Authorize" type="hidden">
              <input name="scope.client" value="true" type="hidden">
              <input type="submit" class=" btn-block btn btn-lg btn-info" value="授 权"/>
            </form>
          </div>
          <div class="btn_right">
            <form action="https://account.easyapi.com/oauth/authorize" method="post">
              <input name="user_oauth_approval" value="true" type="hidden">
              <input name="authorize" value="Authorize" type="hidden">
              <input name="scope.client" value="false" type="hidden">
              <input type="submit" class="btn_right_input" value="取 消"/>
            </form>
            <p class="btn_right_p" @click="changeUser">切换账号</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Terms',
  head() {
    return {
      title: '授权 - EasyAPI服务平台',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: '授权'
        },
        {
          hid: 'keyword',
          name: 'keyword',
          content: '授权'
        }
      ]
    }
  },
  data() {
    return {
      account: "",
      client: "EasyAPI发票管理",
    }
  },
  methods: {
    /**
     * 切换账号
     */
    changeUser() {
      window.location.href = "https://account.easyapi.com/login";
      //添加三方登录标识
      sessionStorage.setItem('auth', "三方登录");
    }
  },
  mounted() {
    if (!token) {
      window.location.href = "../login/index.vue";
      sessionStorage['auth'] = "三方登录"; //添加三方登录标识
    }
    //获取url中"?"符后的字串
    let url = window.location.search;
    sessionStorage.setItem('url', url);
    //清空三方登录标识
    sessionStorage.setItem('auth', "");
    let token = Cookies.get("authenticationToken");
    if (!token) {
      this.changeUser();
    }
    axios({
      type: 'GET',
      url: 'https://account.easyapi.com/oauth/authorize' + url,
      headers: {
        'Authorization': "Bearer " + token
      }
    }).then(res => {
      if (res.data.code === 1) {
        this.client = res.data.content.name;
        this.account = res.data.content.username;
      }
    }).catch(error => {
      this.$message.error(error.response.data.message);
    });
  },
}
</script>

<style lang="less" scoped>

</style>
