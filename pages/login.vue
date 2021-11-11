<template>
  <div id="app">
    <div class="container">
      <div class="form yahei">
        <div class="headline ">用户登录</div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="" prop="username">
            <el-input v-model="ruleForm.username" class="input-with-select" placeholder="请输入手机号码"
                      style="width: 350px;">
              <template slot="prepend">+&nbsp;</template>
              <el-select v-model="ruleForm.areaCode" filterable allow-create slot="prepend">
                <el-option v-for="item in options" :key="item.value" :value="item.value">
                  {{ item.label }}（+{{ item.value }}）
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input v-model="ruleForm.password" placeholder="请输入密码" type="password" style="width: 350px;">
            </el-input>
          </el-form-item>
          <el-checkbox v-model="ruleForm.rememberMe">记住密码</el-checkbox>
          <input :disabled="disabled" type="button" id="btn_sub" @click="onSubmit"
                 class="btn-block btn btn-lg btn-info" value="登录"/>
        </el-form>

        <div class="otherbox a-center">
          <a class="signup" href="./signup">立即注册</a>
          <a href="email-upgrade">邮箱升级为手机号码</a>
          <a class="forget-password" href="./forget-password">忘记密码？</a>
        </div>

        <div class="otherlogin">
          <a href="https://account-api.easyapi.com/auth/wechat"><i class="iconfont icon-weixing color-success"></i>
          </a>
          <a href="https://account-api.easyapi.com/auth/qq"><i class="iconfont icon-iconfonticon6"></i> </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Terms",
    head() {
      return {
        title: "登录 - EasyAPI服务平台",
        meta: [
          { hid: "description", name: "description", content: "EasyAPI账号登录" },
          { hid: "keyword", name: "keyword", content: "登录" }
        ],
        link: [
          { rel: "stylesheet", href: "https://static.easyapi.com/styles/base.css" }
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
          username: [{ required: true, message: "请输入您注册时手机号码", trigger: "blur" }
            // {
            //   pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            //   message: '手机号码格式有误',
            //   trigger: 'blur'
            // }
          ],
          password: [{ required: true, message: "请输入密码", trigger: "blur" }]
        }
      };
    },
    methods: {
      //登录
      onSubmit() {
        let that = this;
        // Cookies.set("username", that.ruleForm.username, {expires: 7});
        axios({
          method: "POST",
          url: "https://account-api.easyapi.com/authenticate",
          data: {
            ...that.ruleForm
          }
        }).then(res => {
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
      // if (Cookies.get("username") != null) {
      //   this.ruleForm.username = Cookies.get("username");
      // }
    },
    updated() {
      // this.disabled = !(this.ruleForm.username !== "" && this.ruleForm.password.length >= 6);
    }
  };
</script>

<style>
  .el-select .el-input {
    width: 130px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
