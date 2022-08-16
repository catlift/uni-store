<template>
	<view v-if="cart.length !== 0">
		<!-- 购物车商品列表的标题区域 -->
		<view class="cart-title">
			<!-- 左侧图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 描述文本 -->
			<text class="cart-title-text">购物车</text>
		</view>
		
		<!-- 商品列表渲染 -->
		<!-- uni-swipe-action 是最外层包裹性质的容器 -->
		<uni-swipe-action>
			<!-- 渲染加入购物车的商品 -->
			<block v-for="(goods, i) in cart" :key="i">
				<!-- uni-swipe-action-item 可以为其子节点提供滑动操作的效果。需要通过 options 属性来指定操作按钮的配置信息 -->
				<uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(goods)">
					<!--
						* :goods 传递的是商品对象信息
						* :show-radio 传递是复选框是否显示
						* :show-num 传递是否展示价格旁边的数量控制器
						*  在 radioChangeHandler 事件处理函数中，通过事件对象 e，得到商品的 goods_id 和 goods_state
						*  @num-change 监听用户对商品数量的修改变化
					 -->
					<my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler" @num-change="numberChangeHandler"></my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		
		<!-- 结算区域 -->
		<my-settle class="cart-settle"></my-settle>
	</view>
	
	<!-- 没有物品 -->
	<view class="cart-empty" v-else>
		<image class="empty-img" src="/static/empty.png"></image>
		<text class="empty-text">空空如也~</text>
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
				options: [
					{
						text: "删除",
						style: {
							backgroundColor: "#D81E06"
						}
					}
				]
			};
		},
		computed: {
			// 将 m_cart 模块中的 cart 数组 映射到当前页面
			...mapState('m_cart', ['cart']),
		},
		methods: {
			// 将 m_cart 模块中的 Mutations函数里面的 updateGoodsState()、updateGoodsCount() 方法映射到当前页面
			...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
			radioChangeHandler(e) {
				// 输出得到的数据 -> {goods_id: Number, goods_state: boolean}
				// console.log(e)
				this.updateGoodsState(e);
			},
			// 商品数量发生了变化
			numberChangeHandler(e) {
				this.updateGoodsCount(e);
			},
			// 点击了滑动操作按钮
			swipeActionClickHandler(goods) {
				this.removeGoodsById(goods.goods_id);
			}
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
	
	.cart-settle {
		margin-bottom: 50px;
	}
	
	.cart-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 150px;
		
		.empty-img {
			width: 90px;
			height: 90px;
		}
		
		.empty-text {
			margin-top: 15px;
			font-size: 12px;
			color: gray;
		}
	}
</style>
