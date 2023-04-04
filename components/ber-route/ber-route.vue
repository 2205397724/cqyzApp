<template>
	<view @click="goto">
		<slot></slot>
	</view>
</template>

<script>
		
	export default {
		props:['url'],
		data() {
			return {
				
			}
		},
		methods: {
			goto(){
				this.utils.route(this.url)
			}
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
