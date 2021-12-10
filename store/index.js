import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  modules: {
    user
  },
  state: {
    domain: 'easyapi.com'
  },
  mutations: {
    SET_DOMAIN: (state, domain) => {
      state.domain = domain
    }
  },
  actions: {},
  getters
})

export default store
