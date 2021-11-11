<template>
  <div class="container">
    <div class="form">
      <div class="headline text-center">用户注册</div>
      <div class="lg-body bgf">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="" prop="username">
            <el-input placeholder="请输入手机号码" class="input-with-select" maxlength="11" v-model="ruleForm.username"
                      @input="findUsername" style="width: 350px;">
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
                      v-model="ruleForm.code" style="width: 220px;"></el-input>
            <input type="button" :disabled="sendCodeBtn" id="sendCodeBtn" @click="sendCode" :value="sendCodeCount"/>
          </el-form-item>
          <el-form-item label="" prop="nickname">
            <el-input placeholder="请输入姓名" v-model="ruleForm.nickname" style="width: 350px;"></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input placeholder="请设置密码" type="password" v-model="ruleForm.password" style="width: 350px;">
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="confirmPassword">
            <el-input placeholder="请再输入一次密码" type="password" v-model="ruleForm.confirmPassword" style="width: 350px;">
            </el-input>
          </el-form-item>
          <el-checkbox v-model="ruleForm.checked">点击注册表示您同意
            <span class="text-success"><a href="terms" target="_blank">《EasyAPI服务条款》</a></span>
          </el-checkbox>
          <el-button :disabled="disabled" id="btn_sub" @click="onSubmit"
                 class="btn-block btn btn-lg btn-info" >注 册</el-button>
        </el-form>

        <div class="otherbox a-center">
          <a href="./login">我已有EasyAPI账号，直接登录</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Signup',
  head() {
    return {
      title: '注册 - EasyAPI服务平台',
      meta: [
        {hid: 'description', name: 'description', content: 'EasyAPI账号注册'},
        {hid: 'keyword', name: 'keyword', content: '账号注册'}
      ],
      link: [
        {rel: 'stylesheet', href: 'https://static.easyapi.com/styles/base.css'}
      ]
    }
  },
  data() {
    return {
      disabled: true,
      sendCodeBtn: false,
      sendCodeCount: "获取验证码",
      options: [
        {value: '86', label: '中国大陆'},
        {value: '852', label: '中国香港'},
        {value: '886', label: '中国台湾'},
        {value: '81', label: '日本'},
        {value: '1', label: '美国'}
      ],
      ruleForm: {
        areaCode: 86,
        username: '',
        code: '',
        nickname: '',
        password: '',
        confirmPassword: '',
        checked: true,
      },
      rules: {
        username: [
          {required: true, message: '请输入手机号码', trigger: 'blur'},
          {
            pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            message: '手机号码格式有误',
            trigger: 'blur'
          }
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'},
          {pattern: /^\d{6}$/, message: '验证码格式有误', trigger: 'blur'}
        ],
        nickname: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码6~16位之间，建议包含英文和标点符号', trigger: 'blur'},
          {min: 6, max: 16, message: '密码6~16位之间，建议包含英文和标点符号', trigger: 'blur'}
        ],
        confirmPassword: [
          {required: true, message: '请再输入一次密码', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    //注册
    onSubmit() {
      let that = this;
      if (that.ruleForm.password !== that.ruleForm.confirmPassword) {
        that.$message.error('确认密码不一致');
      } else {
        if (!that.ruleForm.checked) {
          that.$message.error('请勾选同意EasyAPI用户协议');
        } else {
          axios({
            method: 'POST',
            url: 'https://account-api.easyapi.com/api/account/signup',
            data: {
              ...that.ruleForm
            },
          }).then(res => {
            if (res.data.code === 1) {
              Cookies.set("authenticationToken", res.data.content, {
                expires: that.ruleForm.rememberMe ? 30 : 0.1,
                path: '/',
                domain: domain
              });
              that.$message.success(res.data.message);
              setTimeout(() => {
                Cookies.remove('from');
                window.location.replace(from);
              }, 1000);

            } else {
              that.$message.error(res.data.message);
            }
          }).catch(error => {
            that.$message.error(error.response.data.message);
          })
        }
      }
    },
    //在手机号输入正确之后查询是否有此用户
    findUsername() {
      let that = this;
      let telStr = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (telStr.test(this.ruleForm.username)) {
        axios({
          url: "https://account-api.easyapi.com/api/account/find",
          method: "GET",
          params: {"username": that.ruleForm.username},
        }).then(res => {
          that.$message.error('该账号已注册，请直接登录');
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
          url: "https://account-api.easyapi.com/api/account/find",
          method: "GET",
          params: {"username": that.ruleForm.username},
        }).then(res => {
          that.$message.error('该账号已注册，请直接登录');
        }).catch(error => {
          axios({
            url: "https://account-api.easyapi.com/captcha/send",
            method: "GET",
            params: {
              mobile: that.ruleForm.username
            }
          }).then(res => {
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
                  return
                }
                that.sendCodeCount = `剩余${second}秒`
              }, 1000)
            } else {
              that.$message.error(res.data.message);
            }
          }).catch(error => {
            that.$message.error(error.response.data.message);
          })
        })
      } else {
        that.$message.error('请输入正确的手机号码');
      }
    }
  },
  updated() {
    let telReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    this.disabled = !(telReg.test(this.ruleForm.username) && this.ruleForm.password.length >= 6 && this.ruleForm
      .confirmPassword.length >= 6 && this.ruleForm.nickname !== '' && this.ruleForm.code !== '' && this
      .ruleForm
      .checked);
  }
}
</script>

<style lang="less" scoped>

</style>
