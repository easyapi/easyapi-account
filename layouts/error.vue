<template>
  <el-row class="main">
    <el-col :span="12" :offset="6">
      <div class="error" v-if="error.statusCode === 403">
        <span class="title">权限不足</span>
        <span class="subtitle">你无权访问当前的页面</span>
        <img src="https://qiniu.easyapi.com/photo/girl32.jpg" />
      </div>
      <div class="error" v-if="error.statusCode === 404">
        <span class="title">404</span>
        <span class="subtitle">页面不存在</span>
        <img src="https://qiniu.easyapi.com/photo/girl32.jpg" />
      </div>
      <div class="error" v-else>
        <span class="title">错误!</span>
        <span class="subtitle">您访问了错误的信息</span>
        <img src="https://qiniu.easyapi.com/photo/girl32.jpg" />
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ['error'],
  layout: 'default',
  head() {
    return {
      title: '错误 - EasyAPI服务平台',
      meta: [
        { hid: 'description', name: 'description', content: '错误' },
        { hid: 'keyword', name: 'keyword', content: '错误' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.error {
  border: 1px solid #ccc;
  padding: 10px 20px;
  background-color: #f5f5f5;
  text-align: center;
}

.title {
  font-size: 30px;
  font-family: 'Trebuchet MS', serif;
}

.subtitle {
  font-size: 12px;
  display: block;
  margin-top: 5px;
}

img {
  width: 100%;
}
</style>
