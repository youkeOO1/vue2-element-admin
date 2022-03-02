<template>
  <el-breadcrumb separator="/" class="app-breadcrumb">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <!-- 是否可以跳转，允许跳转的使用 a 元素，不允许跳转的使用 span -->
        <!-- 当前路由(也就是面包屑导航的最后一个不允许跳转) -->
        <!-- 无重定向的路由不允许跳转 -->
        <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { compile } from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route(route) {
      // redirect 路由
      this.getBreadcrumb()
    }
  },
  methods: {
    /**
    * 获取面包屑导航需要展示的路由名
    * 解析 route 通过 matched 数组获取 route meta name, 以此生成面包屑导航所需要的数据
    * matched 可能有些路由没有 route meta 将其过滤出去
    * 根路由
    *
    */
    getBreadcrumb() {
      let matched = this.$route.matched.filter((ele) => ele.meta && ele.meta.title)
      // matched 是否有根路由
      const firstRoute = matched[0]
      if (!this.isDashboard(firstRoute)) {
        // 没有根路由，添加根路由
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
      }
      // 筛选合适的路由展示
      this.levelList = matched.filter((item) => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    /**
    * 是否为 dashboard 路由，根路由重定向该路由
    */
    isDashboard(route) {
      // 参数不为 undefined 获取路由名
      const name = route && route.name
      if (!name) {
        // 没有路由名，返回false
        return false
      }
      // 是否为根路由
      // 根路由重定向到 dashboard 路由
      return name.trim().toLocaleLowerCase() === 'dashboard'
    },
    /**
     * 跳转路径编译
     * 解决将路由参数转化为有效参数
     */
    pathCompile(path) {
      const { params } = path
      // compile 返回一个函数 用于将参数转换为有效路径
      const toPath = compile(path)
      console.log(compile, 'pathToRegexp')
      return toPath(params)
    },
    /**
     * 路由跳转
     * 会出现路由冗余问题
     */
    handleLink(route) {
      const { path, redirect } = route
      if (redirect) {
        if (redirect === this.$route.path) {
          //  当前使用的 vue-router 是3.2的版本，这个版本会出现路由冗余错误
          // redirect(路由跳转的 path ) === 当前路由的 path  会显示路由冗余
          // 参考 vue-router@3.1.0 的版本当 redirect === 当前 route.path 什么也不会发生
          return
        }
        this.$router.push(redirect)
        return
      }
      // 防止路径出错，对路径进行编译
      this.$router.push(this.pathCompile(path))
    }
  },
  created() {
    this.getBreadcrumb()
  }
}
</script>

<style lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb{
    display: inline-block;
    line-height: 50px;
    font-size: 14px;
    margin-left: 8px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
