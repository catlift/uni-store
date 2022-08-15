import { mapGetters } from "vuex"

// 导出一个 mixin 对象
export default {
	computed: {
		...mapGetters('m_cart', ['total'])
	},
	onShow() {
		// 在页面刚展示的时候，设置数字徽标
		this.setBadge()
	},
	methods: {
		setBadge() {
			// 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
			uni.setTabBarBadge({
				index: 2, // 索引
				text: this.total + '', // text 的值必须是字符串,不能是数字 
			})
			// console.log(this.total)
		}
	},
	// 监听
	watch: {
		// handler 属性用来定义侦听器的 function 处理函数
		// 1. 监听 total 的值变化, total(newVal, oldVal)
		total(newVal) {
			// 设置 badge
			this.setBadge()
		}
	}
}