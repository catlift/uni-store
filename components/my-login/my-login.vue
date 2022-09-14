<template>
	<view class="login-container">
		<!-- 提示登录的图标 -->
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- 登录按钮 -->
		<button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
		<!-- 登录提示 -->
		<view class="tips-text">登录后尽享更多权益</view>
	</view>
</template>

<script>
	// 导入 user 的 vuex 模块, 3.1
	import { mapMutations, mapState } from "vuex"
	
	export default {
		name:"my-login",
		data() {
			return {
				
			};
		},
		methods: {
			// 获取微信用户的基本信息
			getUserInfo(e) {
				// 判断是否获取用户信息成功
				if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！')
				
				// 获取用户信息成功， e.detail.userInfo 就是用户的基本信息
				// console.log(e.detail)
				// 1.2 存储到本地
				this.updateUserInfo(e.detail.userInfo);
				
				// 获取登录成功后的 Token 字符串
				this.getToken(e.detail);
			},
			// 1.1, 2.1, 3.3 调用 mapMutations 辅助方法，把 m_user 模块中的 updateUserInfo 映射到当前组件中使用
			...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
			async getToken(info) {
				// g1. 调用微信登录接口
				const [err, res] = await uni.login().catch(err => err);
				// console.log(res, err)
				// g2. 判断是否 uni.login() 调用失败
				if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！');
				
				// g3. 准备参数对象
				const query = {
				    code: res.code,
				    encryptedData: info.encryptedData,
				    iv: info.iv,
				    rawData: info.rawData,
				    signature: info.signature
				}
				
				// g4. 换取 token; ...... 接口的登录报 404 了，这里使用常量代替
				// const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
				// console.log(loginResult)
				// if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
				// uni.$showMsg('登录成功')
				const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
				// 2.2 更新 vuex 中的 token
				this.updateToken(token)
			},
			// 返回登录之前的页面
			navigatorBack() {
				// 如果 redirectInfo 不为空，并且导航方式是 switchTab
				if(this.redirectInfo && this.redirectInfo.openType === "switchTab") {
					// 调用小程序提供的 uni.switchTab 方法，返回之前页面
					uni.switchTab({
						// 要导航到的页面地址
						url: this.redirectInfo.from,
						// 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
						complete: () => {
							this.updateRedirectInfo(null)
						}
					})
				}
			}
		},
		computed: {
			// 3.2 调用 mapState 辅助方法，把 m_user 模块中的 redirectInfo 数据映射到当前用组件中使用
			...mapState('m_user', ['redirectInfo']),
		}
	}
</script>

<style lang="scss">
	.login-container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		height: 750rpx;
		overflow: hidden;
		background-color: #f8f8f8;
		box-sizing: border-box;
		
		// 绘制登录盒子底部的半椭圆造型
		&::after {
			content: ' ';
			display: block;
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 40px;
			background-color: white;
			border-radius: 100%;
			transform: translateY(50%);
		}
		
		// 登录按钮
		.btn-login {
			margin: 40px 0 15px;
			width: 90%;
			border-radius: 100px;
			background-color: #D81E06;
		}
		
		// 按钮下的登录信息
		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>