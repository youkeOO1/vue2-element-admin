const getters = {
  roles: (state) => state.user.roles,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  sidebar: (state) => state.app.sidebar,
  permission_routes: (state) => state.permission.routes
}

export default getters
