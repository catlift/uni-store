<template>
	<view class="address">
		<!-- "选择收货地址"的按钮盒子 -->
		<view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
			<!-- chooseAddress： 选择地址的事件处理函数 -->
			<button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
		</view>
		
		<!-- 渲染收货地址信息 -->
		<view class="address-info-box" @click="chooseAddress" v-else>
			<view class="row1">
				<view class="row1-left">
					<view class="username">收货人：<text>{{address.userName}}</text></view>
				</view>
				<view class="row1-right">
					<view class="phone">电话：<text>{{address.telNumber}}</text></view>
					<uni-icons type="arrowright" size="16"></uni-icons>
				</view>
			</view>
			
			<view class="row2">
				<view class="row2-left">收货地址：</view>
				<view class="row2-right">{{addstr}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 1.1 导入 用户收货信息地址的 vue 模块
	import { mapState, mapMutations, mapGetters } from "vuex"
	
	export default {
		name:"my-address",
		data() {
			return {
				// 1.1 取消声明，使用映射进来的 address
				// 存储收货地址信息
				// address: {},
				// 倒计时
				seconds: 3,
				// 定时器的 Id
				timer: null
			};
		},
		onLoad() {
			// console.log(this.address)
		},
		methods: {
			async chooseAddress() {
				// 如果没有登录，提示登录
				if(!this.token) return this.delayNavigate()
				// c1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
				//    返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
				const [err, succ] = await uni.chooseAddress().catch(err => err)
				// console.log(succ) // undefined ???
				// c2. 用户成功的选择了收货地址
				if (err === null && succ.errMsg === 'chooseAddress:ok') {
					// 2.2 改用 updateAddress 存储数据 
					// 为 data 里面的收货地址对象赋值
					// this.address = succ
					// 更新 vuex 的收货信息
					this.updateAddress(succ)
				}
				
				// c3. 用户没有授权
				// 模拟器和安卓真机上，错误消息 err.errMsg 的值为 chooseAddress:fail auth deny
				// iPhone 真机上，错误消息 err.errMsg 的值为 chooseAddress:fail authorize no response
				if (err && (err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg === 'chooseAddress:fail authorize no response' ) ) {
					// 调用 this.reAuth() 方法，向用户重新发起授权申请
				    this.reAuth();
				  }

			},
			// 2.1 把 m_user 模块中的 updateAddress 函数映射到当前组件
			...mapMutations('m_user', ['updateAddress']),
			// 调用此方法，重新发起收货地址的授权
			async reAuth() {
				// 3.1 提示用户对地址进行授权
				const [err2, confirmResult] = await uni.showModal({
					content: '检测到您没打开地址权限，是否去设置打开？',
					confirmText: "确认",
					cancelText: "取消",
				})
				
				// 3.2 如果弹框异常，则直接退出
				if (err2) return
				
				// 3.3 如果用户点击了 “取消” 按钮，则提示用户 “您取消了地址授权！”
				if (confirmResult.cancel) return uni.$showMsg('您取消了地址授权！');
				
				// 3.4 如果用户点击了 “确认” 按钮，则调用 uni.openSetting() 方法进入授权页面，让用户重新进行授权
				if (confirmResult.confirm) return uni.openSetting({
					// 3.4.1 授权结束，需要对授权的结果做进一步判断
					success: (settingResult) => {
						// 3.4.2 地址授权的值等于 true，提示用户 “授权成功”
						if (settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功！请选择地址')
						// 3.4.3 地址授权的值等于 false，提示用户 “您取消了地址授权”
						if (!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权！')
				    }
				})
				
			},
			// 展示倒计时的提示消息
			showTips(n) {
			  // 调用 uni.showToast() 方法，展示提示消息
			  uni.showToast({
			    // 不展示任何图标
			    icon: 'none',
			    // 提示的消息
			    title: '请登录后再选择收货地址！' + n + ' 秒后自动跳转到登录页',
			    // 为页面添加透明遮罩，防止点击穿透
			    mask: true,
			    // 1.5 秒后自动消失
			    duration: 1500
			  })
			},
			// 延迟导航到 my 页面
			delayNavigate() {
				// 每次调用 this.seconds 重置一下，避免 第 2、3...n 次执行时 this.seconds 的秒数是 0
				this.seconds = 3;
				// 延迟展示消息
				this.showTips(this.seconds);
				
				// 创建定时器，每隔 1 秒刷新 showtips 的展示消息
				this.timer = setInterval(() => {
					this.seconds -= 1;
					
					// tt1. 判断倒计时秒数
					if(this.seconds <= 0) {
						// tt2. 清除定时器
						clearInterval(this.timer);
						
						// tt3. 跳转页面
						uni.switchTab({
							url: "/pages/my/my",
							// 页面跳转成功后的回调函数
							success: () => {
								// 调用 user.js 的 vuex 里面 updateRedirectInfo 方法，存储信息到 Store 中
								this.updateRedirectInfo({
									// 跳转方式
									openType: 'switchTab',
									// 从哪个页面跳转过去的
									from: "/pages/cart/cart"
								})
							}
						})
						// tt4. 阻止后面的 showTips 方法执行
						return;
					}
					
					this.showTips(this.seconds);
				}, 1000);
			},
			// 把 m_user 模块中的 updateRedirectInfo 方法映射到当前页面中使用
			...mapMutations('m_user', ['updateRedirectInfo'])
		},
		computed: {
			// 1.2 把 m_user 模块中的 address 对象映射当前组件中使用，代替 data 中 address 对象
			...mapState('m_user', ['address', 'token']),
			// 收货详细地址的计算属性，该方法常用，抽离到 user.js 的 getters 节点，并映射到 computed 这里
			// addstr() {}
			...mapGetters('m_user', ['addstr'])
		}
	}
</script>

<style lang="scss">
	.address {
		border-bottom: 1px solid #efefef;
		
		.address-choose-box {
			height: 90px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
		.address-info-box {
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 0 5px;
			height: 90px;
			font-size: 12px;
			
			.row1 {
				display: flex;
				justify-content: space-between;
				
				.row1-right {
					display: flex;
					align-items: center;
					
					.phone {
						margin-right: 5px;
					}
				}
			}
			
			.row2 {
				display: flex;
				align-items: center;
				margin-top: 10px;
				
				.row2-left {
					white-space: nowrap;
				}
			}
		}
	}
</style>