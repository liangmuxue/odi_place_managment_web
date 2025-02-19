import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import {
  // getBox,
  getToken
} from '@/utils/auth'

let api
api = config.serverIP

// create an axios instance
const service = axios.create({
  baseURL: api, // url = base url + request url
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  //baseURL: 'http://localhost:8090/isc',
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    // if(getBox()){      
    //   config.headers['box_id'] = getBox()
    // }
    return config
  },
  error => {
    // do something with request error
    console.log(123, error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (response.request.responseType === 'blob') {
      return response;
    } else if (res.code !== 200) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    const res = (error.response || {}).data || {};
    const message = res.code ? res.msg : error.msg

    return handleResponseError(res, message);
  }
)
let loginModal = false; //重复弹出要屏蔽
const handleResponseError = ((res, message) => {
  //需要重新登录
  if (res && res.code && (res.code == 401 || res.code == 403)) {
    if (loginModal) {
      return;
    }
    loginModal = true;
    setTimeout(() => {
      loginModal = false;
    }, 5000);

    let msg = res.code == 401 ? message : '你的登录凭证已过期，可以取消继续留在该页面，或者重新登录';
    MessageBox.confirm(msg, '重新登录', {
      closeOnClickModal: false,
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {

      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })

    }).catch(() => {

    });
  } else if (res.code === 403) //无权限
  {
    Message({
      message: message || '无权访问',
      type: 'error',
      duration: 3 * 1000
    });

    //router.replace({name:'404'});
  } else {
    Message({
      message: message || '请求失败,请稍后重试',
      type: 'error',
      duration: 3 * 1000
    });
  }

  return Promise.reject(res);
});
export default service
