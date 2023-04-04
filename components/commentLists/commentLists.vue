<template>
	<view>
		<view class="comment">
			<view class="page-title-sm pl_5 pr_5 flex-row " style="justify-content: space-between;" >
				<view class="na-title"><text class="text">热门评论</text></view>
				<view class="page-title-sm-more" >
					<!-- <text @tap="showAllComments()">更多</text> -->
				</view>
			</view>
			<view class="comment-bd" v-if="list.length>0">
				<commentItem :aid="aid" :list="list" @refreshFn="refreshFn"></commentItem>
				<view class="comment-bd_more">
					<ber-route :url="`/pages/page/comments/comments?opt=${aid}`" class="font-primary size-base">查看更多精彩评论</ber-route :url="">
				</view>
			</view>
			<view class="comment-bd_none" v-else>
				<image class="comment-bd_none-img" src="/static/icon/comment_none@2x.png"></image>
				<text class="comment-bd_none-text">暂无评论</text>
			</view>
		</view>
	</view>
</template>

<script>
	// import api from '@/common/api'
	// import utils from '@/common/utils'
	// import commentItem from '@/components/commentItem.vue'
	import {
		getList
	} from './service/api.js'
	export default {
		name: 'commentLists',
		props: ['aid'],
		watch:{
			aid: {
				handler(new_val) {
					if(new_val){
						this.getFnlist()
					}
				},
				immediate: true,
				deep: true
			}
		},
		data(){
			return {
				list:[]
			}
		},
		methods: {
			refreshFn(){
				this.getFnlist()
				this.$emit('refreshFn','')
			},
			getFnlist(){
				let data = {
					page:1,
					per_page:3,
					status:20,
					tgtid:this.aid
				}
				getList(data).then(res=>{
					this.list = res.data
				})
			},
			// 查看所有评论
			showAllComments(){
				uni.navigateTo({
					url: `/pages/page/comments/comments?opt=${this.aid}`
				})
			},
		}
	}
</script>

<style lang="scss">
	.comment{
		margin: 60upx 0upx 0upx 0upx;
	}
	.comment-bd_none{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40upx 0upx 60upx 0upx;
	}
	.comment-bd_none-img{
		width: 180upx;
		height: 140upx;
	}
	.comment-bd_none-text{
		display: flex;
		flex-direction: row;
		margin: 12upx 0upx 0upx 0upx;
		font-size: 28upx;
		line-height: 30upx;
		font-weight: normal;
		color: #999999;
	}
	.comment-bd_more{
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin: 24upx 0upx 24upx 0upx;
	}
	.comment-bd_more-text{
		display: flex;
		flex-direction: row;
		padding: 4upx 8upx;
		font-size: 30upx;
		line-height: 34upx;
		font-weight: normal;
		color: #007AFF;
	}
</style>
