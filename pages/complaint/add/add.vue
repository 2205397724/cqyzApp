<template>
	<view>
		<headbar :title="'发起诉求'"></headbar>
			<uni-forms ref="form" style="margin: 0 30rpx;padding-top: 30rpx;" label-position="top" label-align="left" label-width="auto" >
				<uni-forms-item label="诉求主题"  :errorMessage="err_obj&&err_obj['title']&&err_obj['title'][0]" >
					<!-- <view class="bg-white border-radius-base " style="padding: 4px 0;"> -->
						<uni-easyinput v-model="formData.title" :inputBorder="false" autoHeight class="na-input" type="text" placeholder="输入主题说明"/>
					<!-- </view> -->
				</uni-forms-item>
				<uni-forms-item label="诉求内容"  :errorMessage="err_obj&&err_obj['content']&&err_obj['content'][0]">
					<view class="bg-white border-radius-base " style="padding: 4px 15px;">
						<uni-easyinput v-model="formData.content" :inputBorder="false" autoHeight :maxlength="255" type="textarea" placeholder="请输入最多255字..."/>
						<!-- <ber-editor @inputFn="(val)=>{
							formData.content = val
						}" placeholder="请输入诉求内容..." id="editor"></ber-editor> -->
					</view>
				</uni-forms-item>
				<uni-forms-item label="附件内容"  :errorMessage="err_obj&&err_obj['affix']&&err_obj['affix'][0]">
					<uni-file-picker @select="(val)=>{
						formData.affix = formData.affix.concat(val.tempFiles) 
					}" @delete="deleteFileFunc" limit="9" :auto-upload="false" ></uni-file-picker>
				</uni-forms-item>
				<uni-forms-item label="是否公开"  :errorMessage="err_obj&&err_obj['pub']&&err_obj['pub'][0]">
					<radio-group name="is_gongkai" @change="(val)=>{
						formData.pub = val.detail.value
					}">
						<label class="ui-radio"><radio color="#00d5c0" value="1" checked/>公开</label>
						<label class="ui-radio m-l-30"><radio color="#00d5c0" value="0"/>不公开</label>
					</radio-group>
				</uni-forms-item>
				<uni-forms-item label="是否匿名"  :errorMessage="err_obj&&err_obj['ano']&&err_obj['ano'][0]">
					<radio-group name="is_niming" @change="(val)=>{
						formData.ano=val.detail.value;
					}">
						<label class="ui-radio"><radio color="#00d5c0" value="1" checked/>匿名</label>
						<label class="ui-radio m-l-30"><radio color="#00d5c0" value="0"/>实名</label>
					</radio-group>
				</uni-forms-item>
				<!-- <uni-forms-item label="是否违建"  :errorMessage="err_obj&&err_obj['illegal']&&err_obj['illegal'][0]">
					<radio-group name="is_niming" @change="(val)=>{
						formData.illegal=val.detail.value;
					}">
						<label class="ui-radio" v-for="(item,i) in opts_all.is_illegal"><radio color="#00d5c0" :value="item.key"/>{{item.val}}</label>
					</radio-group>
				</uni-forms-item> -->
				<button type="primary" @click="submit">确定提交</button>
			</uni-forms>
		<!-- <view class="na-main ">
			<view class="na-title-sm">诉求主题</view>
			<view class="bg-white border-radius-base">
				<uni-easyinput :inputBorder="false" autoHeight :maxlength="255" class="na-input" type="text" placeholder="输入主题说明"/>
			</view>
			<view class="na-title-sm p-t-30">诉求内容</view>
			<view class="bg-white border-radius-base p-20">
				<uni-easyinput :inputBorder="false" autoHeight :maxlength="255" type="textarea" placeholder="请输入最多255字..."/>
			</view>
			<view class="na-title-sm p-t-30">附件内容</view>
			<view class="p-tb-30">
				
			</view>
			<view class="na-title-sm p-t-30">是否公开</view>
			<view class="p-tb-30">
				<view class="ui-cell-main">
					<radio-group name="is_gongkai">
						<label class="ui-radio"><radio color="#00d5c0" value="0" checked/>公开</label>
						<label class="ui-radio m-l-30"><radio color="#00d5c0" value="1"/>不公开</label>
					</radio-group>
				</view>
			</view>
			<view class="na-title-sm p-t-30">是否匿名</view>
			<view class="p-tb-30">
				<view class="ui-cell-main">
					<radio-group name="is_niming">
						<label class="ui-radio"><radio color="#00d5c0" value="0" checked/>匿名</label>
						<label class="ui-radio m-l-30"><radio color="#00d5c0" value="1"/>实名</label>
					</radio-group>
				</view>
			</view>
			<button type="primary">确定提交</button>
		</view> -->
	</view>
</template>

<script>
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
	import GetFilesKey from '@/pages/framework/utils/file/file.js'
	import {COMPLAINT} from '@/pages/framework/config/folder.js'
	import {
		postAdd
	} from './service/api.js'
	import Cache from '@/pages/framework/utils/cache/cache.js'
	import { ZONE } from '@/pages/framework/config/cache.js'
	export default {
		data() {
			return {
				err_obj:{},
				formData:{
					ano: "0",
					kind: "0",
					pub: "0",
					affix:[]
				},
				zone:{},
				opts_all:{},
			};
		},
		onLoad() {
			this.zone = this.utils.getUserZone()
			console.log("zone",this.utils.getUserZone())
			getOpts(['is_illegal']).then(res => {
			    this.opts_all = res
			})
		},
		methods: {
			deleteFileFunc(val){
				for(let i in this.formData.affix){
					if(this.formData.affix[i].url == val.tempFile.url){
						this.formData.affix.splice(i,1)
						return false
					}
				}
			},
			backFunc(){
				this.formData.kind = this.opts_all.is_illegal?.[1]?.key || 2
				postAdd(this.formData).then(res=>{
					uni.showToast({
						icon:'none',
						// title:res.msg
						title:"投诉成功"
					})
					setTimeout(()=>{
						let pages = getCurrentPages();  //获取所有页面栈实例列表
						let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
						if(prevPage.$vm.downCallback){
							prevPage.$vm.downCallback();
						}
						uni.navigateBack()
					},1000)
				}).catch(err=>{
					this.err_obj = err.data
				})
			},
			submit(){
				this.err_obj = {}
				this.formData.zid = this.zone.id
				console.log(this.formData)
				if(this.formData.affix.length>0){
					let arr = []
					for(let j in this.formData.affix){
						arr.push(this.formData.affix[j].url)
					}
					GetFilesKey(COMPLAINT,arr).then(res=>{
						this.formData.affix = res
						this.backFunc()
					})
				}else{
					this.backFunc()
				}
			},
			getFuncOptVal(arr,key){
				return getOptVal(arr,key)
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .file-picker__box-content{
		background-color:$uni-bg-color-white;
		border-radius: $uni-border-radius-base !important;
	}
</style>
