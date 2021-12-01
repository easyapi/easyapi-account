import './index.scss'

import {getAuthorize} from "../../../api/auth";
import Cookies from "js-cookie";

export default {
  name: "Authorize",
  head() {
    return {
      title: "授权 - EasyAPI服务平台",
      meta: [
        {hid: "description", name: "description", content: "授权"},
        {hid: "keyword", name: "keyword", content: "授权"}
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
    let token = Cookies.get("authenticationToken");

    if (!token) {
      window.location.href = "../../login/index.vue";
      sessionStorage["auth"] = "三方登录"; //添加三方登录标识
    }
    //获取url中"?"符后的字串
    console.log(this.$router)
    console.log(this.$router.params)
    console.log(this.$router.query)
    let url = this.$router.query.search;

    sessionStorage.setItem("url", url);
    //清空三方登录标识
    sessionStorage.setItem("auth", "");
    if (!token) {
      this.changeUser();
    }
    let params = {
      search: url
    };
    getAuthorize(params).then(res => {
      if (res.data.code === 1) {
        this.client = res.data.content.name;
        this.account = res.data.content.username;
      }
    }).catch(error => {
      this.$message.error(error.response.data.message);
    });
  }
};
