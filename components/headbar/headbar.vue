<template>
	<uni-nav-bar
		:color="color" 
		:title="title" 
		:leftText="leftText" 
		:rightText="rightText" 
		:leftIcon="leftIcon||'left'" 
		:rightIcon="rightIcon" 
		:backgroundColor="backgroundColor" 
		:fixed="fixed" 
		:statusBar="statusBar||true" 
		:shadow="shadow" 
		:border="border||false" 
		:height="height" 
		:dark="dark" 
		:leftWidth="leftWidth" 
		:rightWidth="rightWidth" 
		@clickLeft="clickLeft"
		@clickRight="clickRight"
		>
		
	</uni-nav-bar>
</template>

<script>
	export default {
		name: "headbar",
		props: ['color', 'title', 'leftText', 'rightText', 'leftIcon', 'rightIcon', 'backgroundColor', 'fixed',
			'statusBar', 'shadow', 'border', 'height', 'dark', 'leftWidth', 'rightWidth'
		],
		data() {
			return {

			};
		},
		methods: {
			clickLeft(){
				this.$emit('clickLeft','')
				uni.navigateBack()
			},
			clickRight(){
				this.$emit('clickRight','')
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
