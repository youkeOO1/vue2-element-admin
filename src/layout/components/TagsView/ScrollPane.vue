<template>
  <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container" @wheel.native.prevent="handleScroll">
    <slot />
  </el-scrollbar>
</template>

<script>
const tagAndTagSpacing = 4 // tagAndTagSpacing

export default {
  name: 'ScrollPane',
  computed: {
    scrollWrapper() {
      return this.$refs.scrollContainer.$refs.wrap
    }
  },
  mounted() {
    this.scrollWrapper.addEventListener('scroll', this.emitScroll, true)
  },
  beforeDestroy() {
    this.scrollWrapper.removeEventListener('scroll', this.emitScroll)
  },
  methods: {
    /**
     * 鼠标滚动控制滚动条滚动
     */
    handleScroll(e) {
      // e.wheelDelta 测试有两个值， 鼠标滚轮向上滚动为 120 向下滚动为 -120
      // deltaY 滚轮的纵向滚动量
      const eventDelta = e.wheelDelta || -e.deltaY * 40
      const $scrollWrapper = this.scrollWrapper
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
    },
    moveToTarget(tag) {
      const $container = this.$refs.scrollContainer.$el
      const $containerWidth = $container.offsetWidth
      const $scrollWrapper = this.scrollWrapper
      const tagArr = this.$parent.$refs.tag

      let firstTag = null
      let lastTag = null

      if (tagArr.length > 0) {
        firstTag = tagArr[0]
        lastTag = tagArr[tagArr.length - 1]
      }

      if (firstTag === tag) {
        $scrollWrapper.scrollLeft = 0
      } else if (lastTag === tag) {
        $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
      } else {
        // 获取前一个标签宇与后一个标签，看前一个标签与后一个标签是否展示全
        const currentIndex = tagArr.indexOf(tag)
        const prevTag = tagArr[currentIndex - 1]
        const nextTag = tagArr[currentIndex + 1]

        // 获取前一个与后一个的完全展示的left值
        const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidht + tagAndTagSpacing
        const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing

        // 判断 后一个 tag 的 left > containerWidth + scrollLeft 说明后一个tag在显示区外，需要滚动
        if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
          // 后一个 tag 没有展示全，后一个 tag 可能在 containerWidth 的最右边
          // 后一个 tag 的 left 在 containerWidth 外， 需要滚动才能展示
          $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
        } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
          // 前一个 tag 没有展示全， 前一个 tag 可能在 containerWidth 的最左边
          // 前一个 tag 的 left < 滚动距离
          $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
        }
      }
    },
    emitScroll() {
      this.$emit('scroll', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  ::v-deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      height: 49px;
    }
  }
}
</style>

