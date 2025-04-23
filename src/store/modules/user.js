import {
  login,
  logout,
  getInfo
} from '@/api/user'
import {
  getToken,
  getTenantId,
  setToken,
  removeToken,
  getUserId,
  setUserId,
  setTenantId,
  setInitflag,
  setUserName,
  setRoleName,
  getRoleName,
  getUserName,
  getInitflag
} from '@/utils/auth'
import router, {
  resetRouter
} from '@/router'

const state = {
  token: getToken(),
  userId: getUserId(),
  tenantId: getTenantId(),
  initFlag: getInitflag(),
  userName: getUserName(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  Permission: [],
  sysList: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_UID: (state, userId) => {
    state.userId = userId
  },
  SET_TID: (state, tenantId) => {
    state.tenantId = tenantId
  },
  SET_initFlag: (state, initFlag) => {
    state.initFlag = initFlag
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSION: (state, Permission) => {
    state.Permission = Permission
  },
  SET_SYSLIST: (state, sysList) => {
    state.sysList = sysList
  },
  SET_USERNAME: (state, userName) => {
    state.userName = userName
  }
}

const actions = {
  // user login       登录传form到login方法中，进行登录验证，以及在vuex和cookie中的存储
  login({
    commit
  }, userInfo) { //引入commit方法向vuex传值(提交变量)
    const {
      username,
      password
    } = userInfo
    return new Promise((resolve, reject) => { //异步处理登录验证
      login({
        username: username.trim(),
        password: password
      }).then(response => { //用户面去空格，并将数据传入login接口中
        const data = response

        commit('SET_TOKEN', data.token) //向vuex中存储token                                      
        // commit('SET_UID', data.userId)                                               //向vuex中存储userId 
        // commit('SET_USERNAME', username)                                             //向vuex中存储username
        setToken(data.token) //调用utils/auth中的方法向cookie中存储token
        setUserId(data.userId) //调用utils/auth中的方法向cookie中存储userId
        // setUserName(username) //调用utils/auth中的方法向cookie中存储username
        resolve()
      }).catch(error => {
        console.log('act login err', error)
        reject(error)
      })
    })
  },

  // get user info 获取权限表
  getInfo({
    commit,
    state
  }) { //引入commit方法向vuex传值,提交变量
    return new Promise((resolve, reject) => { //异步获取
      getInfo().then(response => { //调用getInfo接口来获取权限表
        const user = response.data
        if (!user) {
          reject('Verification failed, please Login again.') //如果没有结果，报错
        }
        const {
          roles,
          nickName,
          avatar,
          introduction,
          resourceList,
          tenantId,
          initFlag
        } = user //如果有值，则将值赋给新const的对象
        //        角色                                    权限表
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) { //判定是否拥有角色
          reject('此账号无权限,请联系管理员')
        } else {
          commit('SET_ROLES', roles) //将拥有的角色传给vuex
          setRoleName(roles[0].roleName)
        }
        commit('SET_PERMISSION', resourceList) //将权限表传给vuex
        commit('SET_NAME', nickName)
        commit('SET_AVATAR', avatar)
        setUserName(nickName) //调用utils/auth中的方法向cookie中存储username

        // commit('SET_INTRODUCTION', introduction)
        // commit('SET_TID', tenantId) //向vuex中存储tenantId
        // setTenantId(data.tenantId) //调用utils/auth中的方法向cookie中存储userId
        // commit('SET_initFlag', initFlag) //向vuex中存储initFlag

        // setInitflag(data.initFlag)
        setUserId(user.userId) //调用utils/auth中的方法向cookie中存储userId

        resolve(user) //将data返回
      }).catch(error => {
        reject(error)
      })
    })
  },

  // //  登出
  logout({
    commit
  }, userInfo) {
    const {
      username
    } = userInfo

    return new Promise((resolve) => {
      logout({
        username: username
      }).then(() => { //用户面去空格，并将数据传入login接口中
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({
    commit,
    dispatch
  }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const {
        roles
      } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {
        root: true
      })
      console.log(2222222, accessRoutes)
      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, {
        root: true
      })

      resolve()
    })
  },
  setSysList({
    commit
  }, sysList) {
    commit('SET_SYSLIST', sysList)

  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
