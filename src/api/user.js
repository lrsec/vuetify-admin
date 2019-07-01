import axios from '@/libs/api.request'

// 用户登录
export const login = ({ userName, password }) => {
  const data = {
    userName,
    password
  }
  return axios.request({
    url: 'login',
    data,
    method: 'post'
  })
}

// 获取用户信息
export const getUserInfo = (token) => {
  return axios.request({
    url: '/user/info',
    params: {
      token
    },
    method: 'get'
  })
}

// 退出登录
export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

// 修改密码
export const changePwd = (old, newPwd) => {
  const data = {
    old, newPwd
  }

  return axios.request({
    url: '/user/pwd',
    data,
    method: 'post'
  })
}
