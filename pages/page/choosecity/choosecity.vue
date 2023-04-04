<template>
	<view class="bg-white">
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<headbar></headbar>
			<view class="na-main">
				<view class="na-title" style="height: 120rpx;">
					<text class="text">当前定位</text>
					<view class="font-primary size-base" style="display: flex;align-items: center;" @click="getLocationFunc">
						<!-- <uni-icons class="aniloop" type="loop" size="21" color="#00a292"></uni-icons> -->
						<icon v-if="loading" class="aniloop" type="download" size="20" color="#00a292"/>
						<uni-icons v-else type="paperplane" size="20" color="#00a292"></uni-icons>
						<text style="padding: 0 0 0 10rpx;">重新定位</text>
					</view>
				</view>
				<view class="wrap flex-row">
					<text v-if="!loading&&!auto_city" class="btn-size-sm bg-light-grey m-r-20 m-b-20" style="color:#aaaaaa;}">定位失败</text>
					<text v-else-if="!loading" class="btn-size-sm bg-light-green font-primary m-r-20 m-b-20" @click="clickFuncChooseCity(auto_city)">{{auto_city.name}}</text>
					<text v-else-if="loading" class="btn-size-sm bg-light-grey m-r-20 m-b-20"  style="color:#aaaaaa;">定位中...</text>
				</view>
				<view class="na-title">
					<text class="text">热门城市</text>
				</view>
				<view class="wrap flex-row">
					<text @click="clickFuncChooseCity(item)" class="btn-size-sm bg-light-grey m-r-20 m-b-20" :class="{'bg-light-green font-primary' : active_city.china_code == item.china_code}" v-for="(item,i) in city_list" :key="item.id">{{item.name}}</text>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	
	import {getCity} from './service/api.js'
	import Cache from '@/pages/framework/utils/cache/cache.js'
	import {
		REGION
	} from '@/pages/framework/config/cache.js'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				// 下拉刷新的配置(可选, 绝大部分情况无需配置)
				downOption: { },
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
				    noMoreSize: 1// 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				},
				active_city: '',
				city_list: [],
				loading: false,
				auto_city: '',
				userinfo:''
			};
		},
		onLoad() {
			this.active_city = this.utils.getUserCity()
		},
		methods: {
			clickFuncChooseCity(val){
				let data = val
				this.active_city = data
				//设置用户缓存数据。
				this.utils.setUser('region',data)
				// 加个监听器，选择城市后，回到首页才行获取议事和公示
				let pages = getCurrentPages()//页面栈
				let prePage = pages[pages.length-2]//上一页
				prePage.$vm.reFresh = Math.random()//触发上一页监听器
				uni.navigateBack()
			},
			// 定位
			getLocationFunc(){
				this.loading = true
				this.auto_city = ''
				uni.getLocation({
					type: 'wgs84',
					isHighAccuracy:true,
					success:  (res)=> {
						
						console.log('当前位置的经度：' + res.longitude);
						console.log('当前位置的纬度：' + res.latitude);
						this.loading = false
						this.auto_city = ''
					},
					fail: err=> {
						uni.showToast({
							icon:'none',
							title:'定位失败！',
						})
						this.loading = false
						this.auto_city = ''
					}
				});
			},
			/* 上拉加载的回调*/
			upCallback(page) {
				let data = {
					page: page.num,
					per_page: page.size
				}
				if(page.num==1){
					this.city_list =[]
				}
				getCity(data).then(res=>{
					// let items = res.data.items
					let items = res.data
					this.city_list =  this.city_list.concat(items)
					this.mescroll.endByPage(items.length, res.data.aggregation.total_cnt);
				}).catch(err=>{
					this.mescroll.endErr()
				})
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			}
		}
	}
</script>

<style lang="scss">
	.aniloop{
		animation: aniloop 2s ease infinite;
		    width: 24px;
		    height: 24px;
		    display: flex;
		    justify-content: center;
		    align-items: center;
	}
	@keyframes aniloop {
		from {transform: rotate(-45deg);}
		to {transform: rotate(315deg);}
	}
</style>
