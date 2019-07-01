import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import config from './config'
import './index.css'
import GlobalProcess from '@@/GlobalProcess'

/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false

// Vue.config.silent = true

/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

// 全局组件
Vue.component('GlobalProcess', GlobalProcess)

// export 是为了能够在全局使用 $toast
export default new Vue({
  router: router,
  store,
  render: h => h(App)
}).$mount('#app')
