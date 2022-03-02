<template>
  <!-- 展示路由  -->
  <!-- 三种路由：第一种没有子路由，第二种有子路由，第三种是隐藏路由不予展示 -->
  <!-- 用户子路由需要使用 组件引用本身 -->
  <div v-if="!item.hidden">
    <!-- 没有子路由 -->
    <template v-if="hasOneShowChild(item.children,item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <!-- icon and title  -->
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title || (item.meta && item.meta.title)"
          />
        </el-menu-item>
      </app-link>
    </template>
    <!-- 拥有子路由 -->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <!-- 显示 icon -->
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
        />
      </template>
      <!-- 递归组件，显示子菜单 -->
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
        :is-nest="true"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import AppLink from './link.vue'
import Item from './Item'
import { isExternal } from '@u/validate'

export default {
  name: 'SidebarItem',
  components: {
    AppLink,
    Item
  },
  props: {
    // 传递过来的路由
    item: {
      type: Object,
      required: true
    },
    // 默认路径
    basePath: {
      type: String,
      default: ''
    },
    // 是否为子路由
    isNest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    /**
     * props 中 item 与 onlyOneChild 的区别
     * 路由跳转路径问题：
     *  由于使用 path.resolve 函数合成路由地址，item 中 path 有两种情况：
     *    父级路由：basePath 与 item.path 相等
     *    子路由：basePath 就是 路由访问地址(父级路由地址/子路由地址) item.path 是子路由地址但是没有"/"符号，会进行路径合并
     *    变成 父级路由地址/子路由地址/子路由地址
     * 放入 return {} 中 会报错，报错信息为：在组件渲染函数中，你可能有一个无限的更新循环
     */
    this.onlyOneChild = null
    return {
      // onlyOneChild: null
    }
  },
  methods: {
    /**
     * 是否只有一个子路由
     * @param { array } children
     * @param { object } parent
     * @returns Boolean
     */
    hasOneShowChild(children = [], parent) {
      // 筛选子路由，将隐藏路由过滤出去
      const showingChildren = children.filter((ele) => {
        if (ele.hidden) {
          return false
        } else {
          this.onlyOneChild = ele
          return true
        }
      })
      // 若果只有一个子路由，icon 显示子路由的
      if (showingChildren.length === 1) {
        return true
      }
      // 如果没有子路由，icon 显示 父级路由的
      // router 中 children 路由的 path 是 该子路由路径，但是在下面 paht.resolve 函数中 是会重复出现子路由路径
      // children 的子路由长度为 0 将其 path 属性置空
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }
      return false
    },
    /**
     * 解析路径
     */
    resolvePath(routePath) {
      // 判断 routePath 是否为外部访问链接
      if (isExternal(routePath)) {
        return routePath
      }
      // 判断 basePath 是否为外部外部访问链接
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      // 返回一个解析后的路径
      // console.log('item---', this.item.path, '---only---', this.onlyOneChild.path, '---base---', this.basePath, '---routepath---', routePath)
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

<style>

</style>
