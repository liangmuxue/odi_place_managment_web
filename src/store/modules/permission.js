import {
  asyncRoutes,
  constantRoutes,
  asyncRoutes2
} from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */

//将route与权限表进行对比
function hasPermission(permission, route) {
  if (route.path) { //判定是否有route
    let flag = permission.filter(item => item.resCode === route.path) //判定对这个route是否有权限
    let typeArray = flag.filter(item => item.resType === 3) //判定这个route是否对应实际页面（resType=3为对应实际页面）
    if (flag.length !== 0) { //如果有该route权限
      if (typeArray.length !== 0) { //且对应实际页面，处置分配一个type：1
        // 不遍历子集 用于关联页面的菜单
        return {
          isBool: true,
          type: 1
        }
      } else {
        // 遍历子集 用于不关联页面的菜单                                       //若不对应实际页面，处置分配一个type：2
        return {
          isBool: true,
          type: 2
        }

      }
    } else {
      return {
        isBool: false,
        type: 0
      } //如果没有该route权限，处置分配一个isBool: false
    }
    // return roles.some(role => route.meta.roles.includes(role))
  } else {
    return {
      isBool: true,
      type: 2
    } //如果没有route，判定为拥有所有权限，处置分配一个type：2
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 * @param permission
 */
export function filterAsyncRoutes(routes, permission) {
  const res = []
  routes.forEach(route => { //遍历route集合的每个路由
    const tmp = {
      ...route
    } //每次遍历都将这个路由赋值给tmp
    let falg = hasPermission(permission, tmp) //利用hasPermission方法将tmp与permission权限表进行对比
    if (falg.isBool) { //如果有该route权限
      if (falg.type === 1) { //且type：1,则将这个路由push到res路由表中
        res.push(tmp)
      } else { //若type不为1，则需要对其子集路由与permission权限表进行对比
        if (tmp.children) {
          tmp.children = filterAsyncRoutes(tmp.children, permission)
        }
        res.push(tmp) //并将该路由push到res路由表中
      }
    }
  })
  // console.log(222222,routes)
  // console.log(123456,res)
  return res //返回的res即为拥有权限的路由表
}

const state = {
  routes: [],
  addRoutes: [],
  currentRoutes: {}

}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_CURRENT_ROUTES: (state, routes) => {
    state.currentRoutes = routes
  }

}

const actions = {
  generateRoutes({
    commit
  }, permission) {
    return new Promise(resolve => {
      let accessedRoutes
      accessedRoutes = filterAsyncRoutes(asyncRoutes, permission) //向filterAsyncRoutes方法传值(所以有路由集合，获取的权限表)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
