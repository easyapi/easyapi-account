import './index.scss'

import {forgetPassword} from "../../api/forget-password";
import {sendCode} from "../../api/signup";
import {areaCodes} from '../../utils/area-code'

export default {
  name: "ForgetPassword",
  head() {
    return {
      title: "忘记密码 - EasyAPI服务平台",
      meta: [
        {hid: "description", name: "description", content: "用户忘记密码找回密码"},
        {hid: "keyword", name: "keyword", content: "忘记密码,找回密码"}
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
        username: "",
        code: "",
        password: "",
        confirmPassword: ""
      },
      rules: {
        username: [{
          required: true,
          message: "请输入手机号码",
          trigger: "blur"
        },
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
        ],
        confirmPassword: [
          {required: true, message: "请再输入一次密码", trigger: "blur"}]
      }
    };
  },
  methods: {
    forgetPassword() {
      let that = this;
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (that.ruleForm.password !== that.ruleForm.confirmPassword) {
            that.$message.error("确认密码不一致");
            return
          }
          forgetPassword(that.ruleForm, this).then(res => {
            if (res.data.code !== 1) {
              that.$message.error(res.data.message);
              return
            }
            that.$message.success(res.data.message);
            setTimeout(() => {
              window.location.replace("/login");
            }, 1000);
          }).catch(error => {
            that.$message.error(error.response.data.message);
          });
        }
      })
    },
    /**
     * 发送验证码
     */
    sendCode() {
      let that = this;
      let timer;
      let telStr = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (telStr.test(that.ruleForm.username)) {
        let params = {
          mobile: that.ruleForm.username
        };
        sendCode(params, this).then(res => {
          if (res.data.code === 1) {
            that.$message.success(res.data.message);
          } else {
            that.$message.error(res.data.message);
          }
        }).catch(error => {
          that.$message.error(error.response.data.message);
        });
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
        that.$message.error("请输入正确的手机号码");
      }
    }
  },
  updated() {
    // 校验
    this.disabled = !(this.ruleForm.username !== "" && this.ruleForm.code !== "" && this.ruleForm.password.length >= 6 && this.ruleForm.confirmPassword.length >= 6);
  }
};
