<template>
	<view>
		<headbar :title="'发起议事'"></headbar>
		<view>
			<uni-forms ref="form" :modelValue="formData" style="margin: 0 30rpx;padding-top: 30rpx;" label-position="top" label-align="left" label-width="50" >
				<uni-forms-item label="选择流程"  label-width="auto"   :errorMessage="err_obj&&err_obj['flow']?err_obj['flow'][0]:''">
					<view class="bg-white border-radius-base p-30">
						<picker @change="val=>{formData.flow = range[val.detail.value] }" mode='selector' 	:range="range" range-key="name">
							<view>{{ formData.flow.name || '请选择'}}</view>
						</picker>
					</view>
				</uni-forms-item>
				<uni-forms-item label="议题"  label-width="auto"  :errorMessage="err_obj&&err_obj['title']?err_obj['title'][0]:''" >
					<view class="bg-white border-radius-base " style="padding: 4px 0;">
						<uni-easyinput class="na-input" v-model="formData.title" placeholder="请输入议题" :inputBorder="false" />
					</view>
				</uni-forms-item>
				<uni-forms-item label="内容简介"  label-width="auto"  :errorMessage="err_obj&&err_obj['desc']?err_obj['desc'][0]:''" >
					<view class="bg-white border-radius-base p-30">
						<!-- <uni-easyinput :inputBorder="false" v-model="formData.desc" autoHeight :maxlength="255" type="textarea" placeholder="请输入简介信息最多255字..." :errorMessage="!!err_obj['desc']"/> -->
						<ber-editor @inputFn="(val)=>{
							formData.desc = val
						}" placeholder="请输入简介信息..." id="editor"></ber-editor>
					</view>
				</uni-forms-item>
				<button type="primary" @click="submit">保 存</button>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	// // 配置项
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
import Cache from '@/pages/framework/utils/cache/cache.js'
import { USER_INFO,ZONE } from '@/pages/framework/config/cache.js'
import GetFilesKey from '@/pages/framework/utils/file/file.js'
import {AVATAR} from '@/pages/framework/config/folder.js'
import {EQTYPE} from '@/pages/framework/config/app.js'
import {
	getFlowList,
	getZone,
	postFlow
} from './service/api.js'

export default {
	data() {
		return {
			opts_all:{
				article_lv:{}
			},
			formData: {},
			err_obj:{},
			user_info: '',
			range:[ ],
			zone:{}
		}
	},
	onLoad() {
		getOpts(['article_lv']).then(res => {
		    this.opts_all = res
		})
		this.zone = this.utils.getUserZone()
		//this.user_info = this.utils.getUser()
		this.formData={
			title:'',
			flow:'',
			desc:'',
		}
		this.getFuncFlowList()
	},
	methods: {
		getFuncFlowList(){
			getFlowList({
				page: 1,
				per_page: 500,
				eqtype: EQTYPE
			}).then(res=>{
				// this.range = res.data.items
				this.range = res.data
			})
		},
		submit() {
			if(!this.formData.flow){
				uni.showToast({
					icon:'none',
					title:'请选择流程'
				})
				return false
			}
			uni.showModal({
				title: '提示',
				content: '确定提交么？',
				success:  res => {
					if (res.confirm) {
						this.err_obj = {}
						let data = {
							baselv:this.opts_all.article_lv[3].key,
							baseval:this.zone.id,
							title: this.formData.title,
							desc: this.formData.desc
						}
						postFlow(this.formData.flow.id,data).then(res=>{
							uni.showToast({
								icon: 'none',
								title: res.msg,
								duration: 1000,
								mask:true
							})
							setTimeout(() => {
								let pages = getCurrentPages();  
								let prevPage = pages[ pages.length - 2 ];  
								prevPage.$vm.downCallback();   
								uni.navigateBack()
							}, 1000)
						}).catch(err=>{
							this.err_obj = err.data
						})
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		getFuncOptVal(arr,key){
			return getOptVal(arr,key)
		}
	}
}
</script>

<style lang="scss" >

</style>
