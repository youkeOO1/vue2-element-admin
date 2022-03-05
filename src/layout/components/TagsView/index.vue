<template>
  <div class="tags-view-containter">
    <!-- 滚动条 -->
    <scroll-pane ref="scollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        ref="tag"
        v-for="tag in visitedViews"
        :key="tag.path"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        :class="isActive(tag) ? 'active': ''"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <i v-if="!isAffix(tag)" class="el-icon-close" @click.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
    <!-- 右键菜单 -->
    <ul v-show="visible" class="contextmenu" :style="{left: left + 'px', top: top + 'px'}">
      <li @click="refreshSelectTag(selectTag)">刷新</li>
      <li v-if="!isAffix(selectTag)" @click="closeSelectedTag(selectTag)">关闭</li>
      <li @click="closeOptions">关闭其他</li>
      <li @click="closeAll(selectTag)">关闭所有</li>
    </ul>
  </div>
</template>
<script>
import ScrollPane from './ScrollPane'
import path from 'path'

export default {
  components: {
    ScrollPane
  },
  data() {
    return {
      visible: false, // 是否展示右键菜单
      left: 0, // 右键菜单的 X 坐标位置
      top: 0, // 右键菜单的 Y 轴坐标位置
      selectTag: {}, // 右键菜单选中的 tag
      affixTags: [] // 标签数组
    }
  },
  computed: {
    route() {
      return this.$store.state.permission.routes
    },
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },
  watch: {
    $route() {
      this.addTags()
      this.moveToCurrentTag()
    },
    // 是否展示右侧菜单
    visible(val) {
      if (val) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path
    },
    /**
     * 是否一直展示
     */
    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },
    /**
     * 过滤路由
     */
    filterAffixTags(routes, basePath = '/') {
      // 隐藏路由不要
      // route.meta.affix = true 留下
      // 子路由
      let res = []
      for (const item of routes) {
        if (item.meta && item.meta.affix) {
          const tagPath = path.resolve(basePath, item.path)
          // 将其符合规则的路由进行简化
          res.push({
            fullPath: tagPath,
            path: tagPath,
            title: item.meta.title,
            meta: { ...item.meta }
          })
        }
        if (item.children) {
          const chilArr = this.filterAffixTags(item.children, item.path)
          if (chilArr.length >= 1) {
            res = [...res, ...chilArr]
          }
        }
      }
      return res
    },
    /**
     * 初始化标签
     */
    initTags() {
      // 筛选出符合规则的路由，并将其简化
      const affixTags = this.affixTags = this.filterAffixTags(this.route)
      // 将其符合规则的路由保存到vuex中
      for (const item of affixTags) {
        this.$store.dispatch('tagsView/addView', item)
      }
    },
    addTags() {
      // 获取当前的路由名
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
    },
    /**
     * 关闭当前选中的标签
     */
    closeSelectedTag(tag) {
      this.$store.dispatch('tagsView/delView', tag).then(({ visitedViews }) => {
        // 是否将当前页面删除
        if (this.isActive(tag)) {
          // 跳转到数组最后一个
          this.toLastView(visitedViews, tag)
        }
      })
    },
    /**
     * 标签关闭时，跳抓到标签数组最后一个
     * 如果没有，跳转到/dashboard
     * 还没有，跳转到首页
     */
    toLastView(visitedViews, tag) {
      const lastView = visitedViews.slice(-1)[0]
      if (lastView) {
        this.$router.push(lastView.fullPath)
      } else if (tag.path === 'Dashboard') {
        this.$route.replace('/dashboard')
      } else {
        this.$router.push('/')
      }
    },
    /**
     * 刷新选中的标签页面
     */
    refreshSelectTag(route) {
      this.$store.dispatch('tagsView/delCacheView', route).then(() => {
        const { fullPath } = route
        this.$nextTick(() => {
          this.$router.push({ path: fullPath })
        })
      })
    },
    closeOptions() {
      if (this.$route.path !== this.selectTag.path) {
        this.$router.push(this.selectTag)
      }
      this.$store.dispatch('tagsView/delOptionsViews', this.selectTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAll(route) {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some((ele) => ele.path === route.path)) {
          // 说明没有删除干净
          return
        }
        this.toLastView(visitedViews, route)
      })
    },
    /**
    * 打开右键菜单
     */
    openMenu(tag, e) {
      /**
      * 跟随鼠标的位置显示右键菜单
      * 规定右键菜单的宽度
      * 算出右键宽度的显示最大位置的坐标：
      *   maxX的坐标 tags-view-containter.width - 右键菜单的宽度
      *   Y的坐标根据鼠标的点击的位置就可以
      * 如何获取鼠标的位置，使用client家族，client 显示鼠标距离视口左上角的位置
      * X的坐标需要-侧边栏的宽度
       */
      // this.visible = true
      const menuMinWidth = 105
      // 获取侧边栏的宽度
      const offsetLeft = this.$el.getBoundingClientRect().left
      // 获取 tags-view-containter 的宽度
      const width = this.$el.offsetWidth
      // 显示X轴坐标最大值
      const maxLeft = width - menuMinWidth
      const left = e.clientX - offsetLeft + 15
      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }
      this.top = e.clientY
      this.visible = true
      this.selectTag = tag
    },
    closeMenu() {
      this.visible = false
    },
    /**
     * 滚动条事件
     */
    handleScroll() {
      // 滚动时 右键菜单关闭
      this.closeMenu()
    },
    /**
     * 移动到当前选中的tag
     */
    moveToCurrentTag() {
      const tagArr = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tagArr) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scollPane.moveToTarget(tag)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tags-view-containter {
    height: 34px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-sizing: border-box;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
    .tags-view-wrapper {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      position: relative;
      .tags-view-item {
        position: relative;
        display: inline-block;
        box-sizing: border-box;
        height: 26px;
        line-height: 26px;
        border: 1px solid #d8dce5;
        font-size: 12px;
        color: #495060;
        background: #fff;
        cursor: pointer;
        margin-top: 4px;
        padding: 0 8px;
        margin-left: 5px;
        &:first-of-type {
          margin-left: 15px;
        }
        &:last-of-type {
          margin-right: 15px;
        }
        &.active {
          background: #42b983;
          color: #fff;
          border-color: #42b983;
          &::before {
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 2px;
            background: #fff
          }
        }
        .el-icon-close {
          width: 16px;
          height: 16px;
          vertical-align: 2px;
          border-radius: 50%;
          text-align: center;
          transition: all .3s cubic-bezier(.645, .045, .355, 1);
          transform-origin: 100% 50%;
          &:before {
            transform: scale(.6);
            display: inline-block;
            vertical-align: -3px;
          }
          &:hover {
            background-color: #b4bccc;
            color: #fff;
          }
        }
      }
    }
    .contextmenu {
      position: absolute;
      min-width: 105px;
      background: #fff;
      color: #333;
      font-size: 12px;
      font-weight: 400;
      list-style: none;
      margin: 0;
      padding: 5px 0;
      border-radius: 5px;
      z-index: 3000;
      box-shadow: 2px 2px 3px 0 rgba(0,0,0,.3);
      li {
        padding: 7px 16px;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }
    }
  }
</style>
