import axios from 'axios'
import config from '@/config'
import store from '@/store'
import router from '@/router'
import vm from '@/main'

class HttpRequest {
  constructor () {
    this.baseUrl = config.baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        Uid: Number(store.state.user.userId),
        Token: store.state.user.token
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res

      // token 失效的处理
      if (!data.success && data.code === 401) {
        store.commit('setUserId', '')
        store.commit('setToken', '')
        store.commit('setAccess', '')

        vm.$toast.error('用户未登录或登陆失效，请重新登陆')

        router.push('login')

        return
      }

      return { data, status }
    }, error => {
      this.destroy(url)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
