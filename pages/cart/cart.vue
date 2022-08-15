<template>
	<view>
		<!-- 购物车商品列表的标题区域 -->
		<view class="cart-title">
			<!-- 左侧图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 描述文本 -->
			<text class="cart-title-text">购物车</text>
		</view>
		
		<!-- 渲染加入购物车的商品 -->
		<block v-for="(goods, i) in cart" :key="i">
			<!-- 
				* :goods 传递的是商品对象信息
				* :show-radio 传递是复选框是否显示
				*  在 radioChangeHandler 事件处理函数中，通过事件对象 e，得到商品的 goods_id 和 goods_state
			 -->
			<my-goods :goods="goods" :show-radio="true" @radio-change="radioChangeHandler"></my-goods>
		</block>
		
	</view>
</template>

<script>
	// 导入封装的 mixin 模块
	import badgeMixin from "@/mixins/tabbar-badge.js"
	// 导入 cart 的 store
	import { mapState, mapMutations } from "vuex"
	
	export default {
		// 将 badgeMixin 混入到当前页面进行使用
		mixins: [badgeMixin],
		data() {
			return {
				
			};
		},
		onLoad() {
			console.log(this.cart)
		},
		computed: {
			// 将 m_cart 模块中的 cart 数组 映射到当前页面
			...mapState('m_cart', ['cart']),
		},
		methods: {
			radioChangeHandler(e) {
				// 输出得到的数据 -> {goods_id: Number, goods_state: boolean}
				// console.log(e)
				this.updateGoodsState(e);
			},
			// 将 m_cart 模块中的 Mutations函数里面的 updateGoodsState() 方法映射到当前页面
			...mapMutations('m_cart', ['updateGoodsState'])
		}
	}
</script>

<style lang="scss">
	.cart-title {
		display: flex;
		// justify-content: space-between;
		align-items: center;
		padding-left: 5px;
		border-bottom: 1px solid #efefef;
		font-size: 14px;
		height: 40px;
		
		.cart-title-text {
			margin-left: 10px;
		}
	}
</style>
