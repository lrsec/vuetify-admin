import Vue from 'vue'
import Router from 'vue-router'
import { getToken, setToken, setTitle, canTurnTo } from '@/libs/util'
import store from '@/store'
import routes from './routers'

Vue.use(Router)

const LOGIN_PAGE_NAME = 'login'
const HOME_PAGE_NAME = 'home'

const index = new Router({
  routes: routes,
  mode: 'history'
})

const turnTo = (to, access, next) => {
  if (canTurnTo(to, access)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_403' }) // 无权限，重定向到401页面
}

index.beforeEach((to, from, next) => {
  const token = getToken()
  if (!token) {
    if (to.name !== LOGIN_PAGE_NAME) {
      // 未登录且要跳转的页面不是登录页
      next({
        name: LOGIN_PAGE_NAME // 跳转到登录页
      })
    } else {
      // 未登陆且要跳转的页面是登录页
      next() // 跳转
    }
  } else {
    if (to.name === LOGIN_PAGE_NAME) {
      // 已登录且要跳转的页面是登录页
      next({
        name: HOME_PAGE_NAME
      })
    } else {
      if (store.state.user.hasGetInfo) {
        turnTo(to, store.state.user.access, next)
      } else {
        store.dispatch('getUserInfo').then(user => {
          // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
          turnTo(to, user.access, next)
        }).catch(() => {
          setToken('')
          next({
            name: 'login'
          })
        })
      }
    }
  }
})

index.afterEach(to => {
  setTitle(to, index.app)
  window.scrollTo(0, 0)
})

export default index
