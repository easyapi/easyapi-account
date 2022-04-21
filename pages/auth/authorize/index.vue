<template>
  <div class="authorize-main">
    <div class="authorize-header">
      授权登录
    </div>
    <div class="p-2">
      <div class="mt-2">
        <span class="text-gray-600"><<{{ client }}>> 想要访问你的账户信息</span>
      </div>
      <div class="mt-2">
        <span>当前登录账号: {{ account }}</span>
      </div>
    </div>
    <div class="pl-10 flex">
      <div class="mb-10">
        <el-button type="primary" size="small" @click="authorization">
          授 权
        </el-button>
      </div>
      <div class="mb-10 ml-10">
        <el-button size="small" @click="cancel">取 消</el-button>
      </div>
    </div>
    <el-button class="ml-10" @click="changeUser" type="text">切换账号 ></el-button>
  </div>
</template>

<script>
import Index from "./index.js";

export default Index;
</script>
