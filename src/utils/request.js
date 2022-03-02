/**
 * axios
 */
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from './auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

service.interceptors.request.use((config) => {
  if (store.getters.token) {
    // 有token
    config.headers['X-Token'] = getToken()
  }
  return config
}, (error) => {
  console.log(error, 'request')
  return Promise.reject(error)
})

service.interceptors.response.use((response) => {
  const res = response.data
  /**
   * 判断状态吗是否为 20000
   *  不是
   *    向用户提示错误
   *    判断是否为 50008，50012，50014 的错误
   *      是提示用户 token 过期，将 token 重置
   *    将错误向后传递
   *  是
   *    return res
   */
  if (res.code !== 20000) {
    Message({
      message: res.message || 'Error',
      type: 'error',
      duration: 5000
    })
    if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      MessageBox.confirm(
        'You have been logged out, you can cancel to stay on this page, or log in again',
        'Confirm logout',
        {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('user/resetToken').then(() => {
          // eslint-disable-next-line no-restricted-globals
          location.reload()
        })
      })
    }
    return Promise.reject(new Error(res.message || 'Error'))
  }
  return res
}, (error) => {
  console.log(error, 'response')
  Message({
    message: error.message,
    type: 'error',
    duration: 5000
  })
  Promise.reject(error)
})

export default service
