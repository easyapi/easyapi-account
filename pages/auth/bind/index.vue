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
              <el-option v-for="item in areaCodes" :key="item.value" :value="item.value">{{ item.label }}（+{{ item.value }}）</el-option>
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

<script>
import Index from './index.js'

export default Index
</script>
