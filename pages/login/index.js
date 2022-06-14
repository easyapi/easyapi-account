import "./index.scss";

import { login } from "../../api/login";
import { areaCodes } from "../../utils/area-code";
import from from "../../utils/from";
import Cookies from "js-cookie";

export default {
  name: "Login",
  head() {
    return {
      title: "登录 - EasyAPI服务平台",
      meta: [
        { hid: "description", name: "description", content: "EasyAPI账号登录" },
        { hid: "keyword", name: "keyword", content: "登录" }
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
        username: [{ required: true, message: "请输入您注册时手机号码", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    login() {
      let that = this;
      const options = {
        secure: true,
        sameSite: "none"
      };
      Cookies.set("username", that.ruleForm.username, options);
      let params = sessionStorage.getItem("params");
      let auth = sessionStorage.getItem("auth");
      let from = Cookies.get("from");
      login(that.ruleForm, this).then(res => {
        if (res.data.code === 1) {
          Cookies.set("authenticationToken", res.data.content.idToken, {
            expires: that.ruleForm.rememberMe ? 30 : 0.1,
            path: "/",
            domain: Cookies.get("domain")
          });
          if (params !== "" && auth === "三方登录") {
            let json = JSON.parse(params);
            window.location.href = "/auth/authorize?client_id=" + json.client_id + "&response_type=" + json.response_type + "&scope=" + json.scope + "&redirect_uri=" + json.redirect_uri;
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
    from(this);
    if (Cookies.get("username") != null) {
      //从Cookie中获取登录账号
      this.ruleForm.username = Cookies.get("username");
    }
  },
  updated() {
    this.disabled = !(this.ruleForm.username !== "" && this.ruleForm.password.length >= 6);
  }
};
