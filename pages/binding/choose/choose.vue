<template>
	<view class="content">
		<view class="na-header-white">
			<headbar rightText="申请记录" @clickRight="clickRight"></headbar>
			<view class="na-main p-t-30 flex-row flex-center flex-between">
				<view class="size-base strong">1、选择绑定房屋</view>
				<view class="">
					<ber-route url="/pages/mine/house/house">
						<view class="btn-size-xs btn-primary">我的房屋</view>
					</ber-route>
				</view>
			</view>
		</view>
		<view class="na-main">
			<scroll-view class="titbox" scroll-x="true" :scroll-into-view="scroll_into_view_crumbs">
				<view :id="'scroll-into-view-crumbs'+i" v-for="(item,i) in crumbs" :key="item.value" class="regionitem"
					@click="clickFuncCrumbs(i,item)">{{ item.text }}</view>
			</scroll-view>
		</view>
		<view class="scrollboxy" v-if="switch_region">
			<view v-for="(item,i) in region_list" :key="item.code" class="scrollyitem"
				@click="clickFuncRegion(item)">{{ item.name }}</view>
			<view v-if="region_list&&region_list.length<=0" class="font-grey size-base">
				无小区信息！
			</view>
		</view>
		<view v-else class="na-build-box na-main p-tb-20">
			<view class="na-build-head">
				<view class="na-build-title">
					<text :class="{'on':active_build==item.value}" v-for="(item,i) in build_list" :key="item.value"
						@click="()=>{active_build=item.value;getFuncUnit();}">{{item.text}}</text>
				</view>
				<view class="na-build-title">
					<text :class="{'on':active_unit==item.value}" v-for="(item,i) in unit_list" :key="item.value"
						@click="()=>{active_unit=item.value;getFuncHouse();}">{{item.text}}</text>
				</view>
			</view>
			<view v-if="house_list&&house_list.length>0" class="na-build-body">
				<view class="na-build-line" v-for="(item,i) in house_list" :key="item.value">
					<view class="loucen">{{item.floor_truth}}层</view>
					<view class="house_line">
						<text :class="{'on':active_house.id==child.id}" v-for="(child,j) in item.houses"
							:key="child.id" @click="clickFuncHouse(child)">{{child.house_num}}#</text>
					</view>
				</view>
			</view>
			<view v-else-if="!active_build" class="font-grey size-base">
				无楼栋信息！
			</view>
			<view v-else class="font-grey size-base">
				无房屋信息！
			</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view style="font-size: 28rpx;color: #999999;">您已选择：</view>
			<view class="title" style="padding: 20rpx 0;">{{ active_house.pos_name ||'' }}{{ active_house.name }}</view>
			<view @click="clickFuncAdd">
				<button type="primary">绑定</button>
			</view>
		</uni-popup>
		<uni-popup ref="popmember" type="bottom">
			<view>房屋成员：</view>
			<view>123456</view>
		</uni-popup>
	</view>
</template>

<script>
	
	// // 配置项
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
	import {
		getCity,
		getZone,
		getBuilding,
		getUnit,
		getHouse
	} from './service/api.js'
	import Cache from '@/pages/framework/utils/cache/cache.js'
	import {
		USER_INFO
	} from '@/pages/framework/config/cache.js'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixinK
		data() {
			return {
				downOption: {},
				upOption: {
					page: {
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 1, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				},
				user_city: '',
				scroll_into_view_crumbs: '',
				crumbs: [],
				region_list: [],
				build_list: [],
				unit_list: [],
				house_list: [],
				active_build: '',
				active_unit: '',
				active_house: {},
				switch_region: true,
				opts_all:{},
			}
		},
		computed: {

		},
		onLoad(options) {
			getOpts(['house_status_plan_fact','status_all']).then(res => {
			    this.opts_all = res
			})
			this.user_city = this.utils.getUserCity()
			this.refreshFunc()
		},
		onShow(){
			
		},
		methods: {
			// 上拉加载的回调
			upCallback(page) {
				
			},
			clickFuncAdd(){
				this.$refs.popup.close()
				this.utils.route(`/pages/binding/bind/bind?opt=${encodeURIComponent(JSON.stringify({zone:this.active_house}))}`)
			},
			// 导航右点击
			clickRight(){
				this.utils.route('/pages/binding/history/history')
			},
			// 点击房屋
			clickFuncHouse(obj) {
				this.active_house = obj
				this.$refs.popup.open()
			},
			// 点击面包屑
			clickFuncCrumbs(i, obj) {
				if (obj.next == 'region') {
					i++
					this.crumbs.splice(i, 99)
					this.getFuncCity(obj.value)
					this.switch_region = true
					return false
				}
				if (obj.next == 'zone') {
					i++
					this.crumbs.splice(i, 99)
					this.getFuncZone(obj.value)
					this.switch_region = true
					return false
				}
			},
			// 点击区域
			clickFuncRegion(obj) {
				this.crumbs.push(obj)
				this.scroll_into_view_crumbs = ''
				setTimeout(() => {
					this.scroll_into_view_crumbs = `scroll-into-view-crumbs${this.crumbs.length-1}`
				}, 100)
				if (obj.next == 'region') {
					this.getFuncCity(obj.value)
					return false
				}
				if (obj.next == 'zone') {
					this.getFuncZone(obj.value)
					return false
				}
				if (obj.next == 'buildings') {
					this.active_build = ''
					this.active_unit = ''
					this.unit_list = []
					this.switch_region = false
					this.getFuncBuilding(obj.value)
					return false
				}
			},
			// 获取房屋
			getFuncHouse() {
				this.active_house = {}
				let data = {}
				if (this.active_build) {
					data.houseable_type = 'buildings'
					data.houseable_id = this.active_build
				}
				if (this.active_unit) {
					data.houseable_type = 'units'
					data.houseable_id = this.active_unit
				}
				getHouse(data).then(res => {
					// let items = res.data.houses
					let items = res.data.floors
					for (let i in items) {
						items[i].type = 'house'
						items[i].next = 'none'
					}
					this.house_list = items
				})
			},
			// 获取单元
			getFuncUnit() {
				getUnit({
					page: 1,
					per_page: 500,
					building_id: this.active_build
				}).then(res => {
					// let items = res.data.items
					let items = res.data
					for (let i in items) {
						items[i].type = 'units'
						items[i].next = 'house'
						items[i].text = items[i].name
						items[i].value = items[i].id
					}
					this.unit_list = items
					if (items.length <= 0) {
						this.active_unit = ''
					} else {
						this.active_unit = items[0].value
					}
					this.getFuncHouse()
				})
			},
			// 获取楼栋
			getFuncBuilding(zone_id) {
				getBuilding({
					page: 1,
					per_page: 500,
					zone_id: zone_id
				}).then(res => {
					// let items = res.data.items
					let items = res.data
					for (let i in items) {
						items[i].type = 'buildings'
						items[i].next = 'units'
						items[i].text = items[i].name
						items[i].value = items[i].id
					}
					this.build_list = items
					if (items.length <= 0) {
						this.active_build = ''
						this.active_unit = ''
						this.house_list = []
					} else {
						this.active_build = items[0].value
						this.getFuncUnit()
					}
				})
			},
			// 获取小区
			getFuncZone(code) {
				getZone({
					page: 1,
					per_page: 500,
					china_code: code
				}).then(res => {
					// let items = res.data.items
					let items = res.data
					for (let i in items) {
						items[i].type = 'zone'
						items[i].next = 'buildings'
						items[i].text = items[i].name
						items[i].value = items[i].id
					}
					this.region_list = items
				})
			},
			//获取区域
			getFuncCity(code) {
				getCity(code).then(res => {
					for (let i in res.data) {
						res.data[i].type = 'region'
						res.data[i].next = 'region'
						res.data[i].text = res.data[i].name
						res.data[i].value = res.data[i].code
						if (res.data[i].level >= 5) {
							res.data[i].next = 'zone'
						}
					}
					this.region_list = res.data
				})
			},
			// 初始化
			refreshFunc() {
				this.crumbs = []
				this.region_list = []
				this.build_list = []
				this.unit_list = []
				this.house_list = []
				this.active_build = ''
				this.active_unit = ''
				this.active_house = {}
				this.switch_region = true
				let data ={
					text: '全部',
					value: '',
					type: 'region',
					next: 'region'
				}
				if(Object.keys(this.user_city).length !==0){
					data.text = this.user_city.name
					data.value = this.user_city.china_code
				}
				this.clickFuncRegion(data)
				if(this.mescroll){
					this.mescroll.resetUpScroll()
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.contents {
		padding-bottom: 70upx;
	}
	.titbox {
		white-space: nowrap;
		box-sizing: border-box;
		padding-bottom: 20rpx;
		border-bottom: 2rpx solid #eeeeee;
		margin-bottom: 8rpx;
		color: #999999;

		.regionitem {
			font-size: 24rpx;
			display: inline-block;
			white-space: nowrap;
		}

		.regionitem::after {
			content: '/';
			display: inline-block;
			padding: 0 20rpx;
			font-size: 32rpx;
		}

		.regionitem:last-child::after {
			display: none;
		}
	}

	.scrollboxy {
		display: flex;
		flex-wrap: wrap;
		padding:20rpx;
		.scrollyitem {
			width: auto;
			padding: 20rpx 30rpx;
			border: 1px solid rgba(0, 0, 0, 0.1);
			background-color: #FFFFFF;
			margin: 15rpx;
			border-radius: 8rpx;
			line-height: 100%;
		}
	}
</style>
