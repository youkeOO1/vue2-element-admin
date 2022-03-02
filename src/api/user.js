import request from '@/utils/request'

/**
 * 登录
 */
export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'POST',
    data
  })
}

/**
 * 获取用户信息
 */
export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'GET',
    params: { token }
  })
}

/**
 * 用户退出
 * @returns
 */
export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'POST'
  })
}
