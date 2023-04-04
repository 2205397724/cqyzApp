<template>
	<view  class="bg-white">
		<headbar></headbar>
		<view class="content na-main">
			<view class="na-title">
				<text class="text">所有评论</text> <text class="more">共 {{total}} 条</text>
			</view>
			<view class="comment" style="padding-bottom: 54px;">
				<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
					<commentItem :aid="aid" :list="list" @refreshFn="downCallback"></commentItem>
				</mescroll-body>
			</view>
			<!-- <commentToolbar :allow="allow" :show_total="2" :token="token" :cate="cate" :cid="id" :total="comments_total"></commentToolbar> -->
			<commentToolbar ref="toolbar" :aid="aid" @refreshFn="downCallback" :hideicon="true"></commentToolbar>
		</view>
	</view>
</template>

<script>

	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	import {
		getList
	} from './service/api.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				downOption: { },
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
				    noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				},
				aid:'',
				list:'',
				total:0
			}
		},

		onLoad(opts) {
			this.aid = opts.opt

		},
		methods: {
			/* 上拉加载的回调*/
			upCallback(page) {
				let data = {
					page: page.num,
					per_page: page.size,
					status:20,
					tgtid:this.aid
				}
				if(page.num==1){
					this.list = []
				}
				// getList(this.aid,data).then(res=>{
				// 	this.total = res.data.aggregation.total_cnt
				// 	// this.list = this.list.concat(res.data.items)
				// 	// this.mescroll.endByPage(res.data.items.length, res.data.aggregation.total_cnt);
				// 	this.list = this.list.concat(res.data)
				// 	this.mescroll.endByPage(res.data.length, res.data.aggregation.total_cnt);
				// }).catch(err=>{
				// 	this.mescroll.endErr()
				// })
				getList(data).then(res=>{
					this.total = res.data.length
					// this.list = this.list.concat(res.data.items)
					// this.mescroll.endByPage(res.data.items.length, res.data.aggregation.total_cnt);
					this.list = this.list.concat(res.data)
					this.mescroll.endByPage(res.data.length, res.data.aggregation.total_cnt);
				}).catch(err=>{
					this.mescroll.endErr()
				})
			},
			// 下拉刷新回调
			downCallback() {
			    this.mescroll.resetUpScroll()
				if(this.$refs.toolbar.getFnList){
					this.$refs.toolbar.getFnList()
				}
			},
		},
	}
</script>

<style lang="scss">
	.comment-title{
		font-size:28upx;
	}
	.comment-bd_none{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40upx 0upx;
	}
	.empty-icon{
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
	.comment-toolbar_mask{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 998;
	}
	.comment-toolbar_wrap{
		position: fixed;
		left: 0upx;
		bottom: 0upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 94%;
		padding: 16upx 3% 16upx 3%;
		background: $uni-bg-color-white;
		border-top: 1upx solid #F9F9F9;
		z-index: 999;
	}
	.comment-toolbar_input{
		display: flex;
		flex-direction: row;
		flex: 1;
		background: #F2F2F2;
		border-radius: 30upx;
		padding: 16upx 26upx;
		font-size: 32upx;
		line-height: 40upx;
		font-weight: normal;
	}
	.comment-toolbar_placeholder{
		display: flex;
		flex-direction: row;
		font-size: 32upx;
		line-height: 34upx;
		font-weight: normal;
	}
	.comment-toolbar_send{
		margin-left: 18upx;
	}
	.comment-toolbar_comments{
		position: relative;
		margin-left: 18upx;
	}
	.comment-toolbar_comments-img{
		display: block;
		width: 50upx;
		height: 50upx;
	}
	.comment-toolbar_comments-badge{
		position: absolute;
		top: -8rpx;
		right: -20rpx;
		display: inline-block;
		min-width: 20rpx;
		padding: 6rpx 8rpx;
		font-size: 24rpx;
		font-weight: 500;
		line-height: 1;
		color: #ffffff;
		text-align: center;
		white-space: nowrap;
		vertical-align: middle;
		background-color: #12C4D0;
		border-radius: 20rpx;
	}
</style>
