
<script>
// icon and title
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []
    // icon 有两种可能
    // 第一种可能是 element-ui 的 icon
    // 第二种可能是 svg-icon
    if (icon) {
      if (icon.includes('el-icon')) {
        // element-ui 的 icon
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        // svg-icon
        vnodes.push(<svg-icon icon-class={ icon } />)
      }
      if (title) {
        vnodes.push(<span slot='title'>{(title)} </span>)
      }
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
