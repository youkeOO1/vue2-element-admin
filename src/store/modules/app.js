import jsCookie from 'js-cookie'

const state = {
  sidebar: {
    opened: jsCookie.get('sidebarStatus') ? !!+jsCookie.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop'
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
  },
  CLOSESIDEBAR: (state, withoutAnimation) => {
    jsCookie.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLEDEVICE: (state, device) => {
    state.device = device
  }
}

const actions = {
  /**
   * 切换侧边栏状态
   * @param {*} param
   */
  toggleSideBar({ commit }) {
    commit('TOGGLESIDEBAR')
  },
  closeSidebar({ commit }, { withoutAnimation }) {
    commit('CLOSESIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLEDEVICE', device)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
