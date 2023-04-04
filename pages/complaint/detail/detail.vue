<template>
	<view style="padding-bottom: 100rpx;">
		<headbar fixed title="物业投诉" rightIcon="redo" @clickRight="clickRightFunc"></headbar>
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="na-header-white">
				<view class="na-main p-t-30">
					<view class="size-lx strong">{{details.title}}</view>
					<view class="flex-row p-tb-20 size-sm" style="flex-wrap: wrap;padding-bottom: 0;">
						<view>
							<text class="font-grey p-r-10">状态</text>
							<text :class="details.status === 0 ? 'na-tag2' :'na-tag1'" >{{getFuncOptVal(opts_all.complaint_status,details.status)}}</text>
						</view>
						<view class="m-r-20">
							<text class="font-grey  p-r-10">编号</text>
							<text class="font-grey">{{details.sno}}</text>
						</view>
						<view>
							<ber-route :url="'/pages/page/readlog/readlog?id='+details.id" class="size-sm font-grey">阅读记录</ber-route>
						</view>
					</view>
				</view>
			</view>
			<!-- 诉求信息 -->
			<view class="na-main">
				<view class="na-title p-t-10">
					<text class="text">诉求信息</text>
				</view>
				<view class="na-card p-30 bg-white">
					<view class="line-height-170">
						<view class="flex-row flex-start" v-if="details.uinfo">
							<text class="size-sm font-grey">诉求人：</text>
							<text class="size-base font-darkgrey">{{details.ano?'匿名业主':(details.uinfo.nickname || '匿名业主')}}</text>
						</view>
						<!-- <view class="flex-row flex-start">
							<text class="size-sm font-grey">诉求人电话：</text>
							<text class="size-base font-darkgrey">{{details.uinfo&&details.uinfo.mobile}}</text>
						</view> -->
						<view class="flex-row flex-start">
							<text class="size-sm font-grey">发起时间：</text>
							<text class="size-base font-darkgrey">{{details.created_at}}</text>
						</view>
						<view class="flex-column">
							<view class="size-sm font-grey">诉求内容：</view>
							<view class="size-lg p-tb-20">
								<mp-html :content="details.content"></mp-html>
							</view>
						</view>
						<view class="flex-column" v-if="details.affixs&&details.affixs.length>0">
							<view class="size-sm font-grey">相关附件：</view>
							<view class="flex-block">
								<view class="na-photo-box">
									<view class="photo-item" v-for="(src,i) in details.affixs">
										<view class="photo-item-image">
											<image @click="clickFuncImgShow(details.affixs,src)" :src="src" mode="aspectFill"></image>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>				
				</view>
			</view>
			<!-- 跟踪日志 -->
			<view class="na-main">
				<view class="na-title">
					<text class="text">处理跟踪日志</text>
				</view>
				<view v-if="details.totlogs&&details.totlogs.length>0">
				<view class="na-steps-column">
					<view class="na-steps-column-item" v-for="(item,i) in details.totlogs" :key="item.id">
						<view class="steps-item-time">
							{{item.created_at}}
						</view>
						<view class="size-base font-grey">
							<text class="p-r-20">{{item.uinfo.nickname || item.uinfo.username}}</text>
							<text>{{item.content}}</text>
						</view>
						<view v-if="item.logable.content">
							<view class="size-lg line-height-170 p-tb-10">
								{{item.logable.content}}
							</view>
						</view>
						<view v-if="item.content=='已转办'">
							<view class="size-base font-grey">转办到：{{getFuncOptVal(opts_all.toushu_return_type,item.logable.type)}}</view>
						</view>
						<view class="flex-column p-t-10" v-if="item.logable.affixs&&item.logable.affixs.length>0">
							<view class="size-base font-grey p-b-10">相关附件：</view>
							<view class="flex-block">
								<view class="na-photo-box">
									<view class="photo-item" v-for="(src,j) in item.logable.affixs">
										<view class="photo-item-image">
											<image @click="clickFuncImgShow(item.logable.affixs,src)" :src="src" mode="aspectFill"></image>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				</view>
				<view v-else class="na-card p-30 m-b-30 bg-white">
					<view class="p-20 font-grey size-lg">暂无处理记录</view>
				</view>
			</view>
			<!-- 热门评论 -->
			<view class="na-main">
				<commentLists :aid="details.id"></commentLists>
			</view>
		</mescroll-body>
		<!--处理后-->
		<view class="na-bottom-tool bg-white">
			<view v-if="details.uid == user_info.id">
				<view class="p-tb-20 p-lr-30 flex-row" v-if="details.status>6 && details.status<99">
					<!-- <view class="btn-primary btn-size-sm btn-block m-r-10" @tap="clicktype('score')">评分</view> -->
					<view class="btn-primary btn-size-base btn-block" @tap="clicktype('complaintplus')">追问</view>
				</view>
			</view>
			<commentToolbar ref="toolbar" :aid="details.id"></commentToolbar>
		</view>
		<!-- ====================弹窗部分===================== -->
		<!-- 办结后追问 -->
		<uni-popup ref="complaintplus" type="bottom">
			<view>
				<view class="font-darkgrey size-base">
					<view>
						<uni-forms ref="form">
							<uni-forms-item label="追问内容" label-position="top" label-align="left" label-width="auto" >
								<view class="bg-light-grey border-radius-base " style="padding: 4px 15px;">
									<uni-easyinput v-model="formData.content" :inputBorder="false" autoHeight :maxlength="255" type="textarea" placeholder="请输入最多255字..."/>
								</view>
							</uni-forms-item>
							<uni-forms-item label="附件内容" label-position="top" label-align="left">
								<uni-file-picker @select="(val)=>{
									formData.affix = formData.affix.concat(val.tempFiles) 
								}" @delete="deleteFileFunc" limit="9" :auto-upload="false" ></uni-file-picker>
							</uni-forms-item>
						</uni-forms>
					</view>
				</view>
				<view class="p-t-20">
					<button type="primary" @click="submit">提交</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {VITE_APP_FOLDER_SRC,SHARE_BASE_URL,URL_LOGO} from '@/pages/framework/config/app.js'
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
	import appShare,{ closeShare } from '@/uni_modules/zhouWei-APPshare/js_sdk/appShare'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	import {
		getDetails,
		postComplaintPlus
	} from './service/api.js'
	import GetFilesKey from '@/pages/framework/utils/file/file.js'
	import {COMPLAINT} from '@/pages/framework/config/folder.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				VITE_APP_FOLDER_SRC:VITE_APP_FOLDER_SRC,
				// 下拉刷新的配置(可选, 绝大部分情况无需配置)
				downOption: { },
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
					noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				},
				details:'',
				id:'',
				opts_all:{
					'complaint_status':[]
				},
				// 内容
				content:'',
				formData:{
					affix:[]
				},
				detailImgs:[],//内容图片
			}
		},
		onLoad(opts) {
			this.id = opts.id
			getOpts(['complaint_status','toushu_return_type','illegal_status']).then(res => {
				this.opts_all = res
			})
			this.user_info = this.utils.getUser()
		},
		methods: {
			// 预览图片
			clickFuncImgShow(arr,url){
				uni.previewImage({
					current:url,
					urls: arr,
				});
			},
			/* 上拉加载的回调*/
			upCallback(page) {
				getDetails(this.id).then(res=>{
					this.content = res.data.content
					res.data.affixs = []
					for(let i in res.data.affix){
						res.data.affixs.push(VITE_APP_FOLDER_SRC+res.data.affix[i])
					}
					for(let i in res.data.totlogs){
						res.data.totlogs[i].logable.affixs = []
						for(let j in res.data.totlogs[i].logable.affix){
							res.data.totlogs[i].logable.affixs.push(VITE_APP_FOLDER_SRC+res.data.totlogs[i].logable.affix[j])
						}
					}
					this.details =res.data
					this.mescroll.endSuccess(1)
					let imgarr = []
					let content = this.details.content
					content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function (match, capture) {
						imgarr.push(capture);//正则去掉g为第一个
					});
					if(imgarr.length==0) imgarr = this.details.affixs
					this.detailImgs = imgarr
				})
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			},
			clicktype(type){
				if(type == 'complaintplus'){
					this.$refs.complaintplus.open()
				}
			},
			getFuncOptVal(arr,key){
				return getOptVal(arr,key)
			},
			deleteFileFunc(val){
				for(let i in this.formData.affix){
					if(this.formData.affix[i].url == val.tempFile.url){
						this.formData.affix.splice(i,1)
						return false
					}
				}
			},
			backFunc(){
				postComplaintPlus(this.id,this.formData).then(res=>{
					uni.showToast({
						icon:'none',
						title:"追问成功"
					})
					setTimeout(()=>{
						uni.navigateBack()
					},1000)
				})
			},
			submit(){
				// console.log(this.formData)
				if(this.formData.affix.length>0){
					let arr = []
					for(let j in this.formData.affix){
						arr.push(this.formData.affix[j].url)
					}
					GetFilesKey(COMPLAINT,arr).then(res=>{
						this.formData.affix = res
						this.backFunc()
					})
				}else{
					this.backFunc()
				}
			},
			clickRightFunc(){
				let params = {
					m : 'complaint',
					cc : this.utils.getUserCity().china_code,
					id : this.details.id
				}
				let shareData = {
					shareUrl:SHARE_BASE_URL + this.utils.urlParams(params),
					shareTitle:this.details.title,
					shareContent:'给您分享'+this.details.title+'赶紧看看吧！',
					shareImg: this.detailImgs[0] ? this.detailImgs[0] : URL_LOGO,
					appId : "", // 默认不传type的时候，必须传appId和appPath才会显示小程序图标
					appPath : "",
					appWebUrl : "",
				};
				// 调用
				let shareObj = appShare(shareData,res => {
					closeShare();
				});
				setTimeout(() => {
					shareObj.close();
				},5000);
			}
		}
	}
</script>

<style lang="scss" scoped>
	// 边框颜色
	.select::before{
		border-color: $uni-theme-secondary;
	}
	// 圆点颜色
	.select .na-steps-column-item::before {
		background-color:$uni-theme-secondary;
	}
	// 文本颜色高光
	.select .steps-item-discription{
		color: $uni-theme-secondary;
	}
	
</style>
