import './index.scss'

import { upgradeEmail } from '../../api/email'
import { sendCode } from '../../api/signup'
import { areaCodes } from '../../utils/area-code'
import Cookies from 'js-cookie'
import { isValidPhoneNumber } from 'libphonenumber-js'

export default {
  name: 'EmailUpgrade',
  head() {
    return {
      title: '邮箱升级 - EasyAPI服务平台',
      meta: [
        { hid: 'description', name: 'description', content: 'EasyAPI邮箱升级为手机号码' },
        { hid: 'keyword', name: 'keyword', content: '邮箱升级为手机号码' }
      ]
    }
  },
  data() {
    let validPhoneNumber = (rule, value, callback) => {
      if (isValidPhoneNumber(value, this.ruleForm.country)) {
        callback()
      } else {
        callback(new Error('手机号码格式有误'))
      }
    }
    return {
      areaCodes,
      disabled: true,
      sendCodeBtn: false,
      sendCodeCount: '获取验证码',
      ruleForm: {
        areaCode: 86,
        country: 'CN',
        email: '',
        mobile: '',
        code: '',
        password: ''
      },
      emailRegex: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, //邮箱正则表达式
      rules: {
        email: [
          { required: true, message: '请输入邮箱账号', trigger: 'blur' },
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: '邮箱账号格式有误',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validPhoneNumber, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '验证码格式有误', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码6~16位之间，建议包含英文和标点符号', trigger: 'blur' },
          { min: 6, max: 16, message: '密码6~16位之间，建议包含英文和标点符号', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
     * 邮箱升级
     */
    upgradeEmail() {
      let that = this
      let from = Cookies.get('from')
      upgradeEmail(that.ruleForm, this)
        .then(res => {
          if (res.data.code === 1) {
            that.$message.success(res.data.message)
            setTimeout(() => {
              Cookies.remove('from')
              window.location.replace(from)
            }, 1000)
          } else {
            that.$message.error(res.data.message)
          }
        })
        .catch(error => {
          that.$message.error(error.response.data.message)
        })
    },

    /**
     * 发送验证码
     */
    sendCode() {
      let that = this
      let timer
      sendCode({ mobile: that.ruleForm.mobile }, this)
        .then(res => {
          if (res.data.code === 1) {
            that.$message.success('验证码发送成功')
            let second = 60
            that.sendCodeBtn = true
            timer = setInterval(() => {
              second--
              if (second === 0) {
                that.sendCodeCount = '获取验证码'
                that.disabled = false
                clearInterval(timer)
                return
              }
              that.sendCodeCount = `剩余${second}秒`
            }, 1000)
          } else {
            that.$message.error(res.data.message)
          }
        })
        .catch(error => {
          that.$message.error(error.response.data.message)
        })
    }
  },
  updated() {
    //校验
    this.disabled = !(
      this.emailRegex.test(this.ruleForm.email) &&
      isValidPhoneNumber(this.ruleForm.mobile, this.ruleForm.country) &&
      this.ruleForm.password.length >= 6 &&
      this.ruleForm.code.length === 6
    )
  }
}
