<template>
	<view>
		<web-view
				 v-if="webViewSrc.length"
				 :src="webViewSrc" 
				 @message="reciveMessage"
				 ></web-view> 
	</view>
</template>

<script>
	export default {
		name:"vaptcha",
		props:{
			vid:{
				type:String,
			},
			scene:{
				type:Number,
				default: 0
			},
			lang:{
				type:String,	
				default:'zh-CN'
			},
			area:{
				type:String,
				default:'auto'
			},
			url:{
				type:String,
			}
		},
		data() {
			return {
				webViewSrc: '',
			};
		},
		created() {
			if(this.vid !== ''){
				this.showWebView()
			}
		},
		mounted() {
		    // 接受子页面发来的信息
			// #ifdef APP-PLUS
			plus.globalEvent.addEventListener("message", this.reciveMessage)
			// #endif
			
			// #ifdef H5
		    window.addEventListener("message", this.reciveMessage)
			//#endif
		  },
		methods:{
			showWebView(){
				this.webViewSrc = this.url+'?vid='+this.vid+'&scene='+this.scene+'&lang='+this.lang+'&area='+this.area
			
			},
			reciveMessage(event) {
				console.log('回调成功')
				
				//#ifdef APP-PLUS
				if(event.detail.data){
					this.$emit('receive',Object.assign(...event.detail.data))
				}
				//#endif
				
				// #ifdef H5
				if (event.data && event.data.data && event.data.data.arg) {
					this.$emit('receive',event.data.data.arg)
			     }
				 //#endif
				 
				 
			},
		}
	}
</script>

<style>

</style>
