import { debounce } from '@/utils/index'
/**
 * 视口改变重新绘制 echarts
 */
export default {
  data() {
    return {
      $_sidebarElm: null,
      $_resizeHandler: null
    }
  },
  mounted() {
    this.initListener()
  },
  activated() {
    if (this.$_resizeHandler) {
      this.$_resizeHandler()
    }
  },
  beforeDestroy() {
    this.destroyListener()
  },
  deactivated() {
    this.destroyListener()
  },
  methods: {
    /**
     * 侧边栏过渡动画完成，如果是宽度发生变化，resize echarts
     * @param {*} e
     */
    $_sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.$_resizeHandler()
      }
    },
    /**
     * 初始化监听器
     */
    initListener() {
      this.$_resizeHandler = debounce(() => {
        // 强行绑定 this
        this.resize()
      }, 100)
      window.addEventListener('resize', this.$_resizeHandler)
      // 侧边栏是否展开
      this.$_sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      this.$_sidebarElm && this.$_sidebarElm.addEventListener('transitionend', this.$_sidebarResizeHandler)
    },
    /**
     * resize
     */
    resize() {
      console.log('resize')
      const { chart } = this
      chart &&
        chart.resize({
          animation: {
            duration(idx) {
              return idx * 20
            },
            easing: 'elasticOut'
          }
        })
    },
    /**
     * 销毁事件
     */
    destroyListener() {
      window.removeEventListener('resize', this.$_resizeHandler)
      this.$_resizeHandler = null
      this.$_sidebarElm && this.$_sidebarElm.removeEventListener('transitionend', this.$_sidebarResizeHandler)
    }
  }
}
