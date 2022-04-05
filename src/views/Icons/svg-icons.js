// 自动导入 svg
const req = require.context('../../icons/svg', false, /\.svg$/)
// 获取所有文件的key
const requireAll = (requireContext) => requireContext.keys()
// 正则匹配
// ./svgName.svg
const regex = /\.\/(.*).svg/

// 遍历所有文件的key
const svgIcons = requireAll(req).map((path) => {
  // path.match(regex)的返回值如下
  //  ['./404.svg', '404', index: 0, input: './404.svg', groups: undefined]
  return path.match(regex)[1]
})

export default svgIcons
