<template>
	<view>
		<view class="na-header-white m-b-10">
			<headbar title="所有议事" rightIcon="search" @clickRight="clickRight"></headbar>
		</view>
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="na-main m-t-40">
				<view class="na-list m-t-20" v-for="item in vein_list" v-show="item.show == 1">
					<uni-row class="na-list-item na-card bg-white p-30 m-b-20">
						<uni-col :span="24">
							<view class="list-content" @click="toDetails(item.id)">
								<view class="h2 over-ellipsis strong">{{item.name}}</view>
								<!-- <view class="na-unread"></view> -->
								<view class="p-t-10 list-info">
									<text>时间：{{item.updated_at}}</text>
								</view>
							</view>
						</uni-col>
					</uni-row>
				</view>
			</view>
		</mescroll-body>
		<uni-popup ref="popup" type="top">
			<form @submit="formSubmit">
				<view class="search_popup">
					<view class="title">关键词</view>
					<view class="input">
						<input name="keywords" type="text" class="ui-input" :placeholder="keywords !='' ? keywords : '请输入关键词'" maxlength="20">
					</view>
					<view class="title flex-row flex-between">
						搜索历史
						<text class="uni-tip-button button-cancel" @click="clear">清空</text>
					</view>
					<view class="uni-tip-group-button">
						<!-- <text class="uni-tip-button button-cancel" @click="cancel">取消</text> -->
						<button type="primary" form-type="submit">搜索</button>
					</view>
				</view>
			</form>
		</uni-popup>
	</view>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	
	import {
		getVeinList
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
				vein_list:[],//事件(议事专题)列表
				keywords: '', //搜索关键词
			}
		},
		onLoad(opts) {
			this.getThemeList()
		},
		methods: {
			/* 上拉加载的回调*/
			upCallback(page) {
				let data = {
					page: page.num,
					per_page: page.size,
				}
				if(this.keywords){
					data.name = this.keywords
				}
				getVeinList(data).then(res=>{
					this.vein_list = res.data
					this.mescroll.endSuccess(res.data.length)
				}).catch(err=>{
					this.mescroll.endErr()
				})
			},
			// 下拉刷新回调
			downCallback() {
			    this.mescroll.resetUpScroll()
			},
			// 事件(议事专题)列表
			getThemeList(){
				
			},
			// 跳转详情页
			toDetails(id){
				this.utils.route('/pages/vein/detail/detail?id='+id)
			},
			// 导航右点击
			clickRight(){
				this.$refs.popup.open()
			},
			//搜索
			formSubmit(e) {
				this.keywords = e.detail.value.keywords
				this.mescroll.resetUpScroll(); //刷新数据。
				this.$refs.popup.close();
			},
			//点击取消
			cancel() {
				this.$refs.popup.close();
			},
			// 点击清空
			clear() {
				this.keywords = '';
				this.mescroll.resetUpScroll(); //刷新数据。
				this.$refs.popup.close();
			},
		}
	}
</script>

<style lang="scss" scoped>
	/* 搜索框 */
	.search_popup{
		background-color: #FFFFFF;
		.title{
			padding: 20upx 0;
			font-size:$uni-font-size-base;
			color: #999;
		}
		.ui-input{
			background-color: #F1F1F1;
			font-size:$uni-font-size-base;
			padding:26upx;
			border-radius:$uni-border-radius-base;
		}
	}
</style>
