import store from '@/store'

export default function checkPermission(roles) {
  if (roles && roles instanceof Array && roles.length > 0) {
    const storeRoles = store.getters && store.getters.roles
    const hasPermission = storeRoles.some((role) => {
      return roles.includes(role)
    })

    return hasPermission
  } else {
    // throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
