import './index.scss'

import { getAuthorize, oauthAuthorize } from '../../../api/auth'
import Cookies from 'js-cookie'
import qs from 'qs'

export default {
  name: 'Authorize',
  head() {
    return {
      title: '授权 - EasyAPI服务平台',
      meta: [
        { hid: 'description', name: 'description', content: '授权' },
        { hid: 'keyword', name: 'keyword', content: '授权' }
      ]
    }
  },
  data() {
    return {
      account: '',
      client: ''
    }
  },
  methods: {
    authorization() {
      oauthAuthorize(
        qs.stringify({
          user_oauth_approval: true,
          authorize: 'Authorize',
          'scope.client': true
        }),
        this
      ).then()
    },
    cancel() {
      oauthAuthorize(
        qs.stringify({
          user_oauth_approval: true,
          authorize: 'Authorize',
          'scope.client': false
        }),
        this
      ).then()
    },
    /**
     * 切换账号
     */
    changeUser() {
      //添加三方登录标识
      sessionStorage.setItem('auth', '三方登录')
      window.location.href = '/login'
    }
  },
  mounted() {
    let token = Cookies.get('authenticationToken')
    if (!token) {
      //添加三方登录标识
      sessionStorage.setItem('auth', '三方登录')
      window.location.href = '/login'
    }
    let params = {
      client_id: this.$route.query.client_id,
      response_type: this.$route.query.response_type,
      scope: this.$route.query.scope,
      redirect_uri: this.$route.query.redirect_uri
    }
    sessionStorage.setItem('params', JSON.stringify(params))
    //清空三方登录标识
    sessionStorage.setItem('auth', '')
    if (!token) {
      this.changeUser()
    }
    getAuthorize(params, this)
      .then(res => {
        if (res.data.code === 1) {
          this.client = res.data.content.name
          this.account = res.data.content.username
        }
      })
      .catch(error => {
        this.$message.error(error.response.data.message)
      })
  }
}
