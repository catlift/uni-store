<template>
	<view>
		<view class="goods-list">
			<block v-for="(item, i) in goodsList" :key="i">
				<my-goods :goods="item"></my-goods>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 存储查询的参数
				queryObj: {
					// 查询的关键字
					query: "",
					// 商品分类 id
					cat_id: "",
					// 页码值
					pagenum: 1,
					// 每页显示的数据条数
					pagesize: 10
				},
				// 存储商品列表数据
				goodsList: [],
				// 总页数
				tatal: 0
			};
		},
		onLoad(options) {
			console.log(options)
			// 每次接受的仅仅是一条参数数据，要么是 ?query 要么是 ?cid
			this.queryObj.query = options.query || '';
			this.queryObj.cat_id = options.cid || '';
			
			this.getGoodsList();
		},
		methods: {
			// 创建连接，获取商品列表数据
			async getGoodsList() {
				const { data: res } = await uni.$http.get("/api/public/v1/goods/search", this.queryObj)
				
				if(res.meta.status !== 200) return uni.$showMsg();
				console.log(res);
				// 数据赋值
				this.goodsList = res.message.goods;
				this.tatal = res.message.tatal;
			}
		}
	}
</script>

<style lang="scss">
	.goods-list {
		
	}
</style>
