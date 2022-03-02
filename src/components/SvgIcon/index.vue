/**
* 两种图标
*   1:外部访问链接
*   2:本地图标
 */
<template>
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners"></div>
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    /**
     * 是否为外部访问资源的icon
     */
    isExternal() {
      return isExternal(this.iconClass)
    },
    svgClass() {
      if (this.className) {
        // svg-icon 后面后有空格，不然两个类名合成一个类名
        return 'svg-icon ' + this.className
      }
      return 'svg-icon'
    },
    iconName() {
      return `#icon-${this.iconClass}`
    },
    /**
     * 外部icon的样式
     */
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
      }
    }
  }

}
</script>

<style  scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
/* 外部访问资源的样式 */
.svg-external-icon {
  background-color: currentColor;
  mask-size: cover!important;
  display: inline-block;
}
</style>
