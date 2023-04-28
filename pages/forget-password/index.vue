<template>
  <div id="app">
    <div class="main">
      <div class="form">
        <div class="headline">重置密码</div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="" prop="username">
            <el-input placeholder="请输入手机号码" maxlength="11" v-model="ruleForm.username">
              <template slot="prepend">+&nbsp;</template>
              <el-select v-model="ruleForm.areaCode" filterable allow-create slot="prepend" style="width: 80px">
                <el-option v-for="item in areaCodes" :key="item.value" :value="item.value">{{ item.label }}（+{{ item.value }}）</el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="code">
            <el-input placeholder="请输入验证码" maxlength="6" onkeyup="value=value.replace(/[^\d]/g,'')" v-model="ruleForm.code" class="code"></el-input>
            <el-button :disabled="sendCodeBtn" class="getCode" @click="sendCode">{{ sendCodeCount }}</el-button>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input placeholder="请输入新密码" type="password" v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="" prop="confirmPassword">
            <el-input placeholder="请再输入一次密码" type="password" v-model="ruleForm.confirmPassword"></el-input>
          </el-form-item>
          <el-button style="width: 100%" type="primary" :disabled="disabled" @click="forgetPassword">确定</el-button>
        </el-form>
        <div class="other-box">
          <nuxt-link to="/login" class="login">返回登录</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Index from './index.js'

// export default Index
import { getCurrentInstance, onUpdated, reactive } from 'vue'

const { proxy: $vm } = getCurrentInstance()

const data = reactive({
	//areaCodes,
	disabled: true,
	sendCodeBtn: false,
	sendCodeCount: '获取验证码',
	ruleForm: {
		areaCode: 86,
		username: '',
		code: '',
		password: '',
		confirmPassword: ''
	},
	rules: {
		username: [{
				required: true,
				message: '请输入手机号码',
				trigger: 'blur'
			},
			{
				pattern: /^(13[0-9]|14[01456879]|15[03-5-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
				message: '手机号码格式有误',
				trigger: 'blur'
			}
		],
		code: [
			{ required: true, message: '请输入验证码', trigger: 'blur' },
			{ pattern: /^\d{6}$/, message: '验证码格式有误', trigger: 'blur' }
		],
		password: [
			{ required: true, message: '密码6~16位之间,建议包含英文和标点符号', trigger: 'blur' },
			{ min: 6, max: 16, message: '密码6~16位之间,建议包含英文和标点符号', trigger: 'blur' }
		],
		confirmPassword: [{ required: true, message: '请再输入一次密码', trigger: 'blur' }]
	}
})

onUpdated(() => {
	// 校验
	data.disabled = !(
		data.ruleForm.username !== '' &&
		data.ruleForm.code !== '' &&
		data.ruleForm.password.length >= 6 &&
		data.ruleForm.confirmPassword.length >= 6
	)
})

function forgetPassword() {
	let that = this
	/* Warn: Cannot find refs name */
	$vm.$refs['ruleForm'].validate(valid => {
		if (valid) {
			if (that.ruleForm.password !== that.ruleForm.confirmPassword) {
				that.$message.error('确认密码不一致')
				return
			}
			forgetPassword(that.ruleForm, this)
				.then(res => {
					if (res.data.code !== 1) {
						that.$message.error(res.data.message)
						return
					}
					that.$message.success(res.data.message)
					setTimeout(() => {
						window.location.replace('/login')
					}, 1000)
				})
				.catch(error => {
					that.$message.error(error.response.data.message)
				})
		}
	})
}

function sendCode() {
	let that = this
	let timer
	let telStr = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
	if (telStr.test(that.ruleForm.username)) {
		let params = {
			mobile: that.ruleForm.username
		}
		sendCode(params, this)
			.then(res => {
				if (res.data.code === 1) {
					that.$message.success(res.data.message)
				} else {
					that.$message.error(res.data.message)
				}
			})
			.catch(error => {
				that.$message.error(error.response.data.message)
			})
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
		that.$message.error('请输入正确的手机号码')
	}
}
</script>
