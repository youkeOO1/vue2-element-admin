/**
 * 用户各种验证
 */

/**
 * 是否为外部访问资源
 * @param {*} path
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 检测用户
 */
export function validUsername(name) {
  const valid_map = ['admin', 'editor']
  return valid_map.includes(name)
}
