<template>
	<view>
		<view class="scroll-view-container">
			<!-- 左侧滚动视图区域 -->
			<scroll-view class="left-scroll-view" scroll-y="true" :style="{height: wh + 'px'}">
				<block v-for="(item, i) in cateList" :key="i">
					<view :class="leftActive === i ? 'active' : '' " @click="changeLeftActive(i)">
						{{item.cat_name}}
					</view>
				</block>
			</scroll-view>
			<!-- 右侧滚动视图区域 -->
			<scroll-view class="right-scroll-view" scroll-y="true" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
				<view class="cate-level2" v-for="(item2, i2) in cateList2" :key="i2" v-if="item2.children">
					<!-- 二级分类标题 -->
					<view class="cate-level2-title">
						/ {{item2.cat_name}} /
					</view>
					<!-- 动态渲染三级分类的列表数据 -->
					<view class="cate-level3-list">
						<!-- level3-item -->
						<view class="cate-level3-item" v-for="(item3, i3) in item2.children" :key="i3">
							<!-- 图片 -->
							<image :src="item3.cat_icon" mode=""></image>
							<!-- 描述文字 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 窗口可用高度 = 屏幕高度 - tabBar高度（下面导航栏） - navigationBar高度(上面导航栏)
				wh: 0,
				// 存储分类数据
				cateList: [],
				// 左侧滚动视图区域的 当前分类
				leftActive: 0,
				// 存储右侧二级分类的数据
				cateList2: [],
				// 滚动条距离顶部的位置
				scrollTop: 0
			};
		},
		onLoad() {
			// 获取当前系统的信息
			const sysInfo = uni.getSystemInfoSync();
			// console.log(sysInfo);
			this.wh = sysInfo.windowHeight;
			
			this.getCateList();
		},
		methods: {
			// 发送请求，获取cate数据
			async getCateList() {
				const { data: res } = await uni.$http.get("/api/public/v1/categories");
				console.log("cate 数据：", res);
				if(res.meta.status !== 200) return uni.$showMsg();
				
				this.cateList = res.message;
				
				this.cateList2 = res.message[0].children;
				console.log("res.message[0].children：", res.message[0].children)
			},
			
			changeLeftActive(index) {
				this.leftActive = index;
				
				// 根据左侧点击的 index 来动态修改 cateList2 使获取的数据
				this.cateList2 = this.cateList[index].children;
				// console.log(this.cateList2)
				
				// 每次点击左侧视图区域的item时，右侧区域视图返回顶部
				this.scrollTop = this.scrollTop ? 0 : 1;
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;
		
		.left-scroll-view {
			width: 120px;
			
			view {
				line-height: 60px;
				background-color: #f7f7f7;
				text-align: center;
				font-size: 12px;
				
				&.active {
					position: relative;
					background-color: #ffffff;
					
					&::before {
						content: "";
						display: block;
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
						width: 3px;
						height: 30px;
						background-color: #c00000;
					}
				}
			}
		}
		
		.right-scroll-view {
			.cate-level2 {
				.cate-level2-title {
					padding: 15px 0;
					font-size: 12px;
					font-weight: bold;
					text-align: center;
				}
				
				.cate-level3-list {
					display: flex;
					flex-wrap: wrap;
					
					.cate-level3-item {
						display: flex;
						flex-direction: column;
						align-items: center;
						margin-bottom: 10px;
						width: 33%;
						
						image {
							width: 60px;
							height: 60px;
						}
						
						text {
							font-size: 12px;
						}
					}
				}
			}
		}
	}
</style>
