<template>
  <div class="app-wrapper" :class="classObj">
    <!-- sidebar 背景 -->
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <!-- 左侧侧边栏，侧边栏可以收缩 -->
    <sidebar class="sidebar-container" />
    <!-- 主体内容显示区， 是否含有页面标签 -->
    <div class="main-container" :class="{'hasTagsView': needTagsView}">
      <!-- 导航栏 导航栏是否固定 -->
      <div :class="{'fixed-header': fixedHeader}">
        <!-- 导航条 -->
        <navbar />
        <!-- 页面标签 -->
        <tags-view v-if="needTagsView" />
      </div>
      <!-- 主要内容展示区  -->
      <app-main />
      <!-- 右侧面板  -->
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import AppMain from './components/AppMain'
import tagsView from './components/TagsView'
import resizeHandler from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  components: {
    Sidebar,
    Navbar,
    AppMain,
    tagsView
  },
  mixins: [resizeHandler],
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      fixedHeader: (state) => state.settings.fixedHeader,
      needTagsView: (state) => state.settings.tagsView
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        mobile: this.device === 'mobile',
        withoutAnimation: this.sidebar.withoutAnimation
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSidebar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import'~@/styles/mixin.scss';

  .app-wrapper {
    @include clearfix;
    width: 100%;
    height: 100%;
    position: relative;
  }
  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sidebarWidth});
    transition: width 0.28s;
  }
  .hideSidebar .fixed-header {
    width: calc(100% - 54px);
  }
  .mobile .fixed-header {
    width: 100%;
  }
  .drawer-bg {
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.3;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
  }
</style>
