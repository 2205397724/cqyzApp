<!--小区详细页-->
<template>
	<view>
		<view class="header">
			<headbar backgroundColor='linear-gradient(-90deg, #00b7bd, #00d5c0)' color="#ffffff"></headbar>
			<uni-row class="na-main p-tb-30 flex-row flex-center">
				<uni-col :span="24">
					<view class="font-white size-lxx strong">{{active_zone.name}}</view>
					<view class="font-white size-base p-t-10 opacity-80">
						<text v-for="(item,i) in active_zone.china">{{item}} {{i < active_zone.china.length-1 ? '>' : ''}} </text>
					</view>
				</uni-col>
				<!-- <uni-col :span="6" class="flex-row flex-end">
					<ber-route url="/pages/mine/house/house">
						<view class="btn-size-xs btn-white font-primary">我的房屋</view>
					</ber-route>
				</uni-col> -->
			</uni-row>
		</view>
		<view class="zones-body" style="padding-bottom: 40rpx;">
			<view class="zones-menu">
				<v-tabs v-model="currentTab" :tabs="list_status" @change="changeTab" field="val"></v-tabs>
			</view>
			<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<!--- 小区基础信息 -->
				<view class="zones-detail" v-if="currentTab==0">
					<view class="title">
						<view class="text">小区基础信息</view>
					</view>
					<view class="na-card bg-white p-30">
						<view class="row">
							<text class="label">小区坐落：</text>
							<text class="content">{{active_zone.addr}}</text>
						</view>
						<view class="row">
							<text class="label">总建筑面积：</text>
							<text class="content">{{active_zone.area_build}} 平方米</text>
						</view> 
						<view class="row">
							<text class="label">总业主数：</text>
							<text class="content">{{active_zone.cnt_live}} 户</text>
						</view>
						<view class="row">
							<text class="label">车位总面积：</text>
							<text class="content">{{active_zone.area_part}} 平方米</text>
						</view>
						<view class="row">
							<text class="label">楼栋数：</text>
							<text class="content">{{active_zone.cnt_building}} 栋</text>
						</view>
						<view class="row">
							<text class="label">住房总套数：</text>
							<text class="content">{{active_zone.cnt_live}} 户</text>
						</view>
						<view class="row">
							<text class="label">车位总数：</text>
							<text class="content">{{active_zone.cnt_part}}</text>
						</view>
						<view class="row">
							<text class="label">建设单位名称：</text>
							<text class="content">{{active_zone.company_build}}</text>
						</view>
						<view class="row">
							<text class="label">竣工时间：</text>
							<text class="content">{{active_zone.time_build_end}}</text>
						</view>
						<view class="row">
							<text class="label">投用时间：</text>
							<text class="content">{{active_zone.time_use}}</text>
						</view>
						<view class="row" v-if="active_zone.addition">
							<text class="label">简介：</text>
							<!-- <text class="content">{{active_zone.addition.desc}}</text> -->
                            <jyf-parser :html="active_zone.addition.desc" class="line-height-170" ref="article" :lazy-load="true" :use-anchor="true" show-with-animation :selectable="true">暂无内容...</jyf-parser>
						</view>
					</view>
				</view>
				<!--- 小区档案信息 -->
				<view class="zones-detail" v-if="currentTab==1">
					<view class="title">
						<view class="text">小区相关备案</view>
					</view>
					<view class="">
						<view class="na-steps-column" v-for="item in filing_list">
                            <view class="na-steps-column-item" @click.stop="showFilingDetail(item.id)">
                            	<view class="steps-item-time">
                            		{{item.created_at}}
                            	</view>
                            	<text class="steps-item-discription">
                            		<text>{{item.title}}</text>
                                    <text class="m-l-30">{{item.sno}}</text>
                            	</text>
                            	<view class="steps-item-content">
                            		<view class="na-files-box">
                            			<view class="files-item">
                                            <jyf-parser :html="item.desc" ref="article" :lazy-load="true" :use-anchor="true" show-with-animation :selectable="true">暂无内容</jyf-parser>
                            			</view>
                            		</view>
                                    <view class="na-photo-box" v-if="item.affix.length>=1">
                                        <!-- <block v-for="arr in item.affix">
                                            <block v-for="img in arr.key">
                                                <view class="photo-item">
                                                    <view class="photo-item-image" >
                                                        <image @click="clickFuncImgShow(arr.key,img)" :src="VITE_APP_FOLDER_SRC + img"></image>
                                                    </view>
                                                </view>
                                            </block>
                                        </block> -->
                                        <block v-for="img in item.affixs">
                                            <view class="photo-item">
                                                <view class="photo-item-image" >
                                                    <image @click.stop="clickFuncImgShow(item.affixs,img)" :src="img"></image>
                                                </view>
                                            </view>
                                        </block>
                                    </view>
                            	</view>
                            </view>
							<!-- <view class="na-steps-column-item">
								<view class="steps-item-time">
									2022-02-15
								</view>
								<text class="steps-item-discription">
									物业 经理：刘明文 备案 物业服务合同
								</text>
								<view class="steps-item-content">
									<view class="na-files-box">
										<view class="files-item">
											物业服务合同
										</view>
										<view class="files-item">
											物业服务范围
										</view>
									</view>
								</view>
							</view>
							<view class="na-steps-column-item active">
								<view class="steps-item-time">
									2022-01-24
								</view>
								<text class="steps-item-discription">
									街道 网格员：张珊珊 上传图片
								</text>
								<view class="steps-item-content">
									<view class="na-photo-box">
										<view class="photo-item">
											<view class="photo-item-image">
												<image src="/static/image/testimg.png"></image>
											</view>
										</view>
										<view class="photo-item">
											<view class="photo-item-image">
												<image src="/static/image/testimg.png"></image>
											</view>
										</view>
										<view class="photo-item">
											<view class="photo-item-image">
												<image src="/static/image/testimg.png"></image>
											</view>
										</view>
										<view class="photo-item">
											<view class="photo-item-image">
												<image src="/static/image/testimg.png"></image>
											</view>
										</view>
										<view class="photo-item">
											<view class="photo-item-image">
												<image src="/static/image/testimg.png"></image>
											</view>
										</view>
										<view class="photo-item">
											<view class="photo-item-image">
												<image src="/static/image/testimg.png"></image>
											</view>
										</view>
										<view class="photo-item">
											<view class="photo-item-image">
												<image src="/static/image/testimg.png"></image>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="na-steps-column-item danger">
								<view class="steps-item-time">
									2021-12-12
								</view>
								<text class="steps-item-discription">
									管理员：李菊 创建小区
								</text>
								<view class="steps-item-content">
									创建内容填写部分文字内容。
								</view>
							</view> -->
						</view>
					</view>
				</view>
				<!--- 小区房屋信息 -->
				<view class="zones-detail" v-if="currentTab==2">
					<view class="na-build-box">
						<view class="na-build-head">
							<view class="na-build-title">
								<text :class="{'on':active_build.id==item.id}" v-for="(item,i) in build_list" :key="item.id" @click="()=>{active_build=item;getFuncUnit();}">{{item.name}}</text>
							</view>
							<view class="na-build-title">
								<text :class="{'on':active_unit.id==item.id}" v-for="(item,i) in unit_list" :key="item.id" @click="()=>{active_unit=item;getFuncHouse()}">{{item.name}}</text>
							</view>
						</view>
						<!-- <view class="na-build-body">
							<view v-if="(house_data.houses&&house_data.houses.length<=0)&&unit_list.length>0" style="padding: 20rpx 0;">无房屋信息！</view>
							<view class="na-build-line" v-for="(item,i) in house_data.houses" :key="item.floor_truth">
								<view class="loucen">{{item.floor_truth}}层</view>
								<view class="house_line">
									<text @click="clickFuncOpenDetails(child)" v-for="(child,j) in item.houses" :key="child.id">{{child.house_num}}#</text>
								</view>
							</view>
						</view> -->
						<view class="na-build-body">
							<view v-if="(house_data.floors&&house_data.floors.length>0) ">
								<view class="na-build-line" v-for="(item,i) in house_data.floors" :key="item.floor_truth">
									<view class="loucen">{{item.floor_truth}}层</view>
									<view class="house_line">
										<text @click="clickFuncOpenDetails(child)" v-for="(child,j) in item.houses" :key="child.id">{{child.house_num}}号</text>
									</view>
								</view>
							</view>
							<view v-else class="font-grey p-tb-20 size-base">无房屋信息</view>
						</view>
					</view>
				</view>
				<!--- 小区设施设备信息 -->
				<view class="zones-detail" v-if="currentTab==3">
					<view class="na-list">
						<view v-for="item in device_list">
							<uni-row class="na-list-item na-card bg-white p-30 m-b-30" v-show="item.show">
								<uni-col :span="24">
									<view class="list-content" @tap="devicedetails(item.id)">
										<view class="h2 over-ellipsis">
											{{item.name}}
											<text class="na-tag1 m-l-10" v-if="item.status == 1">正常</text>
											<text class="na-tag2 m-l-10" v-else-if="item.status == 2">故障</text>
											<text class="na-tag2 m-l-10" v-else>维护中</text>
										</view>
										<view class="p-t-20 font-grey size-base">									
											<text class="">品牌：</text>
											<text class="font-darkgrey">{{item.brand}}</text>
											<text class="p-l-40">编号：</text>
											<text class="font-darkgrey">{{item.sno}}</text>
										</view>
									</view>
								</uni-col>
							</uni-row>
						</view>
					</view>
				</view>
			</mescroll-body>
		</view>
		<uni-popup ref="popup" type="bottom" >
			<view class="popup-box">
				<icon type="clear" size="24" @click="closePopup" style="position: fixed;right: 20rpx;top: 20rpx;"/>
				<view class="font-grey size-base p-tb-10">
					<text class="">房屋名称：</text>
					<text class="font-darkgrey">{{details.name}}</text>
				</view>
				<view class="font-grey size-base p-tb-10">
					<text class="">建筑面积：</text>
					<text class="font-darkgrey">{{details.area_build}}</text>
				</view>
				<view class="font-grey size-base p-tb-10">
					<text class="">房屋坐落：</text>
					<text class="font-darkgrey">{{details.addr}}</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	
	import {
		getZoneDetails,
		getBuilding,
		getUnit,
		getHouse,
		getHouseDetails,
		getDevice,
        getFilingList
	} from './service/api.js'
    import {VITE_APP_FOLDER_SRC} from '@/pages/framework/config/app.js'
    import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	export default {
        mixins: [MescrollMixin], // 使用mixin
		components: {},
		data() {
			return {
                VITE_APP_FOLDER_SRC:VITE_APP_FOLDER_SRC,
                // 下拉刷新的配置(可选, 绝大部分情况无需配置)
                downOption: {},
                // 上拉加载的配置(可选, 绝大部分情况无需配置)
                upOption: {
                	noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
                },
				currentTab: 0, // TAB选择项
				active_zone: '',
				build_list: [],
				unit_list:[],
				// 设备设施列表
				device_list:[],
				house_data:{},
				active_build:'',
				active_unit:'',
				details:'',
				list_status:[{
					key:1,
					val: '小区资料'
				},{
					key:2,
					val: '小区档案'
				},{
					key:3,
					val: '小区房屋'
				},{
					key:3,
					val: '设施设备'
				}],
				zone_id:'',
                filing_list:[],//备案列表
			}
		},
		onLoad(opt){
			this.zone_id = opt.id
            if(opt.currentTab) {
                this.currentTab = Number(opt.currentTab)
            }
		},
		methods:{
            // 预览图片
            clickFuncImgShow(arr,url){
            	uni.previewImage({
            		current:url,
            		urls: arr,
            	});
            },
            /* 上拉加载的回调*/
            upCallback(page) {
				//小区详细
				if(this.currentTab==0){
					this.getFuncZoneDetails()
				}
				if(this.currentTab == 1){
					getFilingList({zone_id:this.zone_id}).then(res=>{
                        this.filing_list = res.data
                        // 处理图片
                        for(let i in res.data){
							
                            this.filing_list[i].affixs = []
                            for(let j in res.data[i].affix){
								
                                for(let k in res.data[i].affix[j].key){
                                    this.filing_list[i].affixs.push(VITE_APP_FOLDER_SRC+res.data[i].affix[j].key[k])
                                }
                            }
                        }
                    })
				}
				if(this.currentTab == 2){
					this.chooseHouseFunc()
				}
				if(this.currentTab == 3){
					let data = {
						page: 1,
						per_page: 10,
						zone:this.zone_id
					}
					getDevice(data).then(res=>{
						this.device_list = res.data
						this.mescroll.endSuccess(res.data.length)
					})
				}
				this.mescroll.endSuccess(1)
            },
            // 下拉刷新回调
            downCallback() {
            	this.mescroll.resetUpScroll()
            },
			clickFuncOpenDetails(val){
                this.details = val
				this.$refs.popup.open()
			},
			closePopup(){
				this.$refs.popup.close()
			},
			// 加载小区房屋
			chooseHouseFunc(){
				this.getFuncBuilding()
			},
			// 获取楼栋
			getFuncBuilding(){
				let data = {
					page: 1,
					per_page: 500,
					zone_id: this.active_zone.id
				}
				getBuilding(data).then(res=>{
					// this.build_list = res.data.items
					this.build_list = res.data
					this.house_data =[]
					this.unit_list = []
					this.active_build = ''
					this.active_unit = ''
					if(this.build_list.length<=0){
						return false
					}
					this.active_build = this.build_list[0]
					this.getFuncUnit()
				})
			},
			// 获取单元
			getFuncUnit(){
				let data = {
					page: 1,
					per_page: 500,
					building_id: this.active_build.id
				}
				getUnit(data).then(res=>{
					// this.unit_list = res.data.items
					this.unit_list = res.data
					this.house_data = {}
					this.active_unit = ''
					if(this.unit_list.length<=0){
                        // 没有单元时，获取楼栋下的房屋
                        this.getFuncHouse()
						return false
					}
					this.active_unit = this.unit_list[0]
					this.getFuncHouse()
				})
			},
			// 获取房屋
			getFuncHouse(){
				let data = {
					page: 1,
					per_page: 50,
					houseable_type: this.active_unit?'units':'buildings',
					houseable_id: this.active_unit.id || this.active_build.id
				}
				getHouse(data).then(res=>{
					this.house_data = res.data
				})
				
			},
			// 获取小区详情
			getFuncZoneDetails(){
				getZoneDetails(this.zone_id).then(res=>{
					this.active_zone = res.data
				})
			},
			// Tab切换
			changeTab(index) {
				this.currentTab = index
				this.mescroll.resetUpScroll()
			},
			//设备详细
			devicedetails(id){
				this.utils.route('/pages/zones/device/device?id='+id)
			},
            showFilingDetail(id) {
                this.utils.route(`/pages/zones/filing/filing?id=${id}`)
            }
		}
	}
</script>
<style lang="scss" scoped>
	.header{
		position: relative;
		background:$uni-bg-color-gradient-a;
		padding-bottom:20rpx;
		border-radius:0 0 40rpx 40rpx ;
		z-index: 99;
	}
	.zones{
		padding:0rpx 5% 20rpx;
		position: relative;
		.title{
			font-size: $uni-font-size-lg-x;
			font-weight: 800;
			color: $uni-text-color-white;
		}
		.info{
			font-size: $uni-font-size-base;
			color: $uni-text-color-white;
			opacity: 0.7;
			padding:10rpx 0 20rpx;
		}
		.right-btn{
			font-size: $uni-font-size-sm;
			color:$uni-theme-primary;
			background:$uni-bg-color-white;
			padding:10rpx 20rpx;
			border-radius:$uni-border-radius-base;
			position:absolute;
			right:5%;
			top:20rpx;
		}
	}
	.zones-body{
		position:relative;
		z-index:90;
	}
	.zones-menu{
		display: flex;
		width: 100%;
		border-radius:0 0 40rpx 40rpx ;
		background-color:$uni-bg-color-white;
		position: relative;
		padding:70rpx 5% 30rpx;
		top: -40rpx;
		box-sizing: border-box;
		z-index:90;
	}
	.zones-detail{
		padding: 0 5%;
		.title{
			font-size: $uni-font-size-lg;
			font-weight: 800;
			padding-bottom: 20rpx;
		}
		.label{
			font-size: $uni-font-size-base;
			color: $uni-text-color-grey;
		}
		.content{
			font-size: $uni-font-size-base;
		}
		.row{
			padding: 10rpx;
		}
	}
	
	.popup-box{
		.popup-item{
			display: flex;
			margin-bottom: 10rpx;
			.popup-title{
				min-width: 180rpx;
				// width: 160rpx;
				box-sizing: border-box;
				padding: 0 10rpx;
				text-align: right;
			}
			.popup-content{
				
			}
		}
	}
</style>
