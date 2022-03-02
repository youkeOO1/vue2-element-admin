import jsCookie from 'js-cookie'

const state = {
  sidebar: {
    opened: jsCookie.get('sidebarStatus') ? !!+jsCookie.get('sidebarStatus') : true,
    withoutAnimation: false
  }
}

const mutations = {
  /**
   * 切换侧边栏状态
   * @param {*} state
   */
  TOGGLESIDEBAR: (state) => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    // 写入cookie
    if (state.sidebar.opened) {
      jsCookie.set('sidebarStatus', 1)
    } else {
      jsCookie.set('sidebarStatus', 0)
    }
  }
}

const actions = {
  /**
   * 切换侧边栏状态
   * @param {*} param
   */
  toggleSideBar({ commit }) {
    commit('TOGGLESIDEBAR')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
