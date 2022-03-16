const { body } = document
const WIDTH = 992

export default {
  watch: {
    /**
     * 监听路由
     * 进入新路由，判断是是否为手机模式且侧边还在打开状态，将其关闭
     * @param {*} newRoute
     */
    $route(newRoute) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        this.$store.dispatch('app/closeSidebar', { withoutAnimation: false })
      }
    }
  },
  /**
   * 监听页面尺寸大小改变事件
   */
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  /**
   * 初始化
   */
  mounted() {
    this.$_resizeHandler()
  },
  /**
   * 移除页面尺寸改变事件
   */
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  methods: {
    /**
     * 是否移动设备端
     * @returns Boolean
     */
    $_isMobile() {
      const width = body.getBoundingClientRect().width
      return width - 1 <= WIDTH
    },
    /**
     * 页面尺寸改变的回调函数
     * @returns
     */
    $_resizeHandler() {
      if (document.hidden) {
        return
      }
      const isMobile = this.$_isMobile()
      this.$store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')
      if (isMobile) {
        this.$store.dispatch('app/closeSidebar', { withoutAnimation: true })
      }
    }
  }
}

