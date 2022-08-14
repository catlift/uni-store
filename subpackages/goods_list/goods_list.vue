<template>
	<view>
		<view class="goods-list">
			<view v-for="(item, i) in goodsList" :key="i" @click="gotoDetail(item)">
				<my-goods :goods="item"></my-goods>
			</view>
			
			<view class="toTop" v-if="toTop" @click="gotoTop">
				<uni-icons type="top" size="30"></uni-icons>
			</view>
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
					cid: "",
					// 页码值
					pagenum: 1,
					// 每页显示的数据条数
					pagesize: 10
				},
				// 存储商品列表数据
				goodsList: [],
				// 总页数
				total: 0,
				// 数据节流阀控制器
				isLoading: false,
				// 返回顶部
				toTop: false
			};
		},
		onLoad(options) {
			// console.log(options)
			// 每次接受的仅仅是一条参数数据，要么是 ?query 要么是 ?cid
			this.queryObj.query = options.query || '';
			this.queryObj.cid = options.cid || '';
			
			this.getGoodsList();
		},
		methods: {
			// 创建连接，获取商品列表数据
			async getGoodsList(callback) {
				// 打开节流阀
				this.isLoading = true;
				
				// 发起请求
				const { data: res } = await uni.$http.get("/api/public/v1/goods/search", this.queryObj)
				
				// 关闭节流阀
				this.isLoading = false;
				
				// 数据请求完成，执行回调函数
				callback && callback();
				
				if(res.meta.status !== 200) return uni.$showMsg();
				// console.log(res);
				// 数据赋值,展开运算符：将 ...res.message.goods 的数据拼接到 ...this.goodsList ,再赋值给 this.goodsList
				this.goodsList = [...this.goodsList, ...res.message.goods];
				this.total = res.message.total;
			},
			// 跳转到商品详情页面
			gotoDetail(item) {
				uni.navigateTo({
					url: "/subpackages/goods_detail/goods_detail?goods_id=" + item.goods_id
				})
			},
			// 返回页面顶部
			gotoTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				})
			}
		},
		// 监听页面触底事件
		onReachBottom() {
			// 判断数据是否加载完成：当前页码 * 每页的数据条数
			if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg("数据加载完成！");
			
			// this.isLoading 为 true 既代表正在请求数据（执行 getGoodsList() 函数）
			if(this.isLoading) return
			
			// 页码增加1
			this.queryObj.pagenum += 1;
			// 重新获取数据
			this.getGoodsList()
		},
		// 监听页面下拉事件
		onPullDownRefresh() {
			// 重置数据
			this.queryObj.pagenum = 1;
			this.total = 0;
			this.goodsList = [];
			this.isLoading = false;
			
			// 发起请求
			this.getGoodsList(() => {
				uni.stopPullDownRefresh();
			})
		},
		onPageScroll(e) {
			if(e.scrollTop < 500) {
				this.toTop = false;
			}else {
				this.toTop = true;
			}
		}
	}
</script>

<style lang="scss">
	.goods-list {
		.toTop {
			display: flex;
			justify-content: center;
			align-items: center;
			position: fixed;
			right: 5%;
			bottom: 5%;
			border: 1px solid #f0f0f0;
			width: 40px;
			height: 40px;
			background-color: #ffffff;
			border-radius: 50%;
		}
	}
</style>
