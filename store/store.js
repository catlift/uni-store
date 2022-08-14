// vuex

// 1.1 导入 vue 和 vuex
import Vue from "vue";
import Vuex from "vuex";

// 2.1 导入购物车的 vuex 模块
import moduleCart from "./cart.js";

// 1.2. 将 vuex 安装为 vue 插件
Vue.use(Vuex);

// 1.3. 创建 store 的实例对象
const store = new Vuex.Store({
	// TODO： 挂载 store 模块
	modules: {
		// 2.2 挂载购物车的 Vuex 模块，模块内成员的访问路径被调整为 m_cart ，例如：
		m_cart: moduleCart, // 模块内的数组访问路径是 m_cart/cart
	}
})

// 1.4. 导出 store 实例对象 以供使用
export default store