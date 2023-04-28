<template>
  <div class="main">
    <div class="form">
      <div class="headline">绑定账号</div>
      <div class="lg-subtitle mb-10">
        第一次使用
        <span>{{ providerId === 'wechat' ? '微信' : 'QQ' }}</span>
        帐号登录，您需要填写账号和密码，以后您也可以使用此账号和密码登录
      </div>
      <div class="ath mb-10">
        <img class="image-png" :src="imageSrc" alt="" />
        <img class="image-svg" src="../../../static/svg/bind.svg" alt="" />
        <img class="image-png" src="../../../static/easyapi.png" alt="" />
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="" prop="username">
          <el-input placeholder="请输入手机号码" class="input-with-select" maxlength="11" v-model="ruleForm.username">
            <template slot="prepend">+&nbsp;</template>
            <el-select v-model="ruleForm.areaCode" filterable allow-create slot="prepend" style="width: 80px">
              <el-option v-for="item in areaCodes" :key="item.value" :value="item.value">{{ item.label }}(+{{ item.value }})</el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input v-model="ruleForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-checkbox class="checkbox" v-model="ruleForm.rememberMe" checked>记住密码</el-checkbox>
        <el-button style="width: 100%" @click="login" type="primary" :disabled="disabled" id="btn_sub" class="btn-block btn btn-lg btn-info">
          绑定账号
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import Index from './index.js'

// export default Index
import { getCurrentInstance, onMounted, onUpdated, reactive } from 'vue'

const useData = () => data
const { proxy: $vm } = getCurrentInstance()

const data = reactive({
	//areaCodes,
	disabled: true,
	imageSrc: '',
	providerUserId: '',
	providerId: '',
	options: [],
	ruleForm: {
		areaCode: 86,
		country: 'CN',
		username: '',
		password: '',
		rememberMe: true
	},
	rules: {
		username: [
			{ required: true, message: '请输入手机号码', trigger: 'blur' },
			{ validator: validPhoneNumber, trigger: 'blur' }
		],
		password: [
			{ required: true, message: '密码6~16位之间，建议包含英文和标点符号', trigger: 'blur' },
			{ min: 6, max: 16, message: '密码6~16位之间，建议包含英文和标点符号', trigger: 'blur' }
		]
	}
})

onMounted(() => {
	let providerUserId = window.location.href.split('?')[1].split('&')[0].split('=')[1]
	let providerId = window.location.href.split('?')[1].split('&')[1].split('=')[1]
	if (providerUserId && providerId) {
		data.providerUserId = providerUserId
		data.providerId = providerId
	}
	if (providerId === 'qq') {
		data.imageSrc = require('/static/svg/qq.svg')
	} else {
		data.imageSrc = require('/static/svg/weixin.svg')
	}
	from(this)
})

onUpdated(() => {
	data.disabled = !(isValidPhoneNumber(data.ruleForm.username, data.ruleForm.country) && data.ruleForm.password.length >= 6)
})

function login(this: { login: () => void }) {
	login(data.ruleForm, this)
		.then((res: { data: { code: number; message: any; content: { idToken: any } } }) => {
			if (res.data.code !== 1) {
				/* Warn: Unknown source: $message */
				$vm.$message.error(res.data.message)
			}
			useCookie().set('authenticationToken', res.data.content.idToken, {
				expires: data.ruleForm.rememberMe ? 30 : 0.1,
				path: '/',
				domain: useCookie().get('domain')
			})
			bind()
			/* Warn: Unknown source: $message */
			$vm.$message.success('绑定成功')
		})
		.catch((error: { response: { data: { message: any } } }) => {
			/* Warn: Unknown source: $message */
			$vm.$message.error(error.response.data.message)
		})
}

function bind(this: any) {
	let from = useCookie().get('from')
	bind({
			providerUserId: data.providerUserId,
			providerId: data.providerId
		},
		this
	).then((res: { data: { code: number; message: any } }) => {
		if (res.data.code !== 1) {
			/* Warn: Unknown source: $message */
			$vm.$message.error(res.data.message)
			return
		}
		window.location.replace(from)
	})
}
</script>
