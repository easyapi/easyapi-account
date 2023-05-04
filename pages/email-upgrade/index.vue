<template>
  <div class="main">
    <div class="form">
      <div class="headline">邮箱升级</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="" prop="email">
          <el-input placeholder="请输入原邮箱账号" v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input placeholder="请输入原邮箱密码" type="password" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="" prop="mobile">
          <el-input placeholder="请输入新手机号码" maxlength="11" v-model="ruleForm.mobile">
            <template slot="prepend">+&nbsp;</template>
            <el-select v-model="ruleForm.areaCode" filterable allow-create slot="prepend" style="width: 80px">
              <el-option v-for="item in areaCodes" :key="item.value" :value="item.value">{{ item.label }}（+{{ item.value }}）</el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="code">
          <el-input class="code" placeholder="请输入验证码" maxlength="6" onkeyup="value=value.replace(/[^\d]/g,'')" v-model="ruleForm.code"></el-input>
          <el-button class="getCode" :disabled="sendCodeBtn" @click="sendCode">{{ sendCodeCount }}</el-button>
        </el-form-item>
        <el-button style="width: 100%" type="primary" :disabled="disabled" @click="upgradeEmail">升级</el-button>
      </el-form>

      <div class="other-box">
        <nuxt-link to="/login">我已升级成功，直接登录</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Index from './index.js'

// export default Index
import { onUpdated, reactive } from 'vue'

const useData = () => data

const data = reactive({
	//areaCodes,
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
			{ validator: isValidPhoneNumber, trigger: 'blur' }
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
})

onUpdated(() => {
	//校验
	data.disabled = !(
		data.emailRegex.test(data.ruleForm.email) &&
		isValidPhoneNumber(data.ruleForm.mobile, data.ruleForm.country) &&
		data.ruleForm.password.length >= 6 &&
		data.ruleForm.code.length === 6
	)
})

function upgradeEmail(this: any) {
	let that = this
	let from = useCookie().get('from')
	upgradeEmail(that.ruleForm, this)
		.then((res: { data: { code: number; message: any } }) => {
			if (res.data.code === 1) {
				that.$message.success(res.data.message)
				setTimeout(() => {
					useCookie().remove('from')
					window.location.replace(from)
				}, 1000)
			} else {
				that.$message.error(res.data.message)
			}
		})
		.catch((error: { response: { data: { message: any } } }) => {
			that.$message.error(error.response.data.message)
		})
}

function sendCode(this: any) {
	let that = this
	let timer: string|number|NodeJS.Timeout|undefined
	sendCode({ mobile: that.ruleForm.mobile }, this)
		.then((res: { data: { code: number; message: any } }) => {
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
		.catch((error: { response: { data: { message: any } } }) => {
			that.$message.error(error.response.data.message)
		})
}
</script>
