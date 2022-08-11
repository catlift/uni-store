
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

// 按需导入 $http 对象
import { $http } from '@escook/request-miniprogram'

// 将按需导入的 $http 挂载到 wx 顶级对象之上，方便全局调用
wx.$http = $http

// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http

// 配置请求根路径
$http.baseUrl = "https://www.uinav.com"

// 请求拦截器，请求开始之前做一些事情
$http.beforeRequest = function (options) {
	uni.showLoading({
		title: "数据加载中"
	})
}

// 响应拦截器
$http.afterRequest = function() {
	uni.hideLoading()
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif