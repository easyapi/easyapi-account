import Cookies from 'js-cookie'

export default function ({ $axios, redirect }) {
  $axios.onRequest(config => {
    if (Cookies.get('authenticationToken')) {
      config.headers.Authorization = 'Bearer ' + Cookies.get('authenticationToken')
    }
  })
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      if (error.response.data.code === -9) {
        //用户信息不存在
        window.location.href = 'https://account.easyapi.com/login/?from=https://www.easyapi.com/home'
      }
    }
  })
}
