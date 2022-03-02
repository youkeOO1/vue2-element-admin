
const state = {
  visitedViews: [], // { fullpath: string, path: string, title: string, meta: {}}
  cacheViews: [] // [routeName1 ,routerName2, ...]
}

const mutations = {
  /**
   * 添加访问视图
   */
  ADD_VISITED_VIEW: (state, view) => {
    // 如果已经重复出现在 visitedViews 中啥也不做
    if (state.visitedViews.some((ele) => ele.path === view.path)) {
      return
    }
    state.visitedViews.push(Object.assign({}, view, {
      title: view.meta.title || 'no-name'
    }))
  },
  /**
   * 添加缓存访问视图
   */
  ADD_CACHE_VIEW: (state, view) => {
    if (!view.name) {
      return
    }
    if (state.cacheViews.includes(view.name)) {
      return
    }
    state.cacheViews.push(view.name)
  },
  /**
   * 删除
   * @param {*} state
   * @param {*} view
   */
  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
  /**
   * 删除缓存
   * @param {*} state
   * @param {*} view
   */
  DEL_CACHE_VIEW: (state, view) => {
    const index = state.cacheViews.indexOf(view.name)
    index > -1 && state.cacheViews.splice(index, 1)
  },
  // delVisitedOptionViews
  DEL_VISITED_OPTIONS_VIEWS: (state, view) => {
    state.visitedViews = state.visitedViews.filter((item) => item.meta.affix || item.path === view.path)
  },
  DEL_CACHE_OPTIONS_VIEWS: (state, view) => {
    const index = state.cacheViews.indexOf(view.name)
    if (index > -1) {
      state.cacheViews = state.cacheViews.slice(index, index + 1)
    } else {
      state.cacheViews = []
    }
  },
  DEL_VISITED_ALL_VIEWS: (state) => {
    state.visitedViews = state.visitedViews.filter((item) => item.meta.affix)
  },
  DEL_CACHE_ALL_VIEWS: (state) => {
    state.cacheViews = []
  }
}

const actions = {
  addView({ dispatch }, view) {
    dispatch('addVisitedView', view)
    dispatch('addcacheView', view)
  },
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view)
  },
  addcacheView({ commit }, view) {
    commit('ADD_CACHE_VIEW', view)
  },
  delView({ dispatch, state }, view) {
    return new Promise((resolve, reject) => {
      dispatch('delVisitedView', view)
      dispatch('delcacheView', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cacheViews: [...state.cacheViews]
      })
    })
  },
  delVisitedView({ commit }, view) {
    return new Promise((resolve, reject) => {
      commit('DEL_VISITED_VIEW', view)
      resolve({
        visitedViews: [...state.visitedViews]
      })
    })
  },
  delcacheView({ commit }, view) {
    return new Promise((resolve, reject) => {
      commit('DEL_CACHE_VIEW', view)
      resolve({
        cacheViews: [...state.cacheViews]
      })
    })
  },
  delOptionsViews({ dispatch, state }, view) {
    return new Promise((resolve) => {
      dispatch('delVisitedOptionsViews', view)
      dispatch('delCacheOptionsViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cacheViewss: [...state.cacheViews]
      })
    })
  },
  delVisitedOptionsViews({ commit }, view) {
    return new Promise((resolve) => {
      commit('DEL_VISITED_OPTIONS_VIEWS', view)
      resolve({
        visitedViews: [...state.visitedViews]
      })
    })
  },
  delCacheOptionsViews({ commit }, view) {
    return new Promise((resolve) => {
      commit('DEL_CACHE_OPTIONS_VIEWS', view)
      resolve({
        cacheViews: [...state.cacheViews]
      })
    })
  },
  delAllViews({ dispatch, state }) {
    return new Promise((resolve) => {
      dispatch('delVisitedAllViews')
      dispatch('delCacheAllViews')
      resolve({
        visitedViews: [...state.visitedViews],
        cacheViewss: [...state.cacheViews]
      })
    })
  },
  delVisitedAllViews({ commit }, view) {
    return new Promise((resolve) => {
      commit('DEL_VISITED_ALL_VIEWS')
      resolve({
        visitedViews: [...state.visitedViews]
      })
    })
  },
  delCacheAllViews({ commit }, view) {
    return new Promise((resolve) => {
      commit('DEL_CACHE_ALL_VIEWS')
      resolve({
        cacheViews: [...state.cacheViews]
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
