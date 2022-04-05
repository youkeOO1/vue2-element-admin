import permission from './permission'

const install = function(Vue) {
  Vue.directives('permission', permission)
}

if (window.Vue) {
  window['permission'] = permission
  // eslint-disable-next-line no-undef
  Vue.use(install)
}

permission.install = install
export default permission
