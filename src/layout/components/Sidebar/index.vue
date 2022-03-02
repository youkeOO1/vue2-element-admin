<template>
  <div class="sidebar-container" :class="{ 'has-logo': showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- logo 的展示 -->
    <!-- 滚动条 -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- 展示路由名 -->
      <!-- 路由可能会有子路由， 展示子路由 -->
      <!-- 路由是一个链接 也就是 router-link -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import { mapGetters } from 'vuex'
import variables from '@/styles/variables.scss'

export default {
  props: {

  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    /**
     * 展示 Logo
     */
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    /**
     * 侧边栏是否折叠
     */
    isCollapse() {
      // 侧边栏的状态从 vuex 中读取
      return !this.sidebar.opened
    },
    /**
     * 侧边栏当前激活菜单的 index
     */
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      window.route = this.$route
      if (meta.activeMenu) {
        // 有 activeMenu 就用 activeMenu
        return meta.activeMenu
      }
      // 或者使用 path
      return path
    },
    /**
     * scss 中声明的变量
     */
    variables() {
      return variables
    }
  },
  components: {
    Logo,
    SidebarItem
  }
}
</script>

<style>

</style>
