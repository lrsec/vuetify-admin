import axios from '@/libs/api.request'

export const getRoles = (name) => {
  const data = {
    name
  }

  return axios.request({
    url: '/roles',
    data,
    method: 'post'
  })
}

export const updateRoleStatus = (id, status) => {
  const data = {
    id,
    status
  }

  return axios.request({
    url: '/role/status/update',
    data,
    method: 'post'
  })
}

export const getAuthPoints = () => {
  return axios.request({
    url: '/authpoint',
    method: 'get'
  })
}

export const addRole = (name, detail, access, status) => {
  const data = {
    name,
    detail,
    access,
    status
  }

  return axios.request({
    url: '/role/add',
    data,
    method: 'post'
  })
}

export const updateRole = (data) => {
  return axios.request({
    url: '/role/update',
    data,
    method: 'post'
  })
}

export const getAccounts = (name = '', realName = '', phone = '', roleId = -1, status = -1) => {
  const data = {
    name,
    realName,
    phone,
    roleId,
    status
  }

  return axios.request({
    url: '/accounts',
    data: data,
    method: 'post'
  })
}

export const updateAccountStatus = (uid, status) => {
  const data = {
    uid,
    status
  }

  return axios.request({
    url: '/account/status/update',
    data,
    method: 'post'
  })
}

export const addAccount = (name, password, realName, phone, roleId, status) => {
  const data = {
    name, password, realName, phone, roleId, status
  }

  return axios.request({
    url: '/account/add',
    data,
    method: 'post'
  })
}

export const updateAccount = ({ id, name, realName, phone, roleId, status }) => {
  const data = {
    uid: id,
    name,
    realName,
    phone,
    roleId,
    status
  }

  return axios.request({
    url: '/acocunt/update',
    data,
    method: 'post'
  })
}
