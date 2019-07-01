import {
  login,
  logout,
  getUserInfo,
  changePwd
} from '@/api/user'
import { setToken, getToken, getUid, setUid } from '@/libs/util'
import * as md5 from 'md5'

export default {
  state: {
    userName: '',
    userId: getUid(),
    avatarImgPath: '',
    token: getToken(),
    access: [],
    hasGetInfo: false
  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserId (state, id) {
      state.userId = id
      setUid(id)
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    }
  },
  getters: {
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password }) {
      userName = userName.trim()
      password = md5(password)
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          const data = res.data

          if (data.success) {
            commit('setUserName', userName)
            commit('setUserId', data.uid)
            commit('setToken', data.token)
            commit('setAccess', data.access)
            // commit('setAvatar', (data.avatar === undefined ? '' : data.avatar))
            commit('setHasGetInfo', true)

            resolve()
          } else {
            reject(data.message)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then((res) => {
          const data = res.data
          if (data.success) {
            commit('setToken', '')
            commit('setAccess', [])
            resolve(res)
          } else {
            reject(data.message)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            const data = res.data
            if (data.success) {
              // commit('setAvatar', data.avatar)
              commit('setUserName', data.name)
              commit('setAccess', data.access)
              commit('setHasGetInfo', true)
              resolve(data)
            } else {
              reject(data.message)
            }
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 修改密码
    changePassword ({ state, commit }, { oldPwd, newPwd }) {
      return new Promise((resolve, reject) => {
        try {
          changePwd(oldPwd, newPwd).then(res => {
            const data = res.data
            if (data.success) {
              commit('setToken', '')
              commit('setAccess', [])
              resolve(res)
            } else {
              reject(data.message)
            }
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
