<template>
</template>

<script>
export default {
  name: 'Index',
  head() {
    return {
      title: '账户中心 - EasyAPI服务平台',
      meta: [
        {hid: 'description', name: 'description', content: '账户中心'},
        {hid: 'keyword', name: 'keyword', content: '账户中心'}
      ]
    }
  },
  mounted() {
    let token = Cookies.get("authenticationToken");
    if (token) {
      axios({
        method: 'GET',
        url: 'https://account-api.easyapi.com/authenticate',
        headers: {
          'Authorization': "Bearer " + token
        }
      }).then(res => {
        if (res.data.code === 1) {
          window.location.replace(from);
        } else {
          window.location.replace("login");
        }
      }).catch(error => {
        this.$message.error(error.response.data.message);
      });
    } else {
      window.location.replace("login");
    }
  }
}
</script>

<style lang="less" scoped>

</style>
