import './index.scss'

import {signup, findUsername, sendCode} from "../../api/signup";
import {areaCodes} from '../../utils/area-code'
import {isValidPhoneNumber} from 'libphonenumber-js'
import Cookies from "js-cookie";
import from from "../../utils/from"

export default {
  name: "Signup",
  head() {
    return {
      title: "注册 - EasyAPI服务平台",
      meta: [
        {hid: "description", name: "description", content: "EasyAPI账号注册"},
        {hid: "keyword", name: "keyword", content: "账号注册"}
      ]
    };
  },
  data() {
    return {
      areaCodes,
      disabled: true,
      sendCodeBtn: false,
      sendCodeCount: "获取验证码",
      ruleForm: {
        areaCode: 86,
        country: 'CN',
        username: "",
        code: "",
        nickname: "",
        password: "",
        confirmPassword: "",
        checked: true
      },
      rules: {
        username: [
          {required: true, message: "请输入手机号码", trigger: "blur"},
          {
            pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            message: "手机号码格式有误",
            trigger: "blur"
          }
        ],
        code: [
          {required: true, message: "请输入验证码", trigger: "blur"},
          {pattern: /^\d{6}$/, message: "验证码格式有误", trigger: "blur"}
        ],
        nickname: [
          {required: true, message: "请输入姓名", trigger: "blur"}
        ],
        password: [
          {required: true, message: "密码6~16位之间，建议包含英文和标点符号", trigger: "blur"},
          {min: 6, max: 16, message: "密码6~16位之间，建议包含英文和标点符号", trigger: "blur"}
        ],
        confirmPassword: [
          {required: true, message: "请再输入一次密码", trigger: "blur"}
        ]
      }
    };
  },
  methods: {
    signup() {
      let that = this;
      if (that.ruleForm.password !== that.ruleForm.confirmPassword) {
        that.$message.error("确认密码不一致");
        return;
      }
      if (!that.ruleForm.checked) {
        that.$message.error("请勾选同意EasyAPI用户协议");
        return;
      }
      if (!isValidPhoneNumber(this.ruleForm.username, this.ruleForm.country) || this.ruleForm.username.length < 11) {
        that.$message.error("手机号码格式有误");
        return;
      }
      findUsername({username: this.ruleForm.username}, this).then(res => {
        this.$message.error("该账号已注册，请直接登录");
      }).catch(error => {
        let from = Cookies.get("from")
        signup(that.ruleForm, this).then(res => {
          if (res.data.code === 1) {
            Cookies.set("authenticationToken", res.data.content, {
              expires: that.ruleForm.rememberMe ? 30 : 0.1,
              path: "/",
              domain: Cookies.get("domain")
            });
            that.$message.success(res.data.message);
            setTimeout(() => {
              Cookies.remove("from");
              window.location.replace(from);
            }, 1000);
          } else {
            that.$message.error(res.data.message);
          }
        }).catch(error => {
          that.$message.error(error.response.data.message);
        });
      });
    },

    //发送验证码
    sendCode() {
      let that = this;
      if (!this.ruleForm.username) {
        this.$message.error("请输入手机号码");
        return;
      }
      if (!isValidPhoneNumber(this.ruleForm.username, this.ruleForm.country) || this.ruleForm.username.length < 11) {
        this.$message.error("手机号码格式有误");
        return;
      }
      findUsername({username: this.ruleForm.username}, this).then(res => {
        this.$message.error("该账号已注册，请直接登录");
      }).catch(error => {
        let timer;
        sendCode({mobile: that.ruleForm.username}, this).then(res => {
          if (res.data.code === 1) {
            that.$message.success("验证码发送成功");
            let second = 60;
            that.sendCodeBtn = true;
            timer = setInterval(() => {
              second--;
              if (second === 0) {
                that.sendCodeBtn = false;
                that.sendCodeCount = "获取验证码";
                clearInterval(timer);
                return;
              }
              that.sendCodeCount = `剩余${second}秒`;
            }, 1000);
          } else {
            that.$message.error(res.data.message);
          }
        }).catch(error => {
          that.$message.error(error.response.data.message);
        });
      });
    },

    //在手机号输入正确之后查询是否有此用户
    findUsername() {
      findUsername({username: this.ruleForm.username}, this).then(res => {
        this.$message.error("该账号已注册，请直接登录");
      })
    },
  },
  mounted() {
    from(this);
  },
  updated() {
    this.disabled = !(isValidPhoneNumber(this.ruleForm.username, this.ruleForm.country) && this.ruleForm.password.length >= 6 && this.ruleForm.confirmPassword.length >= 6 && this.ruleForm.nickname !== "" && this.ruleForm.code !== "" && this.ruleForm.checked);
  }
};
