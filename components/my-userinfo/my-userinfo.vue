<template>
	<view class="my-userinfo-container">
		
		<!-- 头像昵称 -->
		<view class="top-box">
			<image :src="userinfo.avatarUrl" class="avatar"></image>
			<view class="nickname">{{userinfo.nickname}}</view>
		</view>
		
		<!-- 面板列表 -->
		<view class="panel-list">
			<!-- 第一个面板 -->
			<view class="panel">
				<!-- 面板主体内容 -->
				<view class="panel-body">
					<view class="panel-item">
						<text>18</text>
						<text>收藏的店铺</text>
					</view>
					<view class="panel-item">
						<text>66</text>
						<text>收藏的商品</text>
					</view>
					<view class="panel-item">
						<text>85</text>
						<text>关注的商品</text>
					</view>
					<view class="panel-item">
						<text>998</text>
						<text>足迹</text>
					</view>
				</view>
			</view>
			
			<!-- 第二个面板 -->
			<view class="panel">
				<!-- 面板标题 -->
				<view class="panel-title">我的订单</view>
				<!-- 面板主体内容 -->
				<view class="panel-body">
					<view class="panel-item">
						<image src="/static/icon/icon-1.png" class="icon"></image>
						<text>待付款</text>
					</view>
					<view class="panel-item">
						<image src="/static/icon/icon-2.png" class="icon"></image>
						<text>待收货</text>
					</view>
					<view class="panel-item">
						<image src="/static/icon/icon-3.png" class="icon"></image>
						<text>退款/退货</text>
					</view>
					<view class="panel-item">
						<image src="/static/icon/icon-4.png" class="icon"></image>
						<text>全部订单</text>
					</view>
				</view>
			</view>
			
			<!-- 第三个面板 -->
			<view class="panel">
				<view class="panel-list-item">
					<text>收货地址</text>
					<uni-icons type="arrow-right" size="15"></uni-icons>
				</view>
				<view class="panel-list-item">
					<text>联系客服</text>
					<uni-icons type="arrow-right" size="15"></uni-icons>
				</view>
				<!-- loginexit 退出登录方法 -->
				<view class="panel-list-item" @click="loginexit">
					<text>退出登录</text>
					<uni-icons type="arrow-right" size="15"></uni-icons>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	// 导入 user.js 的 vuex
	import { mapState, mapMutations } from "vuex"
	
	export default {
		name:"mu-userinfo",
		data() {
			return {
				
			};
		},
		computed: {
			// 将 m_user 模块中的 userinfo 映射到当前页面中使用
			...mapState('m_user', ['userinfo']),
		},
		methods: {
			// 退出登录
			async loginexit() {
				const [err, succ] = await uni.showModal({
					title: "提示",
					content: "确认退出当前登录状态？"
				}).catch(err => err)
				// 确认退出登录状态，清空 user.js 的 vuex 存储的 userinfo(用户基本信息)、token(用户成功登录的字符串)、address(收货地址)
				if(succ && succ.comfirm) {
					this.updateAddress({});
					this.updateUserInfo({});
					this.updateToken('');
				}
			},
			...mapMutations('m_user', ['updateAddress', 'updateUserInfo', 'updateToken']),
		}
	}
</script>

<style lang="scss">
	.my-userinfo-container {
		height: 100%;
		background-color: #f4f4f4;
		
		.top-box {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 400rpx;
			background-color: #D81E06;
			
			.avatar {
				display: block;
				width: 90px;
				height: 90px;
				border-radius: 50%;
				border: 2px solid white;
				box-shadow: 0 1px 5px black;
			}
			
			.nickname {
				color: white;
				font-weight: bold;
				font-size: 16px;
				margin-top: 10px;
			}
		}
		
		.panel-list {
			position: relative;
			top: -10px;
			padding: 0 10px;
			
			.panel {
				margin-bottom: 8px;
				background-color: white;
				border-radius: 8px;
				
				.panel-title {
					padding-left: 10px;
					border-bottom: 1px solid #f4f4f4;
					line-height: 45px;
					font-size: 15px;
				}
				
				.panel-body {
					display: flex;
					justify-content: space-around;
					
					.panel-item {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: space-around;
						font-size: 13px;
						padding: 10px 0;
						
						.icon {
							width: 35px;
							height: 35px;
						}
					}
				}
				
				.panel-list-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 15px;
					height: 45px;
					font-size: 15px;
					
					&:nth-child(n+1) {
						border-top: 1px solid #f4f4f4;
					}
				}
			}
		}
	}
</style>