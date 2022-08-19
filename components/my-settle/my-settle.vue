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
				// 倒计时的秒数，配合 showTips 使用 
				seconds: 3,
				// 存储 showTips 使用的定时器
				timer: null,
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
				// if(!this.token) return uni.$showMsg("请先登录！")
				// s3.1 判断用户是否登录，未登录则调用倒计时跳转页面的方法
				if(!this.token) return this.delayNavigate()
				
				// s4. 实现微信支付
				this.payOrder()
			},
			// 展示倒计时的提示消息
			showTips(n) {
				// 调用 uni.showToast() 方法，展示提示消息
				uni.showToast({
					icon: "none",
					title: "请登录后再结算！" + n + ' 秒后自动跳转到登录页',
					// 为页面添加遮罩图，防止点击穿透
					mask: true,
					// 多少秒后消失
					duration: 1500,
				})
			},
			// 延迟导航到 my 页面
			delayNavigate() {
				// 每次调用 this.seconds 重置一下，避免 第 2、3...n 次执行时 this.seconds 的秒数是 0
				this.seconds = 3;
				// 延迟展示消息
				this.showTips(this.seconds);
				
				// 创建定时器，每隔 1 秒刷新 showtips 的展示消息
				this.timer = setInterval(function() {
					this.seconds -= 1;
					
					// tt1. 判断倒计时秒数
					if(this.seconds <= 0) {
						// tt2. 清除定时器
						clearInterval(this.timer);
						
						// tt3. 跳转页面
						uni.switchTab({
							url: "/pages/my/my",
							// 页面跳转成功后的回调函数
							success: () => {
								// 调用 user.js 的 vuex 里面 updateRedirectInfo 方法，存储信息到 Store 中
								this.updateRedirectInfo({
									// 跳转方式
									openType: 'switchTab',
									// 从哪个页面跳转过去的
									from: "/pages/cart/cart"
								})
							}
						})
						// tt4. 阻止后面的 showTips 方法执行
						return;
					}
					
					this.showTips(this.seconds);
				}, 1000);
			},
			// 把 m_user 模块中的 updateRedirectInfo 方法映射到当前页面中使用
			...mapMutations('m_user', ['updateRedirectInfo']),
			// 支付订单
			async payOrder() {
				// p1 创建订单 
				// p1.1 组织订单的信息对象
				const orderInfo = {
					// 订单总价格
					order_price: 0.01,
					// 收货地址
					consignee_addr: this.addstr,
					// 订单数组 [goods_id, goods_number, goods_price]
					goods: this.cart.filter(x => x.goods_state).map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }) ),
				}
				
				// p1.2 发起请求创建订单
				const { date: res } = await uni.$http.post("/api/public/v1/my/orders/create", orderInfo);
				if(res.meta.status !== 200) return uni.$showMsg("创建订单失败！");
				
				// p1.3 得到服务器响应的 "订单编号"
				const orderNumber = res.message.order_number;
				
				// p2 订单预支付
				// p2.1 发起请求获取订单的支付信息
				const { data: res2 } = await uni.$http.post("/api/public/v1/my/orders/req_unifiedorder", {order_name: orderNumber})
				
				// p2.2 预付订单生成失败
				if(res2.meta.status !== 200) return uni.$showMsg("预支付订单生成失败！");
				
				// p2.3 得到订单支付相关的必要参数
				const payInfo = res2.message.pay;
				
				// p3 发起微信支付
				// p3.1 调用 uni.requestPayment() 发起微信支付
				const [ err, succ ] = await uni.requestPayment(payInfo)
				
				// p3.2 未完成支付
				if(err) return uni.$showMsg("订单未支付！");
				
				// p3.3 完成了支付，进一步查询支付的结果
				const { data: res3 } = await uni.$http.post("/api/public/v1/my/orders/chkOrder", { order_number: orderNumber})
				// p3.4 检测到订单没有支付
				if(res3.meta.status !== 200) return uni.$showMsg("订单未支付！");
				
				// p3.5 订单支付完成
				uni.showToast({
					title: "支付成功！",
					icon: "success"
				})
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