import "./index.scss";

import {login} from "../../../api/login";
import {bind} from "../../../api/bind";
import {isValidPhoneNumber} from 'libphonenumber-js'
import {areaCodes} from "../../../utils/area-code";
import Cookies from "js-cookie";
import from from "../../../utils/from";

export default {
  name: "bind",
  head() {
    return {
      title: "用户绑定 - EasyAPI服务平台",
      meta: [
        {hid: "description", name: "description", content: "用户绑定"},
        {hid: "keyword", name: "keyword", content: "用户绑定"}
      ]
    };
  },
  data() {
    let validPhoneNumber = (rule, value, callback) => {
      if (isValidPhoneNumber(value, this.ruleForm.country)) {
        callback()
      } else {
        callback(new Error('手机号码格式有误'))
      }
    }
    return {
      areaCodes,
      disabled: true,
      imageSrc: "",
      providerUserId: "",
      providerId: "",
      options: [],
      ruleForm: {
        areaCode: 86,
        country: 'CN',
        username: "",
        password: "",
        rememberMe: true
      },
      rules: {
        username: [
          {required: true, message: "请输入手机号码", trigger: "blur"},
          {validator: validPhoneNumber, trigger: "blur"}
        ],
        password: [
          {required: true, message: "密码6~16位之间，建议包含英文和标点符号", trigger: "blur"},
          {min: 6, max: 16, message: "密码6~16位之间，建议包含英文和标点符号", trigger: "blur"}
        ]
      }
    };
  },
  mounted() {
    let providerUserId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
    let providerId = window.location.href.split("?")[1].split("&")[1].split("=")[1];
    if (providerUserId && providerId) {
      this.providerUserId = providerUserId;
      this.providerId = providerId;
    }
    if (providerId === "qq") {
      this.imageSrc = require("/static/svg/qq.svg");
    } else {
      this.imageSrc = require("/static/svg/weixin.svg");
    }
    from(this);
  },
  methods: {
    /**
     * 登录获取账号
     */
    login() {
      login(this.ruleForm, this).then(res => {
        if (res.data.code !== 1) {
          this.$message.error(res.data.message);
        }
        Cookies.set("authenticationToken", res.data.content.idToken, {
          expires: this.ruleForm.rememberMe ? 30 : 0.1,
          path: "/",
          domain: Cookies.get("domain")
        });
        this.bind();
        this.$message.success("绑定成功");
      }).catch(error => {
        this.$message.error(error.response.data.message);
      });
    },
    /**
     * 绑定账号
     */
    bind() {
      let from = Cookies.get("from");
      bind({
        providerUserId: this.providerUserId,
        providerId: this.providerId
      }, this).then(res => {
        if (res.data.code !== 1) {
          this.$message.error(res.data.message);
        }
        window.location.replace(from);
      })
    }
  },
  updated() {
    this.disabled = !(isValidPhoneNumber(this.ruleForm.username, this.ruleForm.country) && this.ruleForm.password.length >= 6);
  }
};
