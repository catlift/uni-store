// 购物车的 store 模块
export default {
	// 为当前模块开启命名空间
	namespaced: true,
	
	// 模块的 state 数据
	state: () => ({
		// 购物车数组，用来存储购物车中每个商品的信息对象
		// 每个商品的信息对象，有：
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	}),
	
	// 模块的 mutations 方法
	mutations: {
		addToCart(state, goods) {
			// 根据提交的商品的 id ,查询购物车中是否存在这件商品
			// 如果不存在，则 findResult 为 undefind; 否则，为查找到的商品信息对象
			const findResult = state.cart.find((x) => x.goods_id === goods.goods_id);
			
			if(!findResult) {
				// 如果购物车中没有这件商品，则直接 push
				state.cart.push(goods);
			}else {
				// 如果购物车中有这件商品，则只更新数量即可
				findResult.goods_count++;
			}
			
			// 通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
			this.commit("m_cart/saveToStorage");
		},
		// 将购物车的数据保存到本地
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart));
		}
	},
	
	// 模块的 getters 属性
	getters: {
		// 统计购物车中的商品总数量
		total(state) {
			let count = 0;
			
			// 循环统计商品的数量，并统计到 count 中
			state.cart.forEach(goods => count += goods.goods_count);
			// 记得返回值
			return count;
		}
	}
}