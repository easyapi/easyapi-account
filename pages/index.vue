<template>
  <div></div>
</template>

<script>
import from from '../utils/from'
// import Cookies from 'js-cookie'
import { getUser } from '../api/account'

export default {
  name: 'Index',
  head() {
    return {
      title: '账户中心 - EasyAPI服务平台',
      meta: [
        { hid: 'description', name: 'description', content: '账户中心' },
        { hid: 'keyword', name: 'keyword', content: '账户中心' }
      ]
    }
  },
  mounted() {
    from(this)
    if (!Cookies.get('authenticationToken')) {
      this.$router.push({ path: `/login` })
      return
    }
    getUser(this)
      .then(res => {
        if (res.data.code === 1) {
          window.location.replace(Cookies.get('from'))
        } else {
          this.$router.push({ path: `/login` })
        }
      })
      .catch(error => {
        this.$message.error(error.response.data.message)
      })
  }
}
</script>
