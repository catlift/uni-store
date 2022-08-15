<template>
	<view>
		<!-- goods 是从父组件传过来的数据，在 props 接受了 -->
		<view class="goods-item">
			<!-- 商品左侧的信息（图片） -->
			<view class="left-goods-item">
				<!-- 商品左侧的单选按钮, checked 存储在购物车中的商品，包含 goods_state 属性，表示商品的勾选状态  -->
				<radio checked="checked" color="#D81E06" :checked="goods.goods_state" @click="radioClickHandler" v-if="showRadio"></radio>
				<!-- 商品在左侧的图片 -->
				<image :src="goods.goods_small_logo || defaultPicture" class="goods-picture"></image>
			</view>
			<!-- 商品在右侧的描述 -->
			<view class="right-goods-item">
				<!-- 商品标题 -->
				<view class="goods-name">{{goods.goods_name}}</view>
				<view class="goods-info-box">
					<!-- 商品价格 -->
					<view class="goods-price">
						<!-- goods.goods_price | 过滤器 -->
						￥{{goods.goods_price | toFixed}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-goods",
		data() {
			return {
				// 部分图片显示不出来（没有url）
				defaultPicture: "/static/goods-default.png" || "https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png"
			};
		},
		// 接收父组件的参数
		props: {
			// 商品的信息对象
			goods: {
				type: Object,
				default: {}
			},
			// 是否展示图片左侧的 radio
			showRadio: {
				type: Boolean,
				// 如果外界没有指定 show-radio 属性的值，则默认不展示 radio 组件
				default: false
			}
		},
		// 过滤器
		filters: {
			// 把价格的数字处理为带两位小数的数字
			toFixed(num) {
				return Number(num).toFixed(2);
			}
		},
		methods: {
			// radio 组件的点击事件处理函数
			radioClickHandler() {
				this.$emit('radio-change', {
					// 商品id
					goods_id: this.goods.goods_id,
					// 商品最新勾选状态
					goods_state: !this.goods.goods_state
				})
			}
		}
	}
</script>

<style lang="scss">
	.goods-item {
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;
		
		.left-goods-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-right: 5px;
			
			.goods-picture {
				display: block;
				width: 100px;
				height: 100px;
			}
		}
		
		.right-goods-item {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			
			.goods-name {
				font-size: 13px;
			}
			
			.goods-info-box {
				.goods-price {
					font-size: 16px;
					color: #D81E06;
				}
			}
		}
	}
</style>