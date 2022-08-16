<!-- 结算组件 -->
<template>
	<view class="my-settle-container">
		<!-- 全选区域 -->
		<label class="radio" @click="changeAllState">
			<radio color="#D81E06" :checked="isFullCheck" /><text>全选</text>
		</label>
		
		<!-- 合计 -->
		<view class="amount-box">
			合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>
		
		<!-- 结算按钮 -->
		<view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations, mapState } from "vuex"
	
	export default {
		name:"my-settle",
		data() {
			return {
				
			};
		},
		computed: {
			...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
			// 是否全选
			isFullCheck() {
				return this.total === this.checkedCount
			},
			// addstr 是详细的收货地址
			...mapGetters('m_user', ['addstr']),
			// token 是用户登录成功之后的 token 字符串
			...mapState('m_user', ['token'])
		},
		methods: {
			// 使用 mapMutations 辅助函数，把 m_cart 模块提供的 updateAllGoodsState 方法映射到当前组件中使用
			...mapMutations('m_cart', ['updateAllGoodsState']),
			// label 的点击事件处理函数
			changeAllState() {
				// 修改购物车中所有商品的选中状态
				// !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
				this.updateAllGoodsState(!this.isFullCheck)
			},
			// 点击了结算按钮
			settlement() {
				// s1. 先判断是否勾选了要结算的商品
				if(!this.checkedCount) return uni.$showMsg('请选择要购买的商品！');
				
				// s2. 再判断用户是否选择了收货地址
				if(!this.addstr) return uni.$showMsg("请选择收货地址！");
				
				// s3. 最后判断用户是否登录
				if(!this.token) return uni.$showMsg("请先登录！")
			}
		}
	}
</script>

<style lang="scss">
	.my-settle-container {
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 5px;
		width: 100%;
		height: 50px;
		background-color: white;
		font-size: 14px;
		
		.radio {
			display: flex;
			align-items: center;
		}
		
		.amount {
			color: #D81E06;
		}
		
		.btn-settle {
			padding: 0 10px;
			height: 50px;
			min-width: 100px;
			background-color: #D81E06;
			color: white;
			line-height: 50px;
			text-align: center;
		}
	}
</style>