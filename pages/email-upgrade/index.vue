<template>
  <div class="main">
    <div class="form">
      <div class="headline">邮箱升级</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="" prop="email">
          <el-input placeholder="请输入原邮箱账号" v-model="ruleForm.email">
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input placeholder="请输入原邮箱密码" type="password" v-model="ruleForm.password">
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="mobile">
          <el-input placeholder="请输入新手机号码" maxlength="11" v-model="ruleForm.mobile">
            <template slot="prepend">+&nbsp;</template>
            <el-select v-model="ruleForm.areaCode" filterable allow-create slot="prepend" style="width:80px;">
              <el-option v-for="item in options" :key="item.value" :value="item.value">
                {{ item.label }}（+{{ item.value }}）
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="code">
          <el-input class="code" placeholder="请输入验证码" maxlength="6" onkeyup="value=value.replace(/[^\d]/g,'')"
                    v-model="ruleForm.code"></el-input>
          <el-button class="getCode" :disabled="sendCodeBtn" @click="sendCode">{{sendCodeCount}}</el-button>
        </el-form-item>
        <el-button style="width: 100%" type="primary" :disabled="disabled" @click="onSubmit">升级</el-button>
      </el-form>

      <div class="other-box">
        <a href="../login">我已升级成功，直接登录</a>
      </div>
    </div>
  </div>
</template>

<script>
  import { updateEmail } from "../../api/email";
  import { sendCode } from "../../api/signup";
  import Cookies from "js-cookie";

  export default {
    name: "EmailUpgrade",
    head() {
      return {
        title: "邮箱升级 - EasyAPI服务平台",
        meta: [
          {
            hid: "description",
            name: "description",
            content: "EasyAPI邮箱升级为手机号码"
          },
          {
            hid: "keyword",
            name: "keyword",
            content: "邮箱升级为手机号码"
          }
        ]
      };
    },
    data() {
      return {
        disabled: true,
        sendCodeBtn: false,
        sendCodeCount: "获取验证码",
        options: [{
          value: "86",
          label: "中国大陆"
        }, {
          value: "852",
          label: "中国香港"
        }, {
          value: "886",
          label: "中国台湾"
        }, {
          value: "81",
          label: "日本"
        }, {
          value: "1",
          label: "美国"
        }],
        ruleForm: {
          areaCode: 86,
          email: "",
          mobile: "",
          code: "",
          password: ""
        },
        rules: {
          email: [
            { required: true, message: "请输入邮箱账号", trigger: "blur" },
            {
              pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
              message: "邮箱账号格式有误",
              trigger: "blur"
            }
          ],
          mobile: [
            { required: true, message: "请输入手机号码", trigger: "blur" },
            {
              pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
              message: "手机号码格式有误",
              trigger: "blur"
            }
          ],
          code: [
            { required: true, message: "请输入验证码", trigger: "blur" },
            { pattern: /^\d{6}$/, message: "验证码格式有误", trigger: "blur" }
          ],
          password: [
            { required: true, message: "密码6~16位之间，建议包含英文和标点符号", trigger: "blur" },
            { min: 6, max: 16, message: "密码6~16位之间，建议包含英文和标点符号", trigger: "blur" }
          ]
        }
      };
    },
    methods: {
      //升级
      onSubmit() {
        let that = this;
        let data = {
          ...that.ruleForm
        };
        updateEmail(data, this).then(res => {
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
          let params = {
            mobile: that.ruleForm.mobile
          };
          sendCode(params, this).then(res => {
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
        .password.length >= 6 && this.ruleForm.code.length == 6);
    }
  };
</script>

<style lang="less" scoped>

</style>
