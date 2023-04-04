<template>
	<view class="bg-white">
		<headbar rightIcon="redo"  @clickRight="clickRightFunc"></headbar>
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback"
			@up="upCallback">
			<view class="na-main">
				<view class="h1">
					{{detail.title}}
				</view>
				<view class="p-tb-20 flex-row flex-between flex-center">
					<view>
						<text class="na-tag1" v-if="cate_detail">{{cate_detail.name}}</text>
						<!-- <text class="na-tag1" v-if="details.proof">{{details.proof}}</text>
						<text class="na-tag2">{{getDays(details.start_at,details.end_at)}}</text> -->
					</view>
					<!-- <view class="flex-row">
						<uni-icons type="auth" size="18"></uni-icons>
					    <ber-route :url="'/pages/page/readlog/readlog?id='+id" class="size-sm font-grey">阅读记录</ber-route>
					</view> -->
				</view>
				<view class="font-grey size-sm p-b-40">
					<text class="p-r-30" v-if="author_detail" >{{author_detail.username || author_detail.nickname}}</text>
					<text>更新时间：{{detail.updated_at}}</text>
				</view>
			</view>
			<view class="na-main na-box">
				<view class="size-lg line-height-180 wrap">
					<jyf-parser :html="detail.content" ref="article" :lazy-load="true" :use-anchor="true"
						show-with-animation :selectable="true">加载中...</jyf-parser>
				</view>
			</view>
			<view class="na-main na-box">
				<view class="na-title"><text class="text">相关附件</text></view>
				<view class="na-photo-box">
					<view class="photo-item" v-for="(src,i) in detail.affixs" :key="i">
						<view class="photo-item-image">
							<image @click="clickFuncImgShow(detail.affixs,src)" :src="src"
								mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>
			<scrollTop :scrollTop="scrollTop"></scrollTop>
		</mescroll-body>
	</view>
</template>

<script>
	// // 配置项
	import {
		VITE_APP_FOLDER_SRC,SHARE_BASE_URL,URL_LOGO
	} from '@/pages/framework/config/app.js'
	import {
		getOpts,
		getOptVal
	} from '@/pages/framework/utils/opts/opts.js'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	import appShare,{ closeShare } from '@/uni_modules/zhouWei-APPshare/js_sdk/appShare'
	import {
		getNewsDetail,
		getZoneDetail
	} from './service/api.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				scrollTop:0,
				VITE_APP_FOLDER_SRC:VITE_APP_FOLDER_SRC,
				// 下拉刷新的配置(可选, 绝大部分情况无需配置)
				downOption: {},
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
					noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				},
				id: '',
				detail: {},
				opts_all: {
					'announce_list_status': []
				},
				author_detail: {},
				cate_detail: {},
				zone_name: "", //详情小区名称
				detailImgs:[],//内容图片
			}
		},
		onLoad(opts) {
			this.id = opts.id
		},
		onPageScroll(e){ 
			this.scrollTop=e.scrollTop;
		},
		methods: {
			//小区IDto名称
			zone_id_to_name(id) {

			},
			// 预览图片
			clickFuncImgShow(arr, url) {
				uni.previewImage({
					current: url,
					urls: arr,
				});
			},
			// 相隔几天
			getDays(strDateStart, strDateEnd) {
				if (strDateStart && strDateEnd) {
					strDateStart = strDateStart.replace(/-/g, '/')
					strDateEnd = strDateEnd.replace(/-/g, '/')
					//return Math.ceil((new Date(strDateEnd).getTime() - new Date(strDateStart).getTime())/1000/60/60/24);
					if (new Date(strDateStart).getTime() > Date.now()) {
						return '未开始'
					} else if (new Date(strDateStart).getTime() < Date.now() && new Date(strDateEnd).getTime() > Date
						.now()) {
						return '公示中'
					} else {
						return '已结束'
					}
				}
				return '已结束'
			},
			/* 上拉加载的回调*/
			upCallback(page) {
				getNewsDetail(this.id).then(res => {
                    this.detail = res.data
                    this.author_detail = res.data.author
                    this.cate_detail = res.data.cate
					res.data.affixs = []
					for (let i in res.data.affix) {
						res.data.affixs.push(VITE_APP_FOLDER_SRC+res.data.affix[i].file)
					}
					this.detail = res.data
					let imgarr = []
					let content = this.detail.content
					content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function (match, capture) {
						imgarr.push(capture);//正则去掉g为第一个
					});
					if(imgarr.length==0) imgarr = this.detail.affixs
					this.detailImgs = imgarr
					this.mescroll.endSuccess(1)
				}).catch(err => {
					this.mescroll.endErr()
				})
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			},
			clickRightFunc(){
				let params = {
					m : 'news',
					cc : this.utils.getUserCity().china_code,
					id : this.detail.id
				}
				let shareData = {
					shareUrl:SHARE_BASE_URL + this.utils.urlParams(params),
					shareTitle:this.detail.title,
					shareContent:'给您分享'+this.detail.title+'赶紧看看吧！',
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

</style>
