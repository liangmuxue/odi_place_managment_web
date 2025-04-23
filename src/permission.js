import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken,
  getTenantName,
  removeToken
} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import {
  resetRouter
} from '@/router'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

const findCanTo = (path, resourceList) => {
  let index = path.lastIndexOf('/'); // 获取最后一个/的位置
  let lastSegment = path.substring(index + 1); // 截取最后一个/后的值        
  const name = resourceList.find(item => item.resEname === lastSegment);
  if (name) {
    return true
  } else {
    return false
  }

};
const findFirstRoutePath = (menuList) => {
  for (const menu of menuList) {
    if (menu.resType == 3) {
      if (menu.parentId) {
        const name = menuList.find(item => item.resourceId === menu.parentId);
        const path = name.resCode + '/' + menu.resEname;
        if (path) return path;

      } else {

        const path = menu.resCode;
        if (path) return path;
      }
    }
  }
  return '/homePage'; // 默认兜底路径
};
//点击登录之后，在加载router之前触发
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in     获取cookie中存储的token
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page   如果path=/login，直接跳转入首页
      next({
        path: '/homePage'
      })
      NProgress.done()
    } else {
      // const accessRoutes = await store.dispatch('permission/generateRoutes', {})    //返回拥有权限的路由表并赋值给accessRoutes
      // // dynamically add accessible routes 挂载有权限的路由列表
      // router.addRoutes(accessRoutes)

      // determine whether the user has obtained his permission roles through getInfo     判断用户是否已通过getinfo获得其权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {

        next()
      } else {
        try {
          //get user info
          //note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          //调用user中的getInfo方法中获取权限表，并将返回的data中的resourceList赋值给{resourceList}的resourceList属性
          const {
            resourceList
          } = await store.dispatch('user/getInfo')
          // let rolesReal = roles;                 将resourceList赋值给permission
          let permission = resourceList
          // generate accessible routes map based on roles         向store中的permission.js文件中的generateRoutes方法传值permission
          const accessRoutes = await store.dispatch('permission/generateRoutes', permission) //返回拥有权限的路由表并赋值给accessRoutes
          // dynamically add accessible routes 挂载有权限的路由列表
          router.addRoutes(accessRoutes)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          const canTo = findCanTo(to.fullPath, resourceList)
          if (canTo) {
            next({
              ...to,
              replace: true
            })
          } else {
            // //获取第一个权限页面并跳转
            const firstPath = findFirstRoutePath(resourceList);
            next({
              path: firstPath,
              replace: true
            });
          }

        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=/homePage`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=/homePage`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
