import Cookie from 'js-cookie'
export default {
  state: {
    token: ''
  },
  mutations: {
    //存放token
    setToken(state, val) {
      state.token = val
      Cookie.set('token', val)
    },
    //清空token
    clearToken(state) {
      state.token = ''
      Cookie.remove('token')
    },
    //获取token
    getToken(state) {
      state.token = Cookie.get('token')
    }
  },
  actions: {}
}
