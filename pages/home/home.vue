<template>
	<view>
		<!-- 搜索框 -->
		<view class="search-box" :style="{top: sh + 'px'}">
			<my-search @click="gotoSearch"></my-search>
		</view>
		
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
		
		<!-- 导航 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)">
				<image :src="item.image_src" class="nav-img"></image>
			</view>
		</view>
		
		<!-- floor -->
		<view class="floor-list">
			<!-- floor item -->
			<view class="floor-item" v-for="(item, i) in floorList" :key="i">
				<!-- floor_title -->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				
				<!-- floor-img-box -->
				<view class="floor-img-box">
					<!-- left-box -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
					</navigator>
					<!-- right-boxs -->
					<view class="right-img-box">
						<navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0" :url="item2.url">
							<image :src="item2.image_src" :style="{width: item2.image_width + 'rpx'}" mode="widthFix"></image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	// 导入封装的 mixin 模块
	import badgeMixin from "@/mixins/tabbar-badge.js"
	
	export default {
		// 将 badgeMixin 混入到当前页面进行使用
		mixins: [badgeMixin],
		data() {
			return {
				// 存储获取的轮播图数据
				swiperList: [],
				// 存储分类导航数据
				navList: [],
				// 存储楼层数据（商品图片）
				floorList: [],
				// 搜索框距离顶部的位置
				sh: 0
			};
		},
		onLoad() {
			// 调用方法，获取轮播图数据
			this.getSwiperList();
			
			// 调用方法，获取nav数据
			this.getNavList();
			
			// 调用方法，获取floor数据
			this.getFloorList();
			
			// 获取当前系统的信息
			const sysInfo = uni.getSystemInfoSync();
			// console.log(sysInfo);
			// 搜索框距离顶部位置 = 顶部导航栏高度
			this.sh = sysInfo.windowTop;
		},
		methods: {
			// 建立请求，获取轮播图数据
			async getSwiperList() {
				// '/' 根目录既为 main.js 配置的 basUrl
				// 发起请求
				const { data: res } = await uni.$http.get("/api/public/v1/home/swiperdata");
				
				// 请求失败,弹出错误提示
				if (res.meta.status !== 200) {
					// 数据请求失败后，经常需要调用 uni.showToast({}) 方法，不妨在 main.js 中封装一个方法出来
				  //   return uni.showToast({
						// title: '数据请求失败！',
				  //       duration: 1500,
				  //       icon: 'none',
				  //   })
				  return uni.$showMsg();
				}
				
				// 请求成功，为 data 中的 swiperList 赋值
				// console.log("轮播图 图片数据：", res);
				this.swiperList = res.message;
			},
			// 建立请求，获取导航数据
			async getNavList() {
				const { data: res } = await uni.$http.get("/api/public/v1/home/catitems")
				if(res.meta.status !== 200) return uni.$showMsg();
				
				// console.log("nav数据：", res);
				this.navList = res.message;
			},
			// 监听事件,点击第一个图标跳转到 cate 页面
			navClickHandler(item) {
				if(item.name === "分类") {
					uni.switchTab({
						url: "/pages/cate/cate"
					})
				}
			},
			// 建立请求，获取楼层(商品)数据
			async getFloorList() {
				const { data: res } = await uni.$http.get("/api/public/v1/home/floordata");
				if(res.meta.status !== 200) return uni.$showMsg();
				
				res.message.forEach(floor => {
					floor.product_list.forEach(prod => {
						// console.log(prod)
						prod.url = "/subpackages/goods_list/goods_list?" + prod.navigator_url.split("?")[1];
					})
				})
				
				// console.log("floor数据：", res)
				this.floorList = res.message;
			},
			// 点击搜索框跳转到搜索页面
			gotoSearch() {
				uni.navigateTo({
					url: "/subpackages/search/search"
				})
			}
		}
		
	}
</script>

<style lang="scss">
	.search-box {
		// 黏性定位
		position: sticky;
		top: 0;
		z-index: 999;
	}
	
	swiper {
		height: 330rpx;
		
		.swiper-item,image {
			width: 100%;
			height: 100%;
		}
	}
	
	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;
		
		.nav-img {
			width: 128rpx;
			height: 128rpx;
		}
	}
	
	.floor-list {
		.floor-title {
			display: flex;
			height: 60rpx;
			width: 100%;
		}
		
		.floor-img-box {
			display: flex;
			padding-left: 10rpx;
			
			.right-img-box {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-around;
			}
		}
	}
</style>
