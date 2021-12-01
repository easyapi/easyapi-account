<template>
  <div class="main">
    <div class="form">
      <div class="headline ">用户登录</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="" prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入手机号码">
            <template slot="prepend">+&nbsp;</template>
            <el-select style="width: 80px" v-model="ruleForm.areaCode" filterable allow-create slot="prepend">
              <el-option v-for="item in options" :key="item.value" :value="item.value">
                {{ item.label }}（+{{ item.value }}）
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input v-model="ruleForm.password" placeholder="请输入密码" type="password">
          </el-input>
        </el-form-item>
        <el-checkbox class="checkbox" v-model="ruleForm.rememberMe">记住密码</el-checkbox>
        <el-button style="width: 100%" :disabled="disabled" type="primary" @click="onSubmit">登录</el-button>
      </el-form>
      <div class="other-box">
        <nuxt-link to="signup" class="signup">立即注册</nuxt-link>
        <nuxt-link to="email-upgrade">邮箱升级为手机号码</nuxt-link>
        <nuxt-link to="forget-password" class="forget-password">忘记密码？</nuxt-link>
      </div>

      <div class="other-login">
        <a href="https://account-api.easyapi.com/auth/wechat"><i class="iconfont success icon-iconfontweixin"></i>
        </a>
        <a href="https://account-api.easyapi.com/auth/qq"><i class="iconfont icon-QQ"></i> </a>
      </div>
    </div>
  </div>
</template>

<script>
  import { login } from "../../api/login";
  import Cookies from "js-cookie";

  export default {
    name: "Terms",
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
        disabled: true,
        options: [
          { value: "86", label: "中国大陆" },
          { value: "852", label: "中国香港" },
          { value: "886", label: "中国台湾" },
          { value: "81", label: "日本" },
          { value: "1", label: "美国" }
        ],
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
      //登录
      onSubmit() {
        let that = this;
        let url = sessionStorage.getItem("url");
        let auth = sessionStorage.getItem("auth");
        let data = {
          ...that.ruleForm
        };
        login(data, this).then(res => {
          if (res.data.code === 1) {
            Cookies.set("authenticationToken", res.data.content.idToken, {
              expires: that.ruleForm.rememberMe ? 30 : 0.1,
              path: "/",
              domain: domain
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

    }
    ,
    mounted() {
      //从Cookie中获取账号;
      if (Cookies.get("username") != null) {
        this.ruleForm.username = Cookies.get("username");
      }
    },
    updated() {
      this.disabled = !(this.ruleForm.username !== "" && this.ruleForm.password.length >= 6);
    }
  };
</script>

<style>
  .el-select .el-input {
    width: 75px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
