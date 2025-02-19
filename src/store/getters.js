const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  permission: state=>state.user.Permission,
  userId: state => state.user.userId,
  tenantId: state => state.user.tenantId,
  initFlag: state => state.user.initFlag,
  userName: state => state.user.userName,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  mapShow:state => state.map.mapShow,
  sysList:state=>state.user.sysList
}
export default getters
