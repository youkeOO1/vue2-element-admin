import defaultSetting from '@/settings'
const { sidebarLogo, fixedHeader, tagsView } = defaultSetting

const state = {
  // 侧边栏是否展示 logo
  sidebarLogo,
  // 顶部导航栏是否固定
  fixedHeader,
  // 标签导航
  tagsView
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // 判断全局配置中是 key 的配置项
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state.sidebarLogo[key] = value
    }
  }
}

const actions = {
  /**
   * 修改全局配置
   * @param { object } data
   */
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  state,
  mutations,
  actions
}
