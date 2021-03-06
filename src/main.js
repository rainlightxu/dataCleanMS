import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import { MessageBox, Message } from 'element-ui'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang'
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import { parseTime } from '@/utils/index'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//     const { mockXHR } = require('../mock')
//     mockXHR()
// }

import axios from "axios";
Vue.prototype.$axios = axios;
//设置响应拦截器
axios.interceptors.response.use(response => {
  return response
},
  error => {
    Message({
      message: '請求出錯：' + error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return new Promise(() => { }); //中断Promise链
  })

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// 将parseTime方法挂载到全局
Vue.prototype.$parseTime = parseTime;

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false


function getServerConfig() {
  return new Promise((resolve, reject) => {
    axios.get('./serverConfig.json').then(data => {
      // console.log(data)
      for (let key in data.data) {
        Vue.prototype["$" + key] = data.data[key];
        // console.log("$" + key + ':' + data.data[key])
      }
      resolve(data);
    }).catch(error => {
      console.log(error);
      reject(error)
    })
  })
}

Vue.prototype.$getServerConfig = getServerConfig

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})