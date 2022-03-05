import { debounce } from '@u'

export default {
  data() {
    return {
      $sidebarElm: null,
      $handleResize: null
    }
  },
  /**
   * 为 $handleResizeFun 设置防抖函数
   * 初始化窗口尺寸改变函数
   * 初始化侧边栏改变函数
   */
  mounted() {
    this.$handleResize = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    this.$_initResizeEvent()
    this.$_initSidebarResizeEvent()
  },
  methods: {
    /**
     * 监听窗口改变事件
     */
    $_initResizeEvent() {
      window.addEventListener('resize', this.$handleResize)
    },
    /**
     * 移除窗口尺寸改变事件
     */
    $_destroyResizeEvent() {
      window.removeEventListener('resize', this.$handleResize)
    },
    /**
     * 初始化侧边栏尺寸改变事件
     */
    $_initSidebarResizeEvent() {
      // transitionend
      this.$sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      this.$sidebarElm.addEventListener('transitionend', this.$handleResize)
    },
    /**
     * 移除侧边栏尺寸改变事件
     */
    $_destroySidebarResizeEvent() {
      this.$sidebarElm && this.$sidebarElm.removeEventListener('transitionend', this.$handleResize)
    }
  },
  /**
   * 实例销毁前，移除事件监听
   */
  beforeDestroy() {
    this.$_destroyResizeEvent()
    this.$_destroySidebarResizeEvent()
  }
}
