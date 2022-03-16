const getters = {
  roles: (state) => state.user.roles,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  name: (state) => state.user.name,
  sidebar: (state) => state.app.sidebar,
  permission_routes: (state) => state.permission.routes,
  device: (state) => state.app.device
}

export default getters
