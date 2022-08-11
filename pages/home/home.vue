<template>
	<view>
		<!-- 渲染轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<!-- 循环渲染轮播图的item项 -->
			<swiper-item v-for="(item, i) in swiperList" :key="i">
				<!-- <view class="swiper-item">
					动态绑定图片的 src 属性
					<image :src="item.image_src" mode=""></image>
				</view> -->
				<!-- navigator : 导航标签 -->
				<navigator class="swiper-item" :url="'/subpackages/goods_detail/goods_detail?goods_id=' + item.goods_id">
					<!-- 动态绑定图片的 src 属性 -->
					<image :src="item.image_src" mode=""></image>
				</navigator>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 存储获取的轮播图数据
				swiperList: []
			};
		},
		onLoad() {
			// 调用方法，获取轮播图数据
			this.getSwiperList()
		},
		methods: {
			async getSwiperList() {
				// '/' 根目录既为 main.js 配置的 basUrl
				// 发起请求
				const { data: res } = await uni.$http.get("/api/public/v1/home/swiperdata");
				
				// 请求失败,弹出错误提示
				if (res.meta.status !== 200) {
				    return uni.showToast({
						title: '数据请求失败！',
				        duration: 1500,
				        icon: 'none',
				    })
				}
				
				// 请求成功，为 data 中的 swiperList 赋值
				console.log(res)
				this.swiperList = res.message;
			}
		}
		
	}
</script>

<style lang="scss">
	swiper {
		height: 330rpx;
		
		.swiper-item,image {
			width: 100%;
			height: 100%;
		}
	}
</style>
