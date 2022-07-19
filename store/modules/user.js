import Cookies from 'js-cookie'
import { getUser } from '@/api/account'

const state = () => ({
  userInfo: '',
  domain: '.easyapi.com'
})

const getters = {
  userInfo: state => state.userInfo
}

const mutations = {
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_DOMAIN: (state, domain) => {
    state.domain = domain
  }
}

const actions = {
  /**
   * 获取用户信息
   */
  getUser({ commit, state }) {
    getUser(this).then(res => {
      if (res.data.code === 1) {
        let userInfo = res.data.content
        commit('SET_USER_INFO', userInfo)
      }
    })
  },
  /**
   * 登出
   */
  logout({ commit, state }) {
    Cookies.remove('authenticationToken')
    Cookies.remove('authenticationToken', {
      path: '/',
      domain: '.easyapi.com'
    })
    window.location.href = 'https://account.easyapi.com/login'
  }
}

export default { state, getters, mutations, actions }
