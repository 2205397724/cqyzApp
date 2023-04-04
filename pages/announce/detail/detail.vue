<template>
	<view class="bg-white">
		<headbar rightIcon="redo" @clickRight="clickRightFunc"></headbar>
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="na-main">
				<view class="h1">
					{{details.title}}
				</view>
				<view class="p-tb-20 flex-row flex-between flex-center">
					<view>
						<text class="na-tag1" v-if="details.cate">{{details.cate.name}}</text>
						<text class="na-tag1" v-if="details.proof">{{details.proof}}</text>
						<text class="na-tag2">{{getDays(details.start_at,details.end_at)}}</text>
					</view>
					<view>
						<ber-route :url="'/pages/page/readlog/readlog?id='+id" class="size-sm font-grey">阅读记录</ber-route>
					</view>
				</view>
				<!-- <uni-row class="p-tb-20">
					<uni-col :span="8" class="flex-column flex-center">
						<text class="font-primary size-lg">{{getFuncOptVal(opts_all.announce_list_status,details.status)}}</text>
						<text class="font-grey size-base">状态</text>
					</uni-col>
					<uni-col :span="8" class="flex-column flex-center">
						<text class="size-lg">天</text>
						<text class="font-grey size-base">公示期限</text>
					</uni-col>
					<uni-col :span="8" class="flex-column flex-center">
						<ber-route url="../../../page/readlog/readlog" class="size-lg bg-white">238</ber-route>
						<text class="font-grey size-base bg-white">阅读人数</text>
					</uni-col>
				</uni-row> -->
				<view class="na-card m-tb-20 p-30 bg-light-grey ">
					<uni-row class="line-height-170">
						<uni-col :span="6" class="font-grey size-base">公示开始：</uni-col>
						<uni-col :span="18" class="font-darkgrey size-base">{{details.start_at}}</uni-col>
					</uni-row>
					<uni-row class="line-height-170">
						<uni-col :span="6" class="font-grey size-base">公示结束：</uni-col>
						<uni-col :span="18" class="font-darkgrey size-base">{{details.end_at}}</uni-col>
					</uni-row>
					<uni-row class="line-height-170">
						<uni-col :span="6" class="font-grey size-base">发布时间：</uni-col>
						<uni-col :span="18" class="font-darkgrey size-base">{{details.created_at}}</uni-col>
					</uni-row>
					<uni-row class="line-height-170" v-if="details.authorgroup">
						<uni-col :span="6" class="font-grey size-base">发布主体：</uni-col>
						<uni-col :span="18" class="font-darkgrey size-base">{{details.authorgroup.name}}</uni-col>
					</uni-row>
					<uni-row class="line-height-170" v-if="details.uinfo">
						<uni-col :span="6" class="font-grey size-base">发 布 人：</uni-col>
						<uni-col :span="18" class="font-darkgrey size-base">{{details.uinfo.nickname || details.uinfo.username || '匿名用户'}}</uni-col>
					</uni-row>
				</view>
			</view>
			
			<view class="na-main na-box">
				<view class="na-title"><text class="text">公示内容</text></view>
				<view class="size-lg line-height-170 wrap">
					<jyf-parser :html="details.content" ref="article" :lazy-load="true" :use-anchor="true" show-with-animation :selectable="true">加载中...</jyf-parser>
				</view>
			</view>
			<view class="na-main na-box" v-if="details.custom && details.custom.length>0">
				<view class="na-title"><text class="text">其它内容</text></view>
				<view class="size-lg line-height-170 wrap">
					<view v-for="(cust,i) in details.custom" :key="i">
						<text class="font-darkgrey size-base">{{cust.label}}：</text>
						<text>{{cust.val}}</text>
					</view>
				</view>
			</view>
			<view class="na-main na-box" v-if="details.affixs&&details.affixs.length>0">
				<view class="na-title"><text class="text">相关附件</text></view>
				<view class="na-photo-box">
					<view class="photo-item" v-for="(img,i) in details.affix">
						<view class="photo-item-image">
							<image @click="clickFuncImgShow(details.affixs,img.file)" :src="img.file" mode="aspectFill"></image>
						</view>
						<view class="item-title">{{img.title}}</view>
					</view>
				</view>
			</view>
			<!-- <view class="na-main na-box">
				<view class="na-title"><text class="text">关联事件</text></view>
				<view class="na-list">
					<uni-row class="na-list-item">
						<uni-col :span="6">
							<view class="list-cate">业委选举</view>
						</uni-col>
						<uni-col :span="18">
							<view class="list-content">
								<view class="h2 over-ellipsis">福斯德广场成立第一届业主委员会</view>
								<view class="p-t-20">
									<text class="na-tag2">重要</text>
									<text class="na-tag1">进行中</text>
									<text class="font-grey size-sm">发布主体：业委会</text>
								</view>
							</view>
						</uni-col>
					</uni-row>
				</view>
			</view>
			<view class="na-main na-box">
				<view class="na-title"><text class="text">相关公示</text></view>
				<view class="na-list">
					<uni-row class="na-list-item m-b-30" v-for="(item,i) in an_list">
						<uni-col :span="24">
							<view class="list-content">
								<view class="h2 over-ellipsis">{{item.title}}</view>
								<view class="na-unread"></view>
								<view class="p-tb-20">
									<text class="na-tag2">重要</text>
									<text class="na-tag1"> </text>
								</view>
								<view class="list-info">
									<text>公示主体：</text>
									<text>公示时间：{{item.updated_at}}</text>
								</view>
							</view>
						</uni-col>
					</uni-row>
					<uni-row class="na-list-item m-b-30">
						<uni-col :span="24">
							<view class="list-content">
								<view class="h2 over-ellipsis">滨江一号C区7、8号楼排污主管网疏通整改使用物业专项维修资金公示</view>
								<view class="na-unread"></view>
								<view class="p-tb-20">
									<text class="na-tag2">重要</text>
									<text class="na-tag1">进行中</text>
								</view>
								<view class="list-info">
									<text>公示主体：业委会</text>
									<text>公示时间：2021-12-15</text>
								</view>
							</view>
						</uni-col>
					</uni-row>
				</view>
			</view> -->
			<view class="na-main na-box">
				<commentLists :aid="details.id"></commentLists>
			</view>
			<view class="na-bottom-tool bg-white">
				<commentToolbar ref="toolbar" :aid="details.id"></commentToolbar>
			</view>
			<scrollTop :scrollTop="scrollTop"></scrollTop>
		</mescroll-body>
	</view>
</template>

<script>
// // 配置项
import {VITE_APP_FOLDER_SRC,SHARE_BASE_URL,URL_LOGO} from '@/pages/framework/config/app.js'
import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
import appShare,{ closeShare } from '@/uni_modules/zhouWei-APPshare/js_sdk/appShare'
import {
	getDetails,
	getList
} from './service/api.js'
export default {
    mixins: [MescrollMixin], // 使用mixin
    data() {
        return {
			scrollTop:0,
            // 下拉刷新的配置(可选, 绝大部分情况无需配置)
            downOption: { },
            // 上拉加载的配置(可选, 绝大部分情况无需配置)
            upOption: {
                noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
            },
			content : "依据",
			id:'',
			details:{},
			opts_all:{
				'announce_list_status':[]
			},
			an_list:[],
			detailImgs:[],//内容图片
        }
    },
    onLoad(opts) {
		this.id = opts.id
		getOpts(['announce_list_status']).then(res => {
		    this.opts_all = res
		})
    },
	onPageScroll(e){
		this.scrollTop=e.scrollTop;
	},
    methods: {
		// 预览图片
		clickFuncImgShow(arr,url){
			uni.previewImage({
				current:url,
				urls: arr,
			});
		},
		// 相隔几天
		getDays(strDateStart, strDateEnd) {
			if(strDateStart&&strDateEnd){
				strDateStart = strDateStart.replace(/-/g,'/')
				strDateEnd = strDateEnd.replace(/-/g,'/')
				//return Math.ceil((new Date(strDateEnd).getTime() - new Date(strDateStart).getTime())/1000/60/60/24);
				if ( new Date(strDateStart).getTime() > Date.now() ){
					return '未开始'
				}else if(new Date(strDateStart).getTime() < Date.now() && new Date(strDateEnd).getTime() > Date.now()){
					return '公示中'
				}else{
					return '已结束'
				}
			}
			return '已结束'
		},
        /* 上拉加载的回调*/
        upCallback(page) {
            let data = {
            	page: page.num,
            	per_page: page.size,
            }
            getDetails(this.id).then(res=>{
				res.data.affixs = []
				for(let i in res.data.affix){
					res.data.affixs.push(VITE_APP_FOLDER_SRC+res.data.affix[i].file)
					res.data.affix[i].file = VITE_APP_FOLDER_SRC+res.data.affix[i].file 
				}
            	this.details = res.data
            	this.mescroll.endSuccess(1, 1);
				
				let imgarr = []
				let content = this.details.content
				content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function (match, capture) {
					imgarr.push(capture);//正则去掉g为第一个
				});
				if(imgarr.length==0) imgarr = this.details.affixs
				this.detailImgs = imgarr
            }).catch(err=>{
            	this.mescroll.endErr()
            })
        },
        // 下拉刷新回调
        downCallback() {
            this.mescroll.resetUpScroll()
        },
		clickRightFunc(){
			let params = {
				m : 'announce',
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

</style>
