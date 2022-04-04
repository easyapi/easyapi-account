const getters = {
  username: state => state.user.username,
  nickname: state => state.user.nickname,
  photo: state => state.user.photo,
  token: state => state.user.token
}
export default getters
