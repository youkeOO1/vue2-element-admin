<template>
  <!--外部访问链接使用 a 元素  -->
  <!-- 内部路由使用 router-link -->
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@u/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    /**
     * 是否为外部访问链接
     * computed 拥有缓存 此处的目的是为啦优化性能
     */
    isExternal() {
      return isExternal(this.to)
    },
    /**
     * 根据 path 判断使用那个元素
     */
    type() {
      if (this.isExternal) {
        // 外部访问链接 使用 a 元素
        return 'a'
      }
      // 内部路由的 path 使用 vue-router
      return 'router-link'
    }
  },
  methods: {
    /**
     * 根据链接返回对应的 attr
     */
    linkProps(to) {
      if (this.isExternal) {
        // 是外部访问链接， 创造 a 元素的 attr
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      // 是内部路由的 path 创造 router-link 的 attr
      return {
        to
      }
    }
  }
}
</script>

<style>

</style>
