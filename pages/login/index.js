import './index.scss'

import {login} from "../../api/login";
import {areaCodes} from '../../utils/area-code'
import Cookies from "js-cookie";

export default {
  name: "Terms",
  head() {
    return {
      title: "登录 - EasyAPI服务平台",
      meta: [
        {hid: "description", name: "description", content: "EasyAPI账号登录"},
        {hid: "keyword", name: "keyword", content: "登录"}
      ]
    };
  },
  data() {
    return {
      areaCodes,
      disabled: true,
      ruleForm: {
        areaCode: 86,
        username: "",
        password: "",
        rememberMe: true
      },
      rules: {
        username: [{required: true, message: "请输入您注册时手机号码", trigger: "blur"}],
        password: [{required: true, message: "请输入密码", trigger: "blur"}]
      }
    };
  },
  methods: {
    login() {
      let that = this;
      Cookies.set("username", that.ruleForm.username);
      let url = sessionStorage.getItem("url");
      //todo url不对需要修改
      let auth = sessionStorage.getItem("auth");
      let from = Cookies.get("from")
      login(that.ruleForm, this).then(res => {
        if (res.data.code === 1) {
          Cookies.set("authenticationToken", res.data.content.idToken, {
            expires: that.ruleForm.rememberMe ? 30 : 0.1,
            path: "/",
            domain: Cookies.get("domain")
          });
          if (url !== "" && auth === "三方登录") {
            window.location.href = "https://account.easyapi.com/auth/authorize.html" + url;
          } else {
            setTimeout(() => {
              Cookies.remove("from");
              window.location.replace(from);
            }, 1000);
          }
          that.$message.success(res.data.message);
        } else {
          that.$message.error(res.data.message);
        }
      }).catch(error => {
        that.$message.error(error.response.data.message);
      });
    }
  },
  mounted() {
    if (Cookies.get("username") != null) {
      //从Cookie中获取登录账号
      this.ruleForm.username = Cookies.get("username");
    }
  },
  updated() {
    this.disabled = !(this.ruleForm.username !== "" && this.ruleForm.password.length >= 6);
  }
};
