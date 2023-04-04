<template>
	<view>
		<view class="na-header-white">
			<headbar></headbar>
			<view class="na-main p-t-30 flex-row flex-between">
				<view class="size-lx strong">{{details.title}}</view>
                <view class="flex-row">
                	<uni-icons type="auth" size="18"></uni-icons>
                    <ber-route :url="'/pages/page/readlog/readlog?id='+id" class="size-sm font-grey">阅读记录</ber-route>
                </view>
			</view>
			<view class="na-main wrap p-t-20">
				<view class="line-height-200 size-base">
					<text class="font-darkgrey nowrap">备案类型：</text>
					<text>{{type_id_to_name}}</text>
				</view>
				<view class="line-height-200 size-base">
					<text class="font-darkgrey nowrap">备案编号：</text>
					<text>{{details.sno}}</text>
				</view>
				<view class="line-height-200 size-base">
					<text class="font-darkgrey nowrap">有效时间：</text>
					<text>{{details.startat}}</text>
				</view>
				<view class="line-height-200 size-base">
					<text class="font-darkgrey nowrap">截止时间：</text>
					<text>{{details.endat}}</text>
				</view>
			</view>
		</view>
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback"
			@up="upCallback">
			<view class="na-main">
				<view class="na-title">
					<text class="text">备案主体</text>
				</view>
			</view>
			<view class="na-main">
				<view class="na-card p-30 bg-white">
					<view class="line-height-200">
						<view class="flex-row flex-between">
							<text class="font-darkgrey size-base nowrap">主体名称：</text>
							<text class="size-base">{{group_id_to_name}}</text>
						</view>
						<view class="flex-row flex-between">
							<text class="font-darkgrey size-base nowrap">统一信用代码：</text>
							<text class="size-base"></text>
						</view>
					</view>
				</view>
			</view>
			<view class="na-main">
				<view class="na-title">
					<text class="text">备案项目</text>
				</view>
			</view>
			<view class="na-main">
				<view class="na-card p-30 bg-white">
					<view class="line-height-200">
						<view class="flex-row flex-between">
							<text class="font-darkgrey size-base nowrap">项目名称：</text>
							<text class="size-base">{{zone_info.name}}</text>
						</view>
						<view class="flex-row flex-between">
							<text class="font-darkgrey size-base nowrap">坐落地址：</text>
							<view class="align-right">
								<view class="size-base">{{zone_info.addr}}</view>
							</view>
						</view>
						<view class="flex-row flex-between">
							<text class="font-darkgrey size-base nowrap">建筑单位：</text>
							<text class="size-base">{{zone_info.company_build}}</text>
						</view>
						<view class="flex-row flex-between">
							<text class="font-darkgrey size-base nowrap">总占地面积：</text>
							<text class="size-base">{{zone_info.area_floor}}</text>
						</view>
						<view class="flex-row flex-between">
							<text class="font-darkgrey size-base nowrap">总建筑面积：</text>
							<text class="size-base">{{zone_info.area_build}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="na-main">
				<view class="na-title">
					<text class="text">备案说明</text>
				</view>
			</view>
			<view class="na-main">
				<view class="na-card p-30 bg-white">
					<jyf-parser :html="details.desc" ref="article" :lazy-load="true" :use-anchor="true" show-with-animation :selectable="true">加载中...</jyf-parser>
				</view>
			</view>
			<view class="na-main">
				<view class="na-title">
					<text class="text">相关要件</text>
				</view>
			</view>
			<view class="na-main">
				<view class="na-card p-30 bg-white">
					<view>
						<view v-for="(item,indexouter) in details.affix" :key="indexouter">
							<view class="nowrap">{{item.name}}</view>
							<view class="flex-row p-tb-20" v-if="item.type === 'image'">
								<image v-for="(img,index) in details.affixs[indexouter]" :src="img" style="width: 80px;height: 80px;" class="m-r-10"
									@tap="clickFuncImgShow(details.affixs[indexouter],index)">
								</image>
							</view>
							<view class="videos" v-else-if="item.type === 'video'">
								<view @click="startvideo">
									<image src="../../../static/image/video.png" style="width: 80px;height: 80px;"></image>
								</view>
								<video v-for="(img,index) in details.affixs[indexouter]"
									v-show="show_video"
									@fullscreenchange="changeFull"
									id="myVideo"
									:src="img" controls
									show-play-btn="false"></video>
							</view>
							<view class="" v-else>
								其他文件
							</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	import {
		VITE_APP_FOLDER_SRC
	} from '@/pages/framework/config/app.js'
	import {
		getOpts,
		getOptVal
	} from '@/pages/framework/utils/opts/opts.js'
	import {
		getDetails,
		putAllot,
		postAllot,
		getGroupList,
		getFilingKind
	} from './service/api.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				VITE_APP_FOLDER_SRC: VITE_APP_FOLDER_SRC,
				// 下拉刷新的配置(可选, 绝大部分情况无需配置)
				downOption: {},
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
					noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				},
				details: '',
				id: '',
				opts_all: {
					'complaint_status': []
				},
				juban_content: '',
				zhuanban_id: '',
				active: 1,
				zone_info: {},
				all_group_list: [],
				all_type_list: [],
				group_id_to_name: "",
				type_id_to_name: "",
				show_video:false
			}
		},
		onLoad(opts) {
			this.id = opts.id
			getOpts(['complaint_status', 'toushu_return_type', 'illegal_status']).then(res => {
				this.opts_all = res
			})
			getGroupList().then(res => {
				this.all_group_list = res.data
			})
			getFilingKind('filing').then(res => {
				console.log(res)
				this.all_type_list = res.data
			})
		},
		onReady() {
			this.videoContext = uni.createVideoContext('myVideo')
		},
		methods: {
			// 预览图片
			clickFuncImgShow(arr, index) {
				uni.previewImage({
					current: arr[index],
					indicator: "number",
					urls: arr,
				});
			},
			/* 上拉加载的回调*/
			upCallback(page) {
				getDetails(this.id).then(res => {
					console.log("res",res.data.affix)
					res.data.affixs = []
					for (let i in res.data.affix) {
						res.data.affixs.push([])
						for(let j in res.data.affix[i].key) {
							res.data.affixs[i].push(VITE_APP_FOLDER_SRC + res.data.affix[i].key[j])
						}
					}
					this.details = res.data
					this.zone_info = res.data.zone_info
					this.all_group_list.forEach((item => {
						if (item['id'] == this.details.group_id) {
							this.group_id_to_name = item.name
						}
					}))
					this.all_type_list.forEach((item => {
						if (item.children) {
							item.children.forEach((item) => {
								if (item['id'] == this.details.type) {
									this.type_id_to_name = item.name
								}
							});
						}
						if (item['id'] == this.details.type) {
							this.type_id_to_name = item.name
						}
					}))
                    this.mescroll.endSuccess(1, 1);
				}).catch(err => {
					this.mescroll.endErr()
				})
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			},
			getFuncOptVal(arr, key) {
				return getOptVal(arr, key)
			},
			// 退出全屏时暂停视频
			changeFull() {
				this.videoContext.pause()
				this.show_video = !this.show_video
			},
			// 播放视频
			startvideo() {
				this.videoContext.requestFullScreen()
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
