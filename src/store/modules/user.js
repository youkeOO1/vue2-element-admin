// 用户信息
import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getInfo, logout } from '@/api/user'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_INTRODUCTION(state, value) {
    state.introduction = value
  },
  SET_NAME(state, value) {
    state.name = value
  },
  SET_AVATAR(state, value) {
    state.avatar = value
  },
  SET_ROLES(state, value) {
    state.roles = value
  }
}

const actions = {
  /**
   * 登录
   * @param {*} param0
   * @param {*} userInfo
   * @returns
   */
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password
      }).then((response) => {
        const { data } = response
        console.log(data.token, 'token')
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  },
  /**
   * 获取用户信息
   * @param {*} param0
   * @returns
   */
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const { data } = response
          if (!data) {
            // 返回的数据为空
            reject('验证失败，请重新登录')
          }
          const {
            roles, name, avatar, introduction
          } = data
          //
          if (roles && roles.length <= 0) {
            // 角色为空
            reject('角色必须是一个非空数组')
          }
          commit('SET_ROLES', roles)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_INTRODUCTION', introduction)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  /**
   * 删除Token
   * @param {*} param
   * @returns
   */
  resetToken({ commit, state }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then((response) => {
        commit('SET_ROLES', [])
        commit('SET_TOKEN', '')
        removeToken()
        // 重置路由
        resetRouter()
        // 还有未写的
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  },
  /**
   * 修改权限
   * @param {*} param0
   * @param {*} role
   */
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'
    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')
    console.log(roles, 'roles')

    resetRouter()
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    if (accessRoutes.length > 0) {
      accessRoutes.forEach((ele) => {
        router.addRoute(ele)
      })
    }
    // router.addRoutes(accessRoutes)
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
