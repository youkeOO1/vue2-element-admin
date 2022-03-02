// 权限路由
import { constantRoutes, asynceRouter } from '../../router'

/**
 * 判断路由权限
 * @param {*} roles
 * @param {*} route
 * @returns
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    // 判断路由的权限
    // 用 some 是因为该路由可能会有子路由
    return roles.some(role => route.meta.roles.includes(role))
  }
  // 没有meta 说明该路由是任何人都可以访问
  return true
}
/**
 * 筛选路由
 * @param {*} routes
 * @param {*} roles
 */
function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach((ele) => {
    // 遍历路由 因为有些路由会有子路由，子路由的权限不一样，不能使用 filter
    const tmp = { ...ele }
    if (hasPermission(roles, tmp)) {
      // 权限符合，递归判断子路由的权限
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      let accessedRoutes
      if (roles.includes('admin')) {
        // 管理员，掌握所有路由
        accessedRoutes = asynceRouter || []
      } else {
        // 筛选路由
        accessedRoutes = filterAsyncRoutes(asynceRouter, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
