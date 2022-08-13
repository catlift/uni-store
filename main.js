
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

// 按需导入 $http 对象
import { $http } from '@escook/request-miniprogram'

// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http

// 配置请求根路径
// $http.baseUrl = "https://www.uinav.com"
// https://www.showdoc.com.cn/128719739414963/2513235043485226 接口文档
// 新接口地址：
$http.baseUrl = "https://api-hmugo-web.itheima.net"

// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
	uni.showLoading({
		title: '数据加载中...',
	})
}

// 请求完成之后做一些事情
$http.afterRequest = function () {
	uni.hideLoading()
}

// 数据请求失败后，经常需要调用 uni.showToast({}) 方法，不妨在 main.js 中封装一个方法出来
uni.$showMsg = function (title = "数据请求失败！", duration = 1500, icon = "none") {
	uni.showToast({
		title: title,
		duration: duration,
		icon: icon
	}) 
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