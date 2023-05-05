import { findUsername, sendCode, signup } from '../../api/signup'
import { areaCodes } from '../../utils/area-code'

// import { isValidPhoneNumber } from 'libphonenumber-js'
// import useCookie() from 'js-cookie'
import from from '../../utils/from'

export default {
  name: 'Signup',
  head() {
    return {
      title: '注册 - EasyAPI服务平台',
      meta: [
        { hid: 'description', name: 'description', content: 'EasyAPI账号注册' },
        { hid: 'keyword', name: 'keyword', content: '账号注册' },
      ],
    }
  },
  data() {
    const validPhoneNumber = (rule, value, callback) => {
      if (isValidPhoneNumber(value, this.ruleForm.country))
        callback()
      else
        callback(new Error('手机号码格式有误'))
    }
    return {
      areaCodes,
      disabled: true,
      sendCodeBtn: true, // 默认不可以发送验证码
      existUsername: false, // 默认用户名不存在
      sendCodeCount: '获取验证码',
      ruleForm: {
        areaCode: 86,
        country: 'CN',
        username: '',
        code: '',
        nickname: '',
        password: '',
        confirmPassword: '',
        checked: true,
      },
      rules: {
        username: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validPhoneNumber, trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '验证码格式有误', trigger: 'blur' },
        ],
        nickname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码6~16位之间，建议包含英文和标点符号', trigger: 'blur' },
        ],
        confirmPassword: [{ required: true, message: '请再输入一次密码', trigger: 'blur' }],
      },
    }
  },
  methods: {
    signup() {
      const that = this
      if (that.existUsername) {
        that.$message.error('该账号已注册，请直接登录')
        return
      }
      if (that.ruleForm.password !== that.ruleForm.confirmPassword) {
        that.$message.error('确认密码不一致')
        return
      }
      if (!that.ruleForm.checked) {
        that.$message.error('请勾选同意EasyAPI用户协议')
        return
      }
      const from = useCookie().get('from')
      signup(that.ruleForm, this)
        .then((res) => {
          if (res.data.code === 1) {
            useCookie().set('authenticationToken', res.data.content, {
              expires: that.ruleForm.rememberMe ? 30 : 0.1,
              path: '/',
              domain: useCookie().get('domain'),
            })
            that.$message.success(res.data.message)
            setTimeout(() => {
              useCookie().remove('from')
              window.location.replace(from)
            }, 1000)
          } else {
            that.$message.error(res.data.message)
          }
        })
        .catch((error) => {
          that.$message.error(error.response.data.message)
        })
    },

    /**
     * 发送验证码
     */
    sendCode() {
      if (this.sendCodeBtn)
        return

      const that = this
      let timer
      sendCode({ mobile: that.ruleForm.username }, this)
        .then((res) => {
          if (res.data.code === 1) {
            that.$message.success('验证码发送成功')
            let second = 60
            that.sendCodeBtn = true
            timer = setInterval(() => {
              second--
              if (second === 0) {
                that.sendCodeBtn = false
                that.sendCodeCount = '获取验证码'
                clearInterval(timer)
                return
              }
              that.sendCodeCount = `剩余${second}秒`
            }, 1000)
          } else {
            that.$message.error(res.data.message)
          }
        })
        .catch((error) => {
          that.$message.error(error.response.data.message)
        })
    },

    /**
     * 在手机号输入正确之后查询是否有此用户
     */
    findUsername() {
      findUsername({ username: this.ruleForm.username }, this)
        .then((res) => {
          this.existUsername = true
          this.$message.error('该账号已注册，请直接登录')
        })
        .catch((error) => {
          this.sendCodeBtn = false
        })
    },
  },
  mounted() {
    from(this)
  },
  updated() {
    this.disabled = !(
      isValidPhoneNumber(this.ruleForm.username, this.ruleForm.country)
      && this.ruleForm.password.length >= 6
      && this.ruleForm.confirmPassword.length >= 6
      && this.ruleForm.nickname !== ''
      && this.ruleForm.code !== ''
      && this.ruleForm.checked
    )
  },
}
