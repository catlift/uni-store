<template>
	<view>
		<!-- goods 是从父组件传过来的数据，在 props 接受了 -->
		<view class="goods-item">
			<!-- 商品在左侧的图片 -->
			<view class="left-goods-item">
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
			}
		},
		// 过滤器
		filters: {
			// 把价格的数字处理为带两位小数的数字
			toFixed(num) {
				return Number(num).toFixed(2);
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