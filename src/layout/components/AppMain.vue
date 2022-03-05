<template>
  <section class="app-main">
    <transition>
      <!--:include 字符串或正则表达式。只有名称匹配的组件会被缓存 -->
      <keep-alive :include="cacheViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  computed: {
    key() {
      return this.$route.path
    },
    cacheViews() {
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-main {
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .fixed-header+.app-main {
    padding-top: 50px;
  }
  .hasTagsView {
    .app-main {
      min-height: calc(100vh - 84px);
    }
    .fixed-header+.app-main{
      padding-top: 84px;
    }
  }
</style>
