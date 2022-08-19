// 用户收货地址的 vuex 模块

export default {
	// 开启命名空间
	namespaced: true,
	
	// state 数据
	state: () => ({
		/** 收货地址
		 * 1.3 读取本地的收货地址数据，初始化 address 对象 */
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
		// 3.3 登录成功后的字符串
		token: uni.getStorageSync('token') || '',
		// 2.3 用户的基本信息
		userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
		/**
		 * 重定向的 object 对象，{opentype, from}
		 * openType 表示以哪种方式导航回之前的页面
		 * from 表示之前页面的 url 地址
		 */
		redirectInfo: null
	}),
	
	// 方法
	mutations: {
		// 更新收货地址, address --> Object
		updateAddress(state, address) {
			state.address = address
			
			// 1.2 通过 this.commit() 方法，调用 m_user 模块下的 saveAddressToStorage 方法将 address 对象持久化存储到本地
			this.commit('m_user/saveAddressToStorage');
		},
		// 1.1 定义将 address 持久化存储到本地 mutations 方法
		saveAddressToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address));
		},
		// 更新用户信息, userinfo --> Object
		updateUserInfo(state, userinfo) {
			state.userinfo = userinfo;
			
			// 2.2 通过 this.commit() 方法，调用 m_user 模块下的 saveAddressToStorage 方法将 address 对象持久化存储到本地
			this.commit("m_user/saveUserInfoToStorage");
		},
		// 2.1 将 userinfo 持久化存储到本地
		saveUserInfoToStorage(state) {
			uni.setStorageSync('userinfo', JSON.stringify(state.userinfo));
		},
		// 更新 token 字符串, token --> String
		updateToken(state, token) {
			state.token = token;
			
			// 3.2 通过 this.commit() 方法，调用 m_user 模块下的 saveTokenToStorage 方法，将 token 字符串持久化存储到本地
			this.commit("m_user/saveTokenToStorage");
		},
		// 3.1 将 token 字符串持久化存储到本地
		saveTokenToStorage(state) {
		    uni.setStorageSync('token', JSON.stringify(state.token));
		},
		// 更新重定向的信息对象, info --> Object
		updateRedirectInfo(state, info) {
			state.redirectInfo = info;
		}
	},
	
	// 数据包装
	getters: {
		addstr(state) {
			if (!state.address.provinceName) return ''
			
			// 拼接 省，市，区，详细地址 的字符串并返回给用户
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
		},
	}
}