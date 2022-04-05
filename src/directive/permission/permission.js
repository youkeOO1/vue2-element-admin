import store from '@/store'

/**
 * 检查权限
 * @param {*} el
 * @param {*} binding
 */
function checkPermission(el, binding) {
  const { value } = binding
  const roles = store.getters && store.getters.roles
  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRole = value
      const hasPermission = roles.some((role) => {
        return permissionRole.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}

