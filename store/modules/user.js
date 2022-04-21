import Cookies from 'js-cookie'
import {getUser} from '@/api/account'

const user = {
  state: {
    userId: '',
    username: '',
    nickname: '',
    photo: '',
    mobile: '',
    email: '',
    token: Cookies.get('authenticationToken')
  },

  mutations: {
    SET_USER_ID: (state, userId) => {
      state.userId = userId
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_NICKNAME: (state, nickname) => {
      state.nickname = nickname
    },
    SET_PHOTO: (state, photo) => {
      state.photo = photo
    },
    SET_MOBILE: (state, mobile) => {
      state.mobile = mobile
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    }
  },

  actions: {
    /**
     * 获取用户信息
     */
    getUser({commit}) {
      getUser(this).then(res => {
        let user = res.data.content
        commit('SET_USER_ID', user.id)
        commit('SET_USERNAME', user.username)
        commit('SET_NICKNAME', user.nickname)
        commit('SET_PHOTO', user.photo)
        commit('SET_MOBILE', user.mobile)
        commit('SET_EMAIL', user.email)
      }).catch(error => {
        Cookies.remove('authenticationToken')
      })
    },
    /**
     * 登出
     */
    logout() {
      Cookies.remove('authenticationToken')
      Cookies.remove('authenticationToken', {path: '/', domain: '.easyapi.com'})
    }
  }
}

export default user
