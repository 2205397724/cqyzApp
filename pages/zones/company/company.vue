<!-- 小区物业企业 -->
<template>
	<view>
		<view class="na-header">
			<headbar backgroundColor='linear-gradient(-90deg, #00b7bd, #00d5c0)' color="#ffffff"></headbar>
			<uni-row class="na-main p-tb-30 flex-row flex-center">
				<uni-col :span="24">
					<view class="font-white size-lxx strong">物业</view>
					<view class="font-white size-base p-t-10 opacity-80">{{ zone_detail.name }}小区物业 </view>
				</uni-col>
				<!-- <uni-col :span="6" class="flex-row flex-end">
					<ber-route url="/pages/mine/house/house">
						<view class="btn-size-xs btn-white font-primary">我的房屋</view>
					</ber-route>
				</uni-col> -->
			</uni-row>
		</view>
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="na-main m-b-30" v-if="company.length<=0">
				<view class="na-card p-30 bg-white">
					<view class="flex-row flex-center flex-between">
						<text class="font-extra size-lg">小区暂无物业服务企业</text>
						<!-- <view class="btn-size-sm btn-extra">申请选聘</view> -->
                        <!-- <ber-route url="/pages/zones/change/change" class="btn-size-sm btn-extra">申请选聘</ber-route> -->
					</view>					
				</view>
			</view>
			<view class="na-main" v-else>
				<view class="na-card p-30 bg-white m-b-30" v-for="item in company">
					<!-- <view class="size-lg">重庆市那屋优物业服务管理有限公司</view> -->
					<view class="size-lg">{{item.name}}</view>
					<view class="p-t-10" v-for="element in item.filing">
						<!-- <view class="btn-size-xs btn-primary btn-circle">物业服务合同</view> -->
                        <view class="btn-size-xs btn-primary btn-circle" @click="showFilingDetail(item.id)">{{element.title}}</view>
					</view>
					<!-- <uni-row class="p-tb-30 m-tb-30 na-card bg-linear-orange2white">
						<uni-col :span="12" class="flex-column flex-center">
							<text class="size-lx strong font-extra">4</text>
							<text class="size-sm font-grey">服务等级</text>
						</uni-col>
						<uni-col :span="12" class="flex-column flex-center">
							<text class="size-lx strong font-primary">98.58</text>
							<text class="size-sm font-grey">信誉分</text>
						</uni-col>
					</uni-row> -->
					<view class="na-title-sm">服务人员</view>
					<view class="m-b-20">
						<view v-for="user in item.users">
							<view class="flex-row flex-center flex-between p-tb-10">
								<text class="size-base" style="width: 120rpx;">{{user.name||user.username}}</text>
								<text class="size-base font-grey">{{user.post}}</text>
								<view class="btn-size-xs btn-extra btn-circle">
									<safe-str style="width: auto;" size="38rpx" type="tel" :str="user.mobile" :show="true" :dial="true"></safe-str>
								</view>
							</view>
						</view>
					</view>
					<view class="na-title-sm m-t-30" v-if="item.ref != 'nil'">
						<text>公司简介</text>
						<text class="more" @tap="showCompanyDetails(item.detail)">查看详细</text>
					</view>
					<view class="line-height-170" v-if="item.detail">
						<view class="flex-row flex-start">
							<text class="size-sm font-grey">公司法人：</text>
							<text class="size-base font-darkgrey">{{item.detail.legal}}</text>
						</view>
						<view class="flex-row flex-start">
							<text class="size-sm font-grey">公司电话：</text>
							<text class="size-base font-darkgrey">
								{{item.detail.contact}}
							</text>
						</view>
						<view class="flex-row flex-start" v-if="item.extra" v-for="ext in item.detail.extra">
							<text class="size-sm font-grey">{{ext.lab}}：</text>
							<text class="size-base font-darkgrey">{{ext.val}}</text>
						</view>
					</view>
					<!-- <view class="na-title-sm m-t-30">
						<text>业主评价</text>
						<text class="more">查看更多</text>
					</view>
					<view class="p-30 m-b-30 na-card bg-linear-orange2white">
						<view class="flex-row flex-between">
							<text class="size-base font-extra">2月服务评分</text>
							<text class="size-lx strong font-extra">93.58</text>
						</view>
					</view>
					<view class="flex-row wrap">
						<text class="na-tag1 m-b-10">经常看到物业人员巡逻</text>
						<text class="na-tag1 m-b-10">楼长尽心尽力</text>
						<text class="na-tag2 m-b-10">很好</text>
						<text class="na-tag2 m-b-10">~给收费员点赞!</text>
					</view> -->
				</view>
			</view>
		</mescroll-body>
		<uni-popup ref="popup" type="bottom">
			<view class="popup-box line-height-170">
				<view class="size-base">
					<image class="badge-lgx" @click="clickFuncImgShow([company_logo],company_logo)" :src="company_logo" mode="aspectFill"></image>
				</view>
				<view class="size-base">
					<text class="size-sm font-grey">公司名称：</text>
					<text class="size-base font-darkgrey">{{company_detail.name}}</text>
				</view>
				<view class="size-base">
					<text class="size-sm font-grey">社会信用代码：</text>
					<text class="size-base font-darkgrey">{{company_detail.social_code}}</text>
				</view>
				<view class="flex-row flex-start">
					<text class="size-sm font-grey">公司法人：</text>
					<text class="size-base font-darkgrey">{{company_detail.legal}}</text>
				</view>
				<view class="flex-row flex-start">
					<text class="size-sm font-grey">公司电话：</text>
					<text class="size-base font-darkgrey">
						{{company_detail.contact}}
					</text>
				</view>
				<view class="flex-row flex-start" v-if="company_detail.extra" v-for="ext in company_detail.extra">
					<text class="size-sm font-grey">{{ext.lab}}：</text>
					<text class="size-base font-darkgrey">{{ext.val}}</text>
				</view>
				<view class="flex-column flex-start">
					<text class="size-sm font-grey">公司简介：</text>
					<view class="size-base font-darkgrey">
					<mp-html :content="company_detail.desc"/>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { VITE_APP_FOLDER_SRC } from '@/pages/framework/config/app.js'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	import {
		getGroupList,
		getGroupDetail,
		getGroupMember,
		getCompanyDetail,
        getFilingList,
	} from './service/api.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				// 下拉刷新的配置(可选, 绝大部分情况无需配置)
				downOption: { },
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
					noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				},
				zone_detail:'',
				group_id:'',//用户组id
				company:[],//公司
				company_member:[],//公司成员
				company_detail:{},
				VITE_APP_FOLDER_SRC:VITE_APP_FOLDER_SRC,
				company_logo:''
			}
		},
		onLoad(opts) {
			this.zone_detail = JSON.parse(decodeURIComponent(opts.opt))
		},
		methods: {
			/* 上拉加载的回调*/
			upCallback(page) {
                this.getCompany()
				this.mescroll.endSuccess(1)
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			},
			getCompany() {
				let data = {
					type:7,
					active:1,
                    region_type:2,
					region_cc:this.zone_detail.china_code,
                    region_val:this.zone_detail.id,
				}
				let _this = this
				getGroupList(data).then(res=>{
					let company = res.data
                    console.log("company",company);
					company.forEach((e,i) => {
                        // console.log("e",e,i);
						//拉取关联公司
						if(e.ref && e.ref != 'nil'){
							getCompanyDetail(e.ref).then(ref=>{
								company[i].detail = ref.data
                                // console.log("company[i].detail",company[i].detail);
							})
						}
                        // 拉取物业公司备案
                        let data1 = {
                            zone_id:this.zone_detail.id,
                            group_id:e.id
                        }
                        getFilingList(data1).then(res2=>{
                            // console.log("res2",res2.data);
                            company[i].filing = res2.data
                        })
						//拉取公司员工
						getGroupMember(e.id).then(user=>{
							company[i].users = user.data
							_this.company = company//本来应放外层，但只能放在这里，才能正确获取到值
						})
					})
				})
			},
			showCompanyDetails(detail){
				this.company_detail = detail
				this.company_logo = VITE_APP_FOLDER_SRC+detail.logo
				this.$refs.popup.open()
			},
			// 预览图片
			clickFuncImgShow(arr,url){
				uni.previewImage({
					current:url,
					urls: arr,
				});
			},
            showFilingDetail(id) {
                this.utils.route(`/pages/zones/filing/filing?id=${id}`)
            }
		}
	}
</script>

<style lang="scss" scoped>
	.popup-box{
		max-height:60vh;
		min-height:20vh;
		overflow-y: auto;
	}
</style>
