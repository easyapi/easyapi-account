import './index.scss'

import {upgradeEmail} from "../../api/email";
import {sendCode} from "../../api/signup";
import {areaCodes} from '../../utils/area-code'
import Cookies from "js-cookie";

export default {
  name: "EmailUpgrade",
  head() {
    return {
      title: "邮箱升级 - EasyAPI服务平台",
      meta: [
        {hid: "description", name: "description", content: "EasyAPI邮箱升级为手机号码"},
        {hid: "keyword", name: "keyword", content: "邮箱升级为手机号码"}
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
        email: "",
        mobile: "",
        code: "",
        password: ""
      },
      rules: {
        email: [
          {required: true, message: "请输入邮箱账号", trigger: "blur"},
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱账号格式有误",
            trigger: "blur"
          }
        ],
        mobile: [
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
        password: [
          {required: true, message: "密码6~16位之间，建议包含英文和标点符号", trigger: "blur"},
          {min: 6, max: 16, message: "密码6~16位之间，建议包含英文和标点符号", trigger: "blur"}
        ]
      }
    };
  },
  methods: {
    /**
     * 邮箱升级
     */
    upgradeEmail() {
      let that = this;
      let from = Cookies.get("from")
      upgradeEmail(that.ruleForm, this).then(res => {
        if (res.data.code === 1) {
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
    },

    /**
     * 发送验证码
     */
    sendCode() {
      let that = this;
      let timer;
      let telStr = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (telStr.test(that.ruleForm.mobile)) {
        sendCode({mobile: that.ruleForm.mobile}, this).then(res => {
          if (res.data.code === 1) {
            that.$message.success("验证码发送成功");
            let second = 60;
            that.sendCodeBtn = true;
            timer = setInterval(() => {
              second--;
              if (second === 0) {
                that.sendCodeCount = "获取验证码";
                that.disabled = false;
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
      } else {
        that.$message.error("请输入正确的手机号码");
      }
    }
  },
  updated() {
    //校验
    let telStr = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    let email = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    this.disabled = !(email.test(this.ruleForm.email) && telStr.test(this.ruleForm.mobile) && this.ruleForm
      .password.length >= 6 && this.ruleForm.code.length === 6);
  }
};
