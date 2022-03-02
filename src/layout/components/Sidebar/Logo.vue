<template>
  <div class="sidebar-logo-container" :class="{ 'collapse' : collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ title }}</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link>
    </transition>
    <!-- logo -->
    <!-- logo 有两种状态 -->
    <!-- 一种是 只展示 logo 图片，或者只展示 logo 文字 -->
    <!-- 另一种是全展示 -->
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    // 是否折叠
    collapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: 'Vue2-Element-Admin',
      logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}
.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
.sidebar-logo-container {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  overflow: hidden;
  background: #2b2f3a;
  & .sidebar-logo-link {
    width: 100%;
    height: 100%;
    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }
    & .sidebar-title {
      display: inline-block;
      margin: 0;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      vertical-align: middle;
      color: #fff;
    }
  }
  &.collapse {
    .sidebar-logo {
      margin-right: 0;
    }
  }
}
</style>
