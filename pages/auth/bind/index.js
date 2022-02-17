import "./index.scss";

import { login } from "../../../api/login";
import { bind } from "../../../api/bind";
import { areaCodes } from "../../../utils/area-code";
import Cookies from "js-cookie";

export default {
  name: "bind",
  head() {
    return {
      title: "用户绑定 - EasyAPI服务平台",
      meta: [
        { hid: "description", name: "description", content: "用户绑定" },
        { hid: "keyword", name: "keyword", content: "用户绑定" }
      ]
    };
  },
  data() {
    return {
      areaCodes,
      disabled: true,
      imageSrc: "",
      providerUserId: "",
      providerId: "",
      options: [],
      ruleForm: {
        areaCode: 86,
        username: "",
        password: "",
        rememberMe: true
      },
      rules: {
        username: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            message: "手机号码格式有误",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "密码6~16位之间，建议包含英文和标点符号", trigger: "blur" },
          { min: 6, max: 16, message: "密码6~16位之间，建议包含英文和标点符号", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    let providerUserId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
    let providerId = window.location.href.split("?")[1].split("&")[1].split("=")[1];
    console.log(providerUserId, providerId);
    if (providerUserId && providerId) {
      this.providerUserId = providerUserId;
      this.providerId = providerId;
    }
    if (providerId === "qq") {
      this.imageSrc = require("/static/svg/qq.svg");
    } else {
      this.imageSrc = require("/static/svg/weixin.svg");
    }
  },
  methods: {
    handleLogin() {
      let that = this;
      let data = {
        ...that.ruleForm
      };
      login(data, this).then(res => {
        console.log(res);
        if (res.data.code === 1) {
          let jwt = res.data.content.idToken;
          if (that.ruleForm.rememberMe) {
            localStorage.setItem("authenticationToken", jwt);
          } else {
            sessionStorage.setItem("authenticationToken", jwt);
          }
          this.$message.success("绑定成功");
        } else {
          that.$message.error(res.data.message);
        }
      }).catch(error => {
        console.log(error);
        that.$message.error(error.response.data.message);
      });
    },
    bind() {
      let that = this;
      let from = Cookies.get("from");
      bind({
        providerUserId: that.providerUserId,
        providerId: that.providerId
      }, this).then(res => {
        if (res.data.code === 1) {
          Cookies.set("authenticationToken", localStorage.getItem("authenticationToken"), {
            expires: that.ruleForm.rememberMe ? 30 : 0.1,
            path: "/",
            domain: Cookies.get("domain")
          });
          window.location.replace(from);
        } else {
          that.$message.error(res.data.message);
        }
      }).catch(error => {
        window.location.replace("/login");
      });
    }
  },
  updated() {
    this.disabled = !(this.ruleForm.username !== "" && this.ruleForm.password.length >= 6);
  }
};
