<template>
  <div class="navbar">
    <!-- 菜单键, 功能：显示与隐藏侧边栏 -->
    <hamburger id="hamburger-containter" class="hamburger-containter" :is-active="sidebar.opened" @toggleClick="toggleSidebar" />
    <!-- 面包屑导航 -->
    <breadcrumb class="breadcrumb-containter" />
    <!-- 右侧菜单区 -->
    <div class="right-menu">
      <!-- 搜索: 根据情况展示 -->
      <search id="header-search" class="right-menu-item" />
      <!-- 错误日志: 根据情况展示 -->
      <!-- 全屏: 根据情况展示 -->
      <!-- 修改尺寸: 根据情况展示 -->
      <!-- 头像与下拉框: 必须展示 -->
      <el-dropdown class="avatar-containter right-menu-item">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
          <!-- <span>头像</span> -->
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <a href="www.github.com" target="_blank">Github</a>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import Hamburger from '@com/Hamburger'
import Breadcrumb from '@com/Breadcrumb'
import Search from '@com/HeaderSearch'
import { mapGetters } from 'vuex'

export default {
  components: {
    Hamburger,
    Breadcrumb,
    Search
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar'])
  },
  methods: {
    /**
    * 切换侧边栏状态
     */
    toggleSidebar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    /**
    * 用户退出
     */
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    .hamburger-containter {
    height: 100%;
    line-height: 46px;
    float: left;
    cursor: pointer;
    transition: background .3s;
      &:hover {
        background: rgba(0,0,0,.025);
      }
    }
    .breadcrumb-containter {
      float: left;
    }
    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;
      &:focus {
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;
        &:hover {
          background: rgba(0,0,0,.025);
        }
      }
    }
    .avatar-containter {
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          cursor: pointer;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          font-size: 12px;
          position: absolute;
          right: -20px;
          top: 25px;
        }
      }
    }
  }
</style>
