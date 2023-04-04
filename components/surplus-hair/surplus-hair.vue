<template>
	<view class="surplus-hair" :class="{'is-fixed':isFixed}" :style="{'height':iStatusBarHeight+'px','background-color':bg}"></view>
</template>

<script>
	export default {
		props: {
			isFixed:{
				type: Boolean,
				default: false
			},
			bg:{
				type: String,
				default: ''
			}
		},
		data() {
			return {
				iStatusBarHeight: 0
			}
		},
		mounted() {
			let _this = this;
			_this.$set(_this,'iStatusBarHeight',uni.getSystemInfoSync().statusBarHeight);
		},
		methods: {
		}
	}
</script>

<style lang="scss">
	.is-fixed{
		position: fixed;
		left: 0;
		top: 0;
		z-index: 10000;
		width: 100%;
	}
</style>
