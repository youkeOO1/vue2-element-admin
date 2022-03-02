<template>
  <div :class="{'show': show}" class="header-search">
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      remote
      default-first-option
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option v-for="item in options" :key="item.item.path" :value="item" :label="item.item.title" />
    </el-select>
  </div>
</template>

<script>
// fuse.js 是一个轻量级模糊搜索模块
import Fuse from 'fuse.js'
import path from 'path'

export default {
  data() {
    return {
      show: false, // 是否展示搜索框
      search: '', // 搜索内容
      fuse: undefined, // 实例化的 fuse.js
      searchPool: [], // 路由搜索池
      options: [] // 往 el-option 上渲染数据
    }
  },
  computed: {
    /**
     * route
     */
    routes() {
      return this.$store.getters.permission_routes
    }
  },
  watch: {
    routes() {
      // routes 发生变化重新生成路由的简要信息，有利于 fuse.js 快速模糊搜索
      this.searchPool = this.generateRoutes(this.routes)
    },
    searchPool(list) {
      // 搜索池更新，重新实例fuse.js
      this.initFuse(list)
    },
    show(value) {
      if (value) {
        // 当 show 为 true 时页面触发单击事件就关闭搜索框
        document.body.addEventListener('click', this.close)
      } else {
        // 当 show 为 false 时将页面单击事件取消
        document.body.removeEventListener('click', this.close)
      }
    }
  },
  mounted() {
    // 初始化 搜索池
    this.searchPool = this.generateRoutes(this.routes)
  },
  methods: {
    /**
     * 切换搜索框状态
     */
    click() {
      this.show = !this.show
      if (this.show) {
        // 将搜索框聚焦
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus()
      }
    },
    /**
     * 关闭搜索框
     */
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur()
      this.show = false
    },
    /**
     * 搜索框 change 事件
     */
    change(val) {
      console.log(val)
      this.$router.push(val.item.path)
      this.search = ''
      this.options = []
      this.$nextTick(() => {
        this.show = false
      })
    },
    /**
     * 初始化 fuse.js
     * @param {array} list
     */
    initFuse(list) {
      // Fuse 第一个参数为数据，第二参数为配置
      // 数据为符合用户权限的route
      this.fuse = new Fuse(list, {
        shouldSort: true,
        location: 0,
        threshold: 0.4,
        distance: 800,
        minMatchCharLength: 1,
        keys: [
          {
            name: 'title',
            weight: 0.7
          },
          {
            name: 'path',
            weight: 0.3
          }
        ]

      })
    },
    /**
     * 生成符合 fuse.js 模糊搜索的简易的路由
     * {
     *  path：string
     *  title: []
     * }
     */
    generateRoutes(route, basePath = '/', prefixTitle = '') {
      let res = []
      for (const item of route) {
        if (item.hidden) {
          // 隐藏路由跳过
          continue
        }
        // fuse.js 需要的数据
        const data = {
          path: path.resolve(basePath, item.path),
          title: prefixTitle
        }
        if (item.meta && item.meta.title) {
          // 是否有title属性
          data.title = prefixTitle + item.meta.title
          if (item.redirect !== 'noRedirect') {
            // 获取可以重定向的路由
            res.push(data)
          }
        }
        if (item.children) {
          // 递归遍历子路由
          const dataChil = this.generateRoutes(item.children, item.path, data.title + '>')
          if (dataChil.length >= 1) {
            res = [...res, ...dataChil]
          }
        }
      }
      return res
    },
    /**
     * 模糊搜索
     */
    querySearch(query) {
      // this.fuse.search()
      if (query !== '') {
        this.options = this.fuse.search(query)
      } else {
        this.options = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .header-search {
    font-size: 0 !important;
    .search-icon {
      font-size: 18px;
      cursor: pointer;
      vertical-align: middle;
    }
    .header-search-select {
      width: 0;
      transition: width 0.2s;
      font-size: 18px;
      border-radius: 0;
      overflow: hidden;
      background: transparent;
      vertical-align: middle;
      display: inline-block;
      ::v-deep .el-input__inner{
        border: none;
        border-radius: 0;
        padding-left: 0;
        padding-right: 0;
        box-shadow: none !important;
        vertical-align: middle;
        border-bottom: 1px solid #d9d9d9;
      }
    }
    &.show .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
</style>
