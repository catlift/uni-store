<!-- 搜索页面 -->
<template>
	<view>
		<!-- 搜索框 -->
		<view class="search-box">
			<!-- 利用官方组件 -->
			<uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
		</view>
		
		<!-- 搜索建议 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		
		<!-- 搜索历史 -->
		<view class="histroy-box" v-else>
			<!-- 标题 -->
			<view class="histroy-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17"></uni-icons>
			</view>
			<!-- 搜索内容 -->
			<view class="histroy-list">
				<!-- <uni-tag v-for="(item, i) in historyList" :key="i" :text="item" :inverted="true"></uni-tag> -->
				<uni-tag v-for="(item, i) in historys" :key="i" :text="item" :inverted="true"></uni-tag>
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
				searchResults: [],
				// 搜索历史
				historyList: ["星", "a", "apple"]
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
				// 保存搜索历史关键字
				this.saveSearchHistroy();
			},
			// 跳转到商品详情页面
			gotoDetail(goods_id) {
				uni.navigateTo({
					// 跳转到 goods_detail 页面
					url: "/subpackages/goods_detail/goods_detail?goods_id=" + goods_id
				})
			},
			// 保存历史搜索关键字
			saveSearchHistroy() {
				// this.historyList.push(this.kw)
				
				// 将 Array 数组转化为 Set 对象
				const set = new Set(this.historyList);
				// 调用 Set 对象的 delete 方法，移除对应的元素
				set.delete(this.kw);
				// 调用 Set 对象的 add 方法，向 Set 中添加元素
				set.add(this.kw);
				// 将 Set 对象转化为 Array 数组
				this.historyList = Array.from(set)
			}
		},
		computed: {
			historys() {
				// 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
				// 而是应该新建一个内存无关的数组，再进行 reverse 反转
				return [...this.historyList].reverse();
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
	
	.histroy-box {
		padding: 0 5px;
		
		.histroy-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}
		
		.histroy-list {
			display: flex;
			// 自动换行
			flex-wrap: wrap;
			
			.uni-tag {
				margin-right: 5px;
				margin-top: 5px;
				color: #000000;
			}
		}
	}
</style>
