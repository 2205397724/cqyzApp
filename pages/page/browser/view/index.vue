<template>
    <view>
		<surplus-hair></surplus-hair>
        <web-view v-if="networkStat != 'none'" :webview-styles="webviewStyles" :src="src" />
        <view v-else style="text-align: center;">
            请检查网络!
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            src: null,
            networkStat: 'none',
            webviewStyles: {
                progress: {
                    color: '#12C4D0'
                }
            }
        }
    },
    onLoad(options) {
        // 获取网络状态
		uni.getNetworkType({
			success: (res) => {
				this.$nextTick(()=>{
					this.networkStat = res.networkType
				})
			}
		});
        this.src = JSON.parse(decodeURIComponent(options.url) )
    },
    methods: {
			
    }
}
</script>

<style>

</style>
