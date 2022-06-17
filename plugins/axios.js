import Cookies from 'js-cookie'

export default function ({$axios, redirect}) {
  Cookies.set('authenticationToken','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ6aGFuZzIwMDg0QDEyNi5jb20iLCJhdXRoIjoiUk9MRV9BRE1JTiIsImV4cCI6MTY1NzY5Nzg1Mn0.4PjJ5QPKZzExjsML73Fyfxp9lnyCQTd77EQT88849OyI55f6CRwSCRDlbu2f-W98SDi5oBrUIdGAWLZOUJXrJw')
  $axios.onRequest((config) => {
    if (Cookies.get('authenticationToken')) {
      config.headers.Authorization = 'Bearer ' + Cookies.get('authenticationToken')
    }
  })
  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      if (error.response.data.code === -9) {
        window.location.href = 'https://account.easyapi.com/login/?from=https://market.easyapi.com'
      } else if (error.response.data.code === -8) {
        window.location.href = 'https://team.easyapi.com/new?from=https://market.easyapi.com'
      }
    }
  })
}
