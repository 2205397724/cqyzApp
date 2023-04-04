<!--咨询列表页-->
<template>
	<view>
		<view class="na-header announce-head">
			<headbar fixed="true" backgroundColor="#00d5c0" title="行业资讯" color="#fff"></headbar>
			<!-- <uni-row class="na-main p-tb-30 flex-row flex-center">
				<uni-col :span="6" class="flex-row flex-between">
					<ber-route :url="'/pages/news/type/type'" class="font-white size-base opacity-70">类别</ber-route>
				</uni-col>
			</uni-row> -->
            <view class="p-t-30 p-lr-20 bg-light-green" v-if="news_cata_list.length>0">
            	<v-tabs v-model="search_active_cate" :tabs="news_cata_list" @change="tabFuncAnnounce"
            		field="name"></v-tabs>
            </view>
		</view>
        <view class="na-main flex-row flex-between p-tb-20" >
            <view class="flex-row" style="overflow: auto;width: 80%;">
                <block v-for="(item,index) in news_cata2_list">
                    <view :class="item.isChoose ? 'na-tag2 p-tb-10 p-lr-20 size-base':'na-tag4 p-tb-10 p-lr-20 size-base'" @click="clickCate2Tag(index)">{{item.name}}</view>
                </block>
            </view>
            <view class="">
                <my-search :stokeys="'search_newscate'" @search="searchSubmit"></my-search>
            </view>
        </view>
		<!-- <view class="na-main p-b-30">
			<v-tabs v-model="search_active_state" :tabs="opts_all.news_status" @change="tabFuncAnnounce"
				field="val"></v-tabs>
		</view> -->
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback"
			@up="upCallback">
			<view class="na-main">
				<uni-swipe-action>
					<uni-swipe-action-item v-for="(item,i) in news_list" :key="i" class="m-b-20">
						<view class="na-card bg-white p-30" @click="details(item.id)">
							<view v-if="item.affixs.length>=3">
								<view class="size-lg">{{item.title}}</view>
								<view class="na-photo-box p-t-20">
									<view v-if="i<3" v-for="(img,i) in item.affixs" style="width: 33%;">
										<image :src="img" mode="aspectFill" style="margin: 0 5rpx;max-height: 130rpx;max-width:190rpx;"></image>
									</view>
								</view>
							</view>
							<view v-else class="flex-row flex-between">
								<view class="size-lg">{{item.title}}</view>
								<view class="na-photo-box">
									<view v-for="(img,i) in item.affixs">
										<image v-if="i==0" :src="img" mode="aspectFill" style="margin: 0 5rpx;max-height: 130rpx;max-width:190rpx;"></image>
									</view>
								</view>
							</view>
							<view class="font-grey size-sm p-t-10">
								<text class="p-r-20" v-if="item.cate">分类：{{item.cate.name}}</text>
								<text>更新时间：{{item.updated_at}}</text>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	// // 配置项
	import {
		getOpts,
		getOptVal
	} from '@/pages/framework/utils/opts/opts.js'
    import {VITE_APP_FOLDER_SRC} from '@/pages/framework/config/app.js'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	import {
		getNewsList,
		delNewsList,
        getNewsCateList
	} from './service/api.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
                VITE_APP_FOLDER_SRC:VITE_APP_FOLDER_SRC,
				// 下拉刷新的配置(可选, 绝大部分情况无需配置)
				downOption: {},
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
					noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				},
				announce_list: [],
				opts_all: {
					'news_status': []
				},
				search_active_state: 0,
                search_active_cate: 0,
				search_code: '',
				groups: [],
				active_cc: '',
				news_list: [],
				status_not: 0,
				status_yes: 0,
				total: 0,
                news_cata_list:[],//咨询类别列表
                news_cata2_list:[],//咨询二级类别列表
                cate_id:'',//类别id
                keywords: '', //搜索关键词
			}
		},
		onLoad() {
			this.active_cc = this.utils.getUserCity()
			// this.search_code = this.active_cc.china_code
			// getOpts(['news_status']).then(res => {
			// 	this.opts_all = res
			//  this.opts_all.news_status.map(item=>{
            //           this.search_active_state === item.key ? item.checked = true : item.checked = false
            //           // item.checked = false
            //      })
			// })
            getNewsCateList({'china_code':this.active_cc.china_code}).then(res=>{
				this.news_cata_list =[{
					"id":0,
					"name": "全部",
				}]
                this.news_cata_list = this.news_cata_list.concat(res.data)
                if(res.data[0].children) {
                    // 初始化第一组的二级标签
                    this.news_cata2_list = res.data[0].children
                    this.news_cata2_list.map(item=>{
                        item.isChoose = false
                    })
                }
            })
		},
		methods: {  
            changStatus(index) {
                this.search_active_state = index
                this.opts_all.news_status.map(item=>{
                    this.search_active_state === item.key ? item.checked = true : item.checked = false
                })
                this.downCallback()
            },
            // 搜索
            searchSubmit(e) {
                this.keywords = e
                this.downCallback()//刷新数据。
            },
            // 点击二级标签
            clickCate2Tag(index) {
                this.news_cata2_list.map(item=>{
                    item.isChoose = false
                })
                this.news_cata2_list[index].isChoose = true
                this.cate_id = this.news_cata2_list[index].id
                this.downCallback()
                this.$forceUpdate()
            },
			// 点击一级标签
			tabFuncAnnounce(index) {
                this.cate_id = this.news_cata_list[index].id
                this.news_cata2_list = []
                if(this.news_cata_list[index].children) {
                    this.news_cata2_list = this.news_cata_list[index].children
					//默认选择2级第一项
                    this.news_cata2_list[0].isChoose = true
					this.cate_id = this.news_cata2_list[0].id
                }
				this.search_active_cate = index
				this.downCallback()
			},
			/* 上拉加载的回调*/
			upCallback(page) {
				let data = {
					page: page.num,
					per_page: page.size,
					status:1// this.search_active_state
				}
				// if (this.search_code) {
				// 	data.china_code = this.search_code
				// }
                if(this.cate_id) {
                    data.cate_id = this.cate_id
                }
                if(this.keywords){
                	data.title = this.keywords
                }
				if (page.num == 1) {
					this.news_list = []
				}
				getNewsList(data).then(res => {
                    for(let i in res.data){
                        res.data[i].affixs = []
                        for(let j in res.data[i].affix){
                            if(j > 2) break
                            res.data[i].affixs.push(VITE_APP_FOLDER_SRC+res.data[i].affix[j].file)
                            res.data[i].affix[j] = VITE_APP_FOLDER_SRC+res.data[i].affix[j].file
                        }
						let content = res.data[i].content
						content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function (match, capture) {
							res.data[i].affixs.push(capture);//正则去掉g为第一个
						});
                    }
                    this.news_list = this.news_list.concat(res.data)
                    this.mescroll.endSuccess(this.news_list.length)
				}).catch(err => {
					this.mescroll.endErr()
				})
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			},
			totasklist(id) {
				this.utils.route('/pages/announce/tasklist/tasklist?opt=' + id)
			},
			details(id) {
				this.utils.route('/pages/news/detail/detail?id=' + id)
			},
			getFuncOptVal(arr, key) {
				return getOptVal(arr, key)
			},
			clickRight(){
				this.utils.route('/pages/news/add/add?dowhat=添加')
			}
		}
	}
</script>
<style lang="scss" scoped>
	.announce-head {
		margin-bottom: 10rpx;
        // border-radius: 0;
        padding-bottom: 0;
	}

	.announce-task {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.announce-menu {
		box-sizing: border-box;
		padding-top: 30rpx;
		padding-bottom: 20rpx;
	}

	.announce-search {
		box-sizing: border-box;
		padding-top: 30rpx;
		padding-bottom: 20rpx;
	}
</style>
