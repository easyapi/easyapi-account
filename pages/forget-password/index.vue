<template>
  <div id="app">
    <div class="container">
      <div class="form">
        <div class="headline">重置密码</div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="" prop="username">
            <el-input placeholder="请输入手机号码" maxlength="11" v-model="ruleForm.username">
              <template slot="prepend">+&nbsp;</template>
              <el-select v-model="ruleForm.areaCode" filterable allow-create slot="prepend" style="width:80px;">
                <el-option v-for="item in options" :key="item.value" :value="item.value">
                  {{ item.label }}（+{{ item.value }}）
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="code">
            <el-input placeholder="请输入验证码" maxlength="6" onkeyup="value=value.replace(/[^\d]/g,'')"
                      v-model="ruleForm.code" class="code"></el-input>
            <el-button :disabled="sendCodeBtn" class="getCode" @click="sendCode">{{sendCodeCount}}</el-button>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input placeholder="请输入新密码" type="password" v-model="ruleForm.password">
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="confirmPassword">
            <el-input placeholder="请再输入一次密码" type="password" v-model="ruleForm.confirmPassword">
            </el-input>
          </el-form-item>
          <el-button :disabled="disabled" @click="reset">确定</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ForgetPassword",
    head() {
      return {
        title: "忘记密码 - EasyAPI服务平台",
        meta: [
          {
            hid: "description",
            name: "description",
            content: "用户忘记密码找回密码"
          },
          {
            hid: "keyword",
            name: "keyword",
            content: "忘记密码,找回密码"
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
            { required: true, message: "请输入验证码", trigger: "blur" },
            { pattern: /^\d{6}$/, message: "验证码格式有误", trigger: "blur" }
          ],
          password: [
            { required: true, message: "密码6~16位之间，建议包含英文和标点符号", trigger: "blur" },
            { min: 6, max: 16, message: "密码6~16位之间，建议包含英文和标点符号", trigger: "blur" }
          ],
          confirmPassword: [
            { required: true, message: "请再输入一次密码", trigger: "blur" }]
        }
      };
    },
    methods: {
      //确定
      reset() {
        let that = this;
        if (that.ruleForm.password !== that.ruleForm.confirmPassword) {
          that.$message.error("确认密码不一致");
        } else {
          axios({
            method: "POST",
            url: "https://account-api.easyapi.com/api/account/forget-password/reset",
            data: {
              ...that.ruleForm
            }
          }).then(res => {
            if (res.data.code === 1) {
              that.$message.success(res.data.message);
              setTimeout(() => {
                window.location.replace("login");
              }, 1000);
            } else {
              that.$message.error(res.data.message);
            }
          }).catch(error => {
            that.$message.error(error.response.data.message);
          });
        }
      },
      //发送验证码
      sendCode() {
        let that = this;
        let timer;
        let telStr = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        if (telStr.test(that.ruleForm.username)) {
          axios({
            url: "https://account-api.easyapi.com/captcha/send",
            method: "GET",
            params: {
              mobile: that.ruleForm.username
            }
          }).then(res => {
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
</script>

<style lang="less" scoped>

</style>
