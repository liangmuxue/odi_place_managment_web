import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import curd from '@/utils/curd'


// 引入全局组件
import commonComponents from './components/commonComponents'
commonComponents(Vue)


import * as filters from './filters' // global filters


// 全局引入has指令用于判断按钮级别的权限
import has from "@/directive/has"; // waves directive

// import Video from 'video.js'
import 'video.js/dist/video-js.css'
// Vue.prototype.$video = Video

import global_ from './components/global'
Vue.prototype.GLOBAL = global_
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }

// 全局引入md5库进行密码报文加密
import md5 from 'js-md5';
Vue.prototype.$md5 = md5;


Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.use(curd)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  commonComponents,
  store,
  has,
  render: h => h(App)
})
