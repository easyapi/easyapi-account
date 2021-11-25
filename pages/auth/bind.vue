<template>
  <div class="main">
    <div class="form">
      <div class="headline">绑定账号</div>
      <div class="lg-subtitle ">第一次使用QQ帐号登录，您需要填写账号和密码，以后您也可以使用此账号和密码登录</div>
      <div class="ath">
        <img :src="imageSrc">
        <img class="image-svg mg-b-10" src="../../static/svg/bind.svg" alt="">
        <img class="image-png mg-b-10" src="../../static/easyapi.png">
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="" prop="username">
          <el-input placeholder="请输入手机号码" class="input-with-select" maxlength="11" v-model="ruleForm.username">
            <template slot="prepend">+&nbsp;</template>
            <el-select v-model="ruleForm.areaCode" filterable allow-create slot="prepend" style="width:80px;">
              <el-option v-for="item in options" :key="item.value" :value="item.value">
                {{ item.label }}（+{{ item.value }}）
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input v-model="ruleForm.password" type="password" placeholder="请输入密码">
          </el-input>
        </el-form-item>
        <el-checkbox v-model="ruleForm.rememberMe" checked>记住密码</el-checkbox>
        <el-button @click="handleLogin" type="button" :disabled="disabled" id="btn_sub"
                   class="btn-block btn btn-lg btn-info">绑定账号
        </el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
  import { login } from "../../api/login";
  import { bind } from "../../api/bind";
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
        disabled: true,
        imageSrc: "",
        providerUserId: "",
        providerId: "",
        options: [
          { value: 86, label: "中国大陆" },
          { value: 852, label: "中国香港" },
          { value: 886, label: "中国台湾" },
          { value: 81, label: "日本" },
          { value: 1, label: "美国" }
        ],
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
      // let providerUserId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
      // let providerId = window.location.href.split("?")[1].split("&")[1].split("=")[1];
      // if (providerUserId && providerId) {
      //   this.providerUserId = providerUserId;
      //   this.providerId = providerId;
      // }
      // if (providerId === "qq") {
      //   this.imageSrc = "/static/svg/qq.svg";
      // } else {
      //   this.imageSrc = "/static/svg/weixin.svg";
      // }
    },
    methods: {
      handleLogin() {
        let that = this;
        let data = {
          ...that.ruleForm

        };
        login(data, this).then(res => {
          if (res.data.code === 1) {
            let jwt = res.data.content.idToken;
            if (that.ruleForm.rememberMe) {
              localStorage.setItem("authenticationToken", jwt);
            } else {
              sessionStorage.setItem("authenticationToken", jwt);
            }
            that.bind();
          } else {
            that.$message.error(res.data.message);
          }
        }).catch(error => {
          that.$message.error(error.response.data.message);
        });
      },
      bind() {
        let that = this;
        let data = {
          providerUserId: that.providerUserId,
          providerId: that.providerId
        };
        bind(data, this).then(res => {
          if (res.data.code === 1) {
            Cookies.set("authenticationToken", localStorage.getItem("authenticationToken"), {
              expires: that.ruleForm.rememberMe ? 30 : 0.1,
              path: "/",
              domain: domain
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
      // 校验
      this.disabled = !(this.ruleForm.username !== "" && this.ruleForm.password.length >= 6);
    }
  };
</script>

<style lang="less" scoped>

</style>
