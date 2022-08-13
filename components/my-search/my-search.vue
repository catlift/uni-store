<!-- 搜索框组件 -->

<template>
	<view>
		<!-- 搜索框容器 -->
		<view class="my-search-container" :style="{'background-color': bgColor}">
			<!-- 搜索框内部盒子,这个是用 view 模拟的，并不是真正的搜索框; 绑定一个点击搜索框的事件 -->
			<view class="my-search-box" :style="{'border-radius': radius + 'px'}" @click="searchBoxHandler">
				<uni-icons type="search" size="17"></uni-icons>
				<text class="placeholder">搜索</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-search",
		data() {
			return {
				
			};
		},
		props: {
			// 背景颜色 
			bgColor: {
				type: String,
				default: "#D81E06"
			},
			// border-radius
			radius: {
				type: Number,
				// 单位是 px
				default: 18
			}
		},
		methods: {
			// 点击了模拟的 input 框
			searchBoxHandler() {
				// 发射事件，参数名为 click，触发外界通过 @click 绑定的 click 事件处理函数
				this.$emit("click")
			}
		}
	}
</script>

<style lang="scss">
	.my-search-container {
		display: flex;
		align-items: center;
		padding: 0 15px;
		// 移除背景颜色，改由 props 控制
		// background-color: #c00000;
		height: 50px;
		
		.my-search-box {
			display: flex;
			align-items: center;
			justify-content: center;
			// 移除边框圆角，改由 props 控制
			// border-radius: 15px;
			width: 100%;
			height: 36px;
			background-color: #ffffff;
			
			.placeholder {
				margin-left: 5px;
				font-size: 15px;
			}
		}
	}
</style>