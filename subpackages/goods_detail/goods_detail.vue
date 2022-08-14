<template>
	<view v-if="goods_detail.goods_name" class="goods-detail-container">
		<!-- 商品的轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item, i) in goods_detail.pics" :key="i">
				<image :src="item.pics_big" @click="preview(i)"></image>
			</swiper-item>
		</swiper>
		
		<!-- 商品信息 -->
		<view class="goods-detail-box">
			<!-- 商品价格 -->
			<view class="price">￥{{goods_detail.goods_price}}</view>
			
			<view class="goods-detail-body">
				<!-- 商品名称 -->
				<view class="goods-name">{{goods_detail.goods_name}}</view>
				<!-- 收藏 -->
				<view class="favorites">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			
			<!-- 运费 -->
			<view class="shipping">快递：免运费</view>
		</view>
		
		<!-- 因接口的商品详情图片无法获取对应信息，这里注释了 -->
		<!-- 商品详情信息 -->
		<!-- <rich-text :nodes="goods_detail.goods_introduce"></rich-text> -->
		
		<!-- uni组件 uni-goods-nav -->
		<!-- 
			* fill Boolean 按钮是否平铺
			* options	Array 组件参数，左侧按钮的配置项
			* buttonGroup	Array 组件按钮组参数，右侧按钮的配置项
			* click 左侧按钮的点击事件
			* buttonClick 右侧按钮的点击事件 
		-->
		<view class="goods-nav">
			<uni-goods-nav :fill="true" :options="options" :buttonGrounp="buttonGroup" @click="onClick" @buttonClick="buttonClick"></uni-goods-nav>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 商品详情对象
				goods_detail: {},
				// uni-goods-nav 左侧按钮组的配置对象
				options: [
					{
						icon: "shop",
						text: "店铺"
					},
					{
						icon: "cart",
						text: "购物车",
						info: 2
					}
				],
				// uni-goods-nav 右侧按钮组的配置对象
				buttonGroup: [
					{
						text: "加入购物车",
						backgroundColor: "#ff0000",
						color: "#ffffff"
					},
					{
						text: "立即购买",
						backgroundColor: "#ffa200",
						color: "#ffffff"
					}
				]
			};
		},
		onLoad(options) {
			// 获取传递过来的 goods_id 参数
			const goods_id = options.goods_id;
			// 调用方法，获取商品的详细数据，并传入获取到的商品id参数
			this.getGoodsDetail(goods_id);
		},
		methods: {
			// 创建连接，获取数据
			async getGoodsDetail(goods_id) {
				const { data: res } = await uni.$http.get("/api/public/v1/goods/detail", {goods_id});
				
				console.log(res);
				
				if(res.meta.status !== 200) return uni.$showMsg();
				
				// 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题
				// 使用字符串的 replace() 方法，将 webp 的后缀名替换为 jpg 的后缀名(.webp 格式图片在 ios 设备上无法正常显示的问题：)
				res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display: block;" ').replace(/webp/g, 'jpg');
				
				// 赋值
				this.goods_detail = res.message;
			},
			// 实现轮播图的预览效果
			preview(i) {
				// 调用 uni.previewImage() 方法预览图片
				uni.previewImage({
					// 预览时，当前显示图片的链接/索引值
					current: i,
					// 所有图片 url 地址的数组
					urls: this.goods_detail.pics.map(x => x.pics_big)
				})
			},
			// uni-goods-nav 左侧按钮点击事件
			onClick(e) {
				// console.log(e)
				if(e.content.text === '购物车') {
					uni.switchTab({
						url: "/pages/cart/cart"
					})
				}
			},
			// uni-goods-nav 右侧按钮点击事件
			buttonClick(e) {
				
			}
		}
	}
</script>

<style lang="scss">
	.goods-detail-container {
		padding-bottom: 50px;
		
		swiper {
			height: 750rpx;
	 	
			image {
				width: 100%;
				height: 100%;
			}
		}
	 
		.goods-detail-box {
			padding: 10px;
			padding-right: 0;
			
			.price {
				color: #D81E06;
				font-size: 18px;
				margin: 10px 0;
			}
			
			.goods-detail-body {
				display: flex;
				justify-content: space-between;
				
				.goods-name {
					font-size: 13px;
					padding-right: 10px;
				}
	 		
	 		// 收藏
				.favorites {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					border-left: 1px solid #efefef;
					width: 200px;
					font-size: 12px;
					color: gray;
				}
			}
	 	
			.shipping {
				margin: 10px 0;
				font-size: 12px;
				color: gray;
			}
		}	
		
		.goods-nav {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
		}
	}
</style>
