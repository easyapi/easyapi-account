<template>
  <div class="main">
    <div class="form">
      <div class="headline">用户登录</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="" prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入手机号码">
            <template slot="prepend">+&nbsp;</template>
            <el-select
              style="width: 80px"
              v-model="ruleForm.areaCode"
              filterable
              allow-create
              slot="prepend"
            >
              <el-option
                v-for="item in areaCodes"
                :key="item.value"
                :value="item.value"
                >{{ item.label }}（+{{ item.value }}）</el-option
              >
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            v-model="ruleForm.password"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-checkbox class="checkbox" v-model="ruleForm.rememberMe"
          >记住密码</el-checkbox
        >
        <el-button
          style="width: 100%"
          :disabled="disabled"
          type="primary"
          @click="login"
          >登录</el-button
        >
      </el-form>
      <div class="other-box">
        <nuxt-link to="/signup" class="signup">立即注册</nuxt-link>
        <nuxt-link to="/email-upgrade">邮箱升级为手机号码</nuxt-link>
        <nuxt-link to="/forget-password" class="forget-password"
          >忘记密码？</nuxt-link
        >
      </div>
      <div class="other-login">
        <a href="https://account-api.easyapi.com/auth/wechat">
          <img class="image-svg" src="../../static/svg/weixin.svg" alt="" />
        </a>
        <a href="https://account-api.easyapi.com/auth/qq">
          <img class="image-svg" src="../../static/svg/qq.svg" alt="" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import Index from './index.js'
import { onMounted, onUpdated, reactive } from "vue";

const data = reactive({
  //areaCodes,
  disabled: true,
  ruleForm: {
    areaCode: 86,
    username: "",
    password: "",
    rememberMe: true,
  },
  rules: {
    username: [
      { required: true, message: "请输入您注册时手机号码", trigger: "blur" },
    ],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  },
});

onMounted(() => {
  from(this);
  if (useCookie().get("username") != null) {
    //从Cookie中获取登录账号
    data.ruleForm.username = useCookie().get("username");
  }
});

onUpdated(() => {
  data.disabled = !(
    data.ruleForm.username !== "" && data.ruleForm.password.length >= 6
  );
});

function login() {
  let that = this;
  const options = {
    secure: true,
    sameSite: "none",
  };
  useCookie().set("username", that.ruleForm.username, options);
  let params = sessionStorage.getItem("params");
  let auth = sessionStorage.getItem("auth");
  let from = useCookie().get("from");
  login(that.ruleForm, this)
    .then((res) => {
      if (res.data.code === 1) {
        useCookie().set("authenticationToken", res.data.content.idToken, {
          expires: that.ruleForm.rememberMe ? 30 : 0.1,
          path: "/",
          domain: useCookie().get("domain"),
        });
        if (params !== "" && auth === "三方登录") {
          let json = JSON.parse(params);
          window.location.href =
            "/auth/authorize?client_id=" +
            json.client_id +
            "&response_type=" +
            json.response_type +
            "&scope=" +
            json.scope +
            "&redirect_uri=" +
            json.redirect_uri;
        } else {
          setTimeout(() => {
            useCookie().remove("from");
            window.location.replace(from);
          }, 1000);
        }
        that.$message.success(res.data.message);
      } else {
        that.$message.error(res.data.message);
      }
    })
    .catch((error) => {
      that.$message.error(error.response.data.message);
    });
}
</script>
