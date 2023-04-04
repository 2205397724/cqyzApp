<template>
	<view>
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<headbar  backgroundColor="transparent" rightText="企业认证" @clickRight="clickRight"></headbar>
			<view class="na-main">
				<view v-if="com_list.length<=0" class="na-card bg-white p-30 m-b-30 font-grey size-base">
					暂无企业
				</view>
				<view v-else class="na-card bg-white p-30 m-b-30" v-for="(item,i) in com_list" :key="item.id">
					<view class="na-title-sm">{{item.com_name}}</view>
					<view class="zdiscuss-cate">{{item.social_code}}</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import Cache from "@/pages/framework/utils/cache/cache.js"
	import {DEFAULT_COMPANY} from "@/pages/framework/config/cache.js"
	
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	import {
		getComCert,
	} from './service/api.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				// 下拉刷新的配置(可选, 绝大部分情况无需配置)
				downOption: { 
					native: true
				},
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
				    noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				},
				com_list: [],
				defaultCompany :''
			}
		},
		onShow() {
			this.defaultCompany = Cache.get('DEFAULT_COMPANY')
		},
		methods: {
			clickRight(){
				this.utils.route('/pages/mine/verify_mode_3/verify_mode_3')
			},
			/* 上拉加载的回调*/
			upCallback(page) {
				getComCert().then(res=>{
					this.com_list = res.data
					//静默设置第一套为默认房屋
					if(!this.defaultCompany){
						this.defaultCompany = res.data[0];
						Cache.set('DEFAULT_COMPANY',res.data[0])
					}
					this.mescroll.endSuccess(res.data.length)
				}).catch(err=>{
					this.mescroll.endErr()
				})
			},
			// 下拉刷新回调
			downCallback() {
			    this.mescroll.resetUpScroll()
			},
		}
	}
</script>

<style>

</style>
