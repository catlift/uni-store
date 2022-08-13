<!-- 搜索页面 -->
<template>
	<view>
		<view class="search-box">
			<!-- 利用官方组件 -->
			<uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 搜索关键字
				kw: "",
				// 防抖关键字
				timer: null
			};
		},
		methods: {
			input(e) {
				clearTimeout(this.timer)
				
				this.timer = setTimeout(function() {
					this.kw = e;
					console.log(this.kw)
				}, 500);
			}
		}
	}
</script>

<style lang="scss">
	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
		background-color: #D81E06;
	}
</style>
