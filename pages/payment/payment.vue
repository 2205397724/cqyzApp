<!-- 小区违建-->
<template>
	<view>
		<view class="na-header announce-head">
			<headbar title="账单" backgroundColor='linear-gradient(-90deg, #00b7bd, #00d5c0)' color="#ffffff"></headbar>
			<uni-row class="na-main">
				<uni-col>
					<view class="na-header-title center">
						<text class="info">2022年07月</text>
					</view>
				</uni-col>
				<uni-col>
					<view class="na-header-title center">
						<text class="title">118.85</text>
					</view>
				</uni-col>
			</uni-row>
			<view class="na-main">
				<view class="na-header-tool-1">
					<uni-row class="announce-task">
						<uni-col :span="6">
							<text class="font-primary strong size-lg">所有议事</text>
						</uni-col>
						<uni-col :span="6">
							<text class="font-primary strong size-lg">阿斯达</text>
						</uni-col>
					</uni-row>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
    data() {
        return {
			
        }
    },
    onLoad() {
		
    },
    methods: {
        /* 上拉加载的回调*/
        upCallback(page) {
            
        },
        // 下拉刷新回调
        downCallback() {
			
        },
		changeTab() {
			
		},
		add(){
			
		},
		getFuncOptVal(arr,key){
			
		}
    }
}
</script>

<style lang="scss" scoped>
.center {
	text-align: center;
}
.title {
	margin: 40rpx 0;
	font-size: 100px;
}
</style>
