<!-- 搜索页面 -->
<template>
	<view>
		<!-- 搜索框 -->
		<view class="search-box">
			<!-- 利用官方组件 -->
			<uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
		</view>
		
		<!-- 搜索建议 -->
		<view class="sugg-list">
			<view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
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
				timer: null,
				// 商品搜索结果
				searchResults: []
			};
		},
		methods: {
			input(e) {
				clearTimeout(this.timer)
				
				// 使用箭头函数，如果是 function(){} 的话，无法调用 this.getSearchList() 方法
				this.timer = setTimeout(() => {
					this.kw = e;
					// console.log(this.kw);
					
					this.getSearchList();
				}, 500);
			},
			// 创建连接，获取数据，根据搜索关键词，搜索商品建议列表
			async getSearchList() {
				// 判断搜索关键字是否为空
				if(this.kw === "") {
					this.searchResults = [];
					return
				}else if(this.kw.trim() === "") {
					return uni.$showMsg("搜索内容有误!")
				}
				
				// console.log(this.kw)
				const { data: res } = await uni.$http.get("/api/public/v1/goods/qsearch", {query: this.kw})
				console.log(res)
				if(res.meta.status !== 200) return uni.$showMsg();
				// 存储数据
				this.searchResults = res.message;
			},
			// 跳转到商品详情页面
			gotoDetail(goods_id) {
				uni.navigateTo({
					// 跳转到 goods_detail 页面
					url: "/subpackages/goods_detail/goods_detail?goods_id=" + goods_id
				})
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
	
	.sugg-list {
		padding: 0 5px;
		
		.sugg-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px 0;
			font-size: 12px;
			border-bottom: 1px solid #efefef;
			
			.goods-name {
				// 取消文本换行
				white-space: nowrap;
				overflow: hidden;
				// 文字溢出后，用 ... 代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}
</style>
