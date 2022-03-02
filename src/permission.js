import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth'
import router from './router'
import store from './store'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration
NProgress.configure({ showSpinner: false })

// 白名单
const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  console.log('router-befor')
  NProgress.start()
  /**
   * 是否登录
   *  有token
   *    是否去登录页面
   *      是 跳转到首页
   *    不是去登录页面
   *      是否有权限
   *        有放行
   *      没有
   *        获取用户信息
   *        获取用户信息失败，跳转到登录页面
   *  没有token
   *    是否访问白名单
   *      是 放行
   *      不是 跳转到登录
   */
  const hasToken = getToken()
  if (hasToken) {
    /**
     * 拥有 token
     * 是否去 login 页面
     * 是否有个人信息
     */
    if (to.path === '/login') {
      // 已经登录成功无需再次登录
      next({ path: '/' })
      NProgress.done()
    } else {
      // 是否含有个人权限
      // 个人权限是一个非空的数组
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        // 有个人权限
        next()
      } else {
        // 有 token 但是没有个人权限，重新获取个人信息
        try {
          // 重新获取个人信息
          // 根据权限，重新生成动态路由
          // 将动态路由添加到路由中
          const { roles } = await store.dispatch('user/getInfo')
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // if (accessRoutes.length > 0) {
          //   accessRoutes.forEach(ele => {
          //     router.addRoute(ele)
          //   })
          // }
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
          // next()
        } catch (err) {
          // 重新获取个人信息发生错误
          // 删除本地 token 让用户重新登录
          // 方便用户登录后继续浏览上次的页面，将该页面作为路由参数传递过去
          await store.dispatch('user/resetToken')
          Message.error(err || '请重新登录')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 是否访问的是白名单的路由
    // 访问白名单的路由 放行
    // 访问不是白名单的路由 跳转到 login 路由
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})
