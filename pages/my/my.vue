<template>
	<view class="my-container">
	
		<!-- 用户未登录时 -->
		<!-- <my-login v-if="!token"></my-login> -->
		
		<!-- 用户登录后 -->
		<!-- <my-userinfo v-else></my-userinfo> -->
		<my-userinfo></my-userinfo>
	</view>
</template>

<script>
	// 导入封装的 mixin 模块
	import badgeMixin from "@/mixins/tabbar-badge.js"
	// 导入 user 的 vuex 
	import { mapState } from "vuex"
	
	export default {
		// 将 badgeMixin 混入到当前页面进行使用
		mixins: [badgeMixin],
		data() {
			return {
				
			}
		},
		methods: {
			
		},
		computed: {
			// 映射 user 模块中的 token
			...mapState('m_user', ['token']),
		}
	}
</script>

<style lang="scss">
	.my-container {
		height: 100%;
		
	}
</style>
