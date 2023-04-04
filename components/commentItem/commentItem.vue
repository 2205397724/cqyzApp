<template>
	<view>
		<view class="comment-item" v-for="(item,i) in list">
			<image class="comment-item_avatar" :src="getavatar(item.uavatar)" mode="aspectFill"></image>
			<!-- <image style="background-color: #eeeeee;" :src="item.uavatar" class="comment-item_avatar"></image> -->
			<view class="comment-item_con">
				<view class="comment-item_hd">
					<view class="flex-row flex-center">
						<text class="font-darkgrey size-base">{{item.uname || '注册用户'}}</text>
						<text class="font-grey size-xs p-l-20">{{item.loc}}</text>
					</view>
					<view class="comment-like" >
						<text class="comment-like_text" :class="item.zaned ? 'comment-liked_text':''" @click="dianzan(item)">{{item.zan}}</text>
						<view v-if="!disabled" class="comment-like" @click="()=>{
							huifu=item
							content = ''
							$refs.popup1.open()
						}">
							<uni-icons type="chat" size="24" color="#999999"></uni-icons>
							<!-- <text class="comment-like_text">回复</text> -->
						</view>
					</view>
				</view>
				<view class="">
					<span class="p-t-10 font-primary size-base" v-if="item.atuid">@ {{item.atuname}}</span>
					<rich-text class="comment-item_bd-text p-t-10 p-b-20" :nodes="item.content"></rich-text>
				</view>
				<view class="comment-item_ft">
					<text class="comment-item_time">{{item.created_at}}</text>
				</view>
				<view class="comment-reply" v-if="item.reply.length>0">
					<view class="comment-reply_item" v-for="(re,e) in item.reply">
						<view class="comment-reply_content">
							<view class="comment-reply_title">								
								<text class="comment-reply_nickname">{{re.uname || '注册用户'}} </text>
								<text class="comment-reply_time"> {{re.created_at}} 回复：</text>
							</view>
							<rich-text class="comment-reply_text" :nodes="re.content"></rich-text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup1" type="bottom" >
			<view style="display: flex;justify-content: space-between;margin-bottom: 20rpx;">
				<view @click="$refs.popup1.close()">取消</view>
				<view class="btn-size-sm btn-primary" @click="submitFn">发布</view>
			</view>
			<uni-easyinput style="background-color: #f2f2f2;border-radius: 12rpx;padding: 20rpx;box-sizing: border-box;" :inputBorder="false" placeholder-class="comment-toolbar_placeholder" class="comment-toolbar_input" type="textarea"   autoHeight v-model="content" :placeholder="`回复 ${huifu.uname}`"></uni-easyinput>
		</uni-popup>
	</view>
</template>

<script>
	// import api from '@/common/api'
	// import utils from '@/common/utils'
	import {VITE_APP_FOLDER_SRC,URL_LOGO} from '@/pages/framework/config/app.js'
	import {
		postComment,
		getComment,
		postCommentZan,
		delCommentZan
	} from './service/api.js'
	export default {
		name: 'commentItem',
        props: ['aid', 'list'],
		watch:{
			aid: {
				handler(new_val) {
					if(new_val){
						getComment(new_val).then(res=>{
							this.disabled = true
							if (res.data) {
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
				huifu:'',
				content:'',
				disabled:true,
				VITE_APP_FOLDER_SRC:VITE_APP_FOLDER_SRC,
			};
		},
		methods: {
			// 点赞
			dianzan(item){
				if(item.zaned){
					delCommentZan(item.id).then(res => {
						item.zan -=1
						item.zaned = false
						uni.showToast({
							icon:'none',
							title:'已取消'
						})
					})
				}else{
					postCommentZan(item.id).then(res => {
						item.zan +=1
						item.zaned = true
						uni.showToast({
							icon:'none',
							title:'已赞'
						})
					})
				}
			},
			submitFn(){
				let data = {
					content: this.content,
					atuid:this.huifu.uid,
					atutype:this.huifu.utype,
					tagid:this.huifu.id
				}
				if(!this.content){
					uni.showToast({
						icon:'none',
						title:'回复内容不能为空！'
					})
					return false
				}
				postComment(this.aid, data).then(res => {
					uni.showToast({
						icon:'none',
						title:'操作成功'
					})
					setTimeout(()=>{
						this.$refs.popup1.close()
						this.$emit('refreshFn','')
					},1000)
				})
			},
			getavatar(avatar){
				return avatar ? VITE_APP_FOLDER_SRC+uavatar : URL_LOGO
			},
			// 普通评论点赞
			iLike(cid, id, event){
				// this.comments_list.forEach((item)=>{
				// 	if(item.id == id){
				// 		if(!item.lock){
				// 			item.lock = true;
				// 			item.support = parseInt(item.support) + 1;
				// 			this.utils.requestPost(api.comment_support + '/' + this.cate + '/' + cid + '/rid/' + id, this.token)
				// 				.then((res)=>{
				// 					console.log(res);
				// 				})
				// 				.catch((e)=>{
				// 					console.log('error:' + e);
				// 				})
				// 		}
				// 	}
				// })
			},
			// 扩展阅读评论点赞
			ieLike(cid, id, event){
				// this.comments_list.forEach((item)=>{
				// 	if(item.id == id){
				// 		if(!item.lock){
				// 			item.lock = true;
				// 			item.support = parseInt(item.support) + 1;
				// 			this.utils.requestPost(api.ecomment_support + '/' + this.cate + '/' + cid + '/rid/' + id, this.token)
				// 				.then((res)=>{
				// 					console.log(res);
				// 				})
				// 				.catch((e)=>{
				// 					console.log('error:' + e);
				// 				})
				// 		}
				// 	}
				// })
			},
		},
	}
</script>
<style lang="scss" scoped>
	::v-deep .uni-popup{
		z-index: 999;
	}
</style>
<style lang="scss">
	.comment-item{
		display: flex;
		flex-direction: row;
		padding: 24upx 0;
	}
	.comment-item_avatar{
		display: block;
		width: 60upx;
		height: 60upx;
		border-radius: 30upx;
		border: 1upx solid #F5F5F5;
	}
	.comment-item_con{
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-left: 12upx;
	}
	.comment-item_hd{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.comment-user_nickname{
		display: flex;
		flex-direction: row;
		font-size: 30upx;
		line-height: 32upx;
		font-weight: normal;
		color: #666666;
	}
	.comment-like{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}
	
	.comment-like_text{
		display: flex;
		flex-direction: row;
		font-size: 30upx;
		line-height: 40upx;
		font-weight: normal;
		color: $uni-text-color-grey;
		background-image: url('@/static/icon/like@2x.png');
		padding-right: 46upx;
		background-size: 36upx 36upx;
		background-position: right center;
		background-repeat: no-repeat;
		margin-right: 20upx;
	}
	.comment-liked_text{
		color: $uni-theme-primary;
		background-image: url('@/static/icon/liked@2x.png');
	}
	.comment-item_bd{
		margin: 12upx 0upx 10upx 0upx;
	}
	.comment-item_bd-text{
		display: flex;
		flex-direction: row;
		font-size: 32upx;
		line-height:150%;
		font-weight: normal;
		color: #333333;
	}
	.comment-item_ft{
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.comment-item_time{
		display: flex;
		flex-direction: row;
		font-size: 24upx;
		line-height: 26upx;
		font-weight: normal;
		color: #999999;
	}
	.comment-reply{
		position: relative;
		display: flex;
		flex-direction: column;
		margin-top: 24upx;
		padding:20upx 30upx;
		background: #ffffdf;
		border-radius: 20upx;
	}
	.comment-reply::before{
		display: block;
		content: '';
		position: absolute;
		top: -28upx;
		left: 20upx;
		width: 0upx;
		height: 0upx;
		border-style: solid;
		border-width: 15upx;
		border-color: transparent transparent #ffffdf transparent;
	}
	.comment-reply_item{
		display: flex;
		flex-direction: row;
		padding: 12upx 0upx;
	}
	.comment-reply_content{
		display: flex;
		flex-direction: column;
	}
	.comment-reply_title{
		display: flex;
		flex-direction: row;
		align-items:center;
		font-size: $uni-font-size-base;
		line-height: 100%;
		padding-bottom:20upx;
	}
	.comment-reply_nickname{
		display: flex;
		flex-direction: row;
		color: #ffaa00;
		padding-right: 20upx;
	}
	.comment-reply_time{
		display: flex;
		flex-direction: row;
		color: #999999;
	}
	.comment-reply_text{
		display: flex;
		flex-direction: row;
		font-size:32upx;
		font-weight: normal;
		color: #333333;
		line-height: 150%;
	}
</style>
