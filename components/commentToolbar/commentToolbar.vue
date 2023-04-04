<template>
	<view>
		<view class="comment-toolbar">
			<view class="comment-toolbar_wrap">
				<textarea ref="comtext" class="comment-toolbar_input" :disabled="disabled" :value="content"
					:placeholder="disabled ? '评论已关闭' : '我来说两句'" placeholder-class="comment-toolbar_placeholder"
					cursor-spacing="8" auto-height
					@input="(res)=>{
						content = res.detail.value
					}"/>
				<button v-if="!disabled" class="comment-toolbar_send comment-toolbar-mybtn" type="primary" size="mini" :disabled="disabled||!content"
					@click="submitFn">发布</button>
				<ber-route :url="`/pages/page/comments/comments?opt=${aid}`" class="comment-toolbar_comments" v-if="!hideicon">
					<image class="comment-toolbar_comments-img" src="/static/icon/comments@2x.png"></image>
					<!-- <view class="comment-toolbar_comments-badge">
						{{total}}
					</view> -->
				</ber-route>
			</view>
		</view>
	</view>
</template>

<script>
	// import api from '@/common/api'
	// import utils from '@/common/utils'

	import {
		getList,
		postComment,
		getCommentCfg
	} from './service/api.js'
	export default {
		name: 'commentToolbar',
		props: ['aid','hideicon'],
		watch: {
			aid: {
				handler(new_val) {
					if(new_val){
						this.getFnList()
						getCommentCfg(new_val).then(res=>{
							this.disabled = true
							if (JSON.stringify(res.data)!=='{}') {
							    this.disabled = false
							}
						})
					}
				},
				immediate: true,
				deep: true
			}
		},
		data() {
			return {
				total: 0,
				content: '',
				disabled: true
			};
		},
		methods: {
			getFnList() {
				let data = {
					page: 1,
					per_page: 10,
					status:20,
					tgtid:this.aid
				}
				// getList(data).then(res => {
				// 	this.total = res.data.length
				// })
			},
			submitFn() {
				let data = {
					content: this.content
				}
				postComment(this.aid, data).then(res => {
					uni.showToast({
						icon:'none',
						title:'评论成功'
					})
					setTimeout(()=>{
						this.content = ''
						this.getFnList()
						this.$emit('refreshFn','')
					},1000)
				})
			}
			// // 评论框内容
			// textareaInput(event){
			// 	this.content = event.detail.value;
			// 	this.contentHuman = event.detail.value;
			// },
			// // 输入框获得焦点
			// textareaFocus(event){
			// 	this.isFocus = true;
			// },
			// // 输入框失去焦点
			// closeMask(){
			// 	this.isFocus = false;
			// },
			// // 输入框失去焦点
			// textareaBlur(event){
			// 	this.isFocus = false;
			// },
			// // 查看所有评论
			// showAllComments(){
			// 	uni.navigateTo({
			// 		url: "/pages/comments/comments?cate=" + this.cate + "&id=" + this.cid + "&scene=" + this.scene + "&allow=" + + this.allow,
			// 	})
			// },
			// // 发布评论
			// commentAdd(){
			// 	let that = this;
			// 	let data = {content: this.content};
			// 	uni.showLoading();
			// 	console.log(this.scene);
			// 	console.log(data);
			// 	if(this.scene == 1){ // 发布普通评论
			// 		this.utils.requestPost(api.comment_add + '/' + this.cate + '/' +this.cid, this.token, data)
			// 			.then((res)=>{
			// 				that.content = ''; // 清空文字
			// 				that.contentHuman = ''; // 清空文字
			// 				if(res.code == -9){
			// 					uni.hideLoading();
			// 					uni.showToast({
			// 						icon: 'success',
			// 						title: '评论成功 等待审核'
			// 					})
			// 				}
			// 			})
			// 			.catch((e)=>{
			// 				console.log(e);
			// 			})
			// 	}else if(this.scene == 2){ // 发布扩展阅读评论
			// 		this.utils.requestPost(api.ecomment_add + '/' + this.cate + '/' +this.cid, this.token, data)
			// 			.then((res)=>{
			// 				that.content = ''; // 清空文字
			// 				that.contentHuman = ''; // 清空文字
			// 				if(res.code == -9){
			// 					uni.hideLoading();
			// 					uni.showToast({
			// 						icon: 'success',
			// 						title: '评论成功 等待审核'
			// 					})
			// 				}
			// 			})
			// 			.catch((e)=>{
			// 				console.log(e);
			// 			})
			// 	}
			// },
		},
	}
</script>

<style lang="scss">
	.comment-toolbar {
		display: flex;
		flex-direction: column;
		background: $uni-bg-color-white;
		z-index: 990;
		width: 100%;
	}

	.comment-toolbar_wrap {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 94%;
		padding: 16upx 3% 16upx 3%;
		background: $uni-bg-color-white;
		border-top: 1upx solid #F9F9F9;
	}

	.comment-toolbar_input {
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

	.comment-toolbar_placeholder {
		display: flex;
		flex-direction: row;
		font-size: 32upx;
		line-height: 40upx;
		font-weight: normal;
	}

	.comment-toolbar_send {
		margin: 12upx 0upx 0upx 18upx;
	}
	.comment-toolbar-mybtn{
		margin: 0 0 0 18rpx;
		height: 72rpx;
		color: #ffffff!important;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.comment-toolbar_comments {
		position: relative;
		margin-left:18upx;
	}

	.comment-toolbar_comments-emoji {
		margin: 12upx 0upx 0upx 18upx;
		display: inline-block;
		width: 50upx;
		height: 50upx;
	}

	.comment-toolbar_comments-img {
		display: block;
		width:60rpx;
		height:60rpx;
	}

	.comment-toolbar_comments-badge {
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

	.emotions-wrap {}

	.emotions-panel {
		padding: 12upx 2%;
	}

	.emotions-item {}

	.emotions-item {
		display: inline-block;
		width: 48upx;
		height: 48upx;
		padding: 4upx 8upx;
	}
</style>
