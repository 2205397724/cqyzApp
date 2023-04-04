import themeDefault from '@/mixin/theme/default.js'
import themeDark from '@/mixin/theme/dark.js'
const themeMixin = {
	data() {
		return {
			themeStr: '',
		};
	},
	created() {
		this.setStyle(themeDefault)
	},
	methods: {
		setStyle(styles){
			let _this = this;
			let style = styles.map((item, index) => {
				return `${item.name}:${item.value}`
			}).join(';')
			_this.themeStr = style + ';'
		}
	},
};
export default themeMixin;
