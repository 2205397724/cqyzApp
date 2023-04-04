<template>
	<view>
		<view class="na-header-white">
			<headbar></headbar>
			<view class="na-main p-t-30 flex-row flex-center flex-between">
				<view class="size-base strong">2、提交绑定申请</view>
				<view>
					<ber-route url="/pages/binding/history/history">
						<view class="font-primary size-base">申请记录</view>
					</ber-route>
				</view>
			</view>
		</view>
		<view v-if="house_list" class="na-main over-hidden">
			<view class="font-grey size-base p-b-30">已经选择房屋</view>
			<view class="over-hidden na-card p-30 bg-linear-orange2white">
				<view class="font-extra size-lg">{{house_list.pos_name||''}}{{house_list.name}}</view>
				<view class="font-grey size-base p-t-20">地址：{{house_list.addr}}</view>
			</view>
		</view>
		<view class="na-main">
			<view class="font-grey size-base p-tb-30">身份佐证材料</view>
			<view class="bg-white na-card">
				<uni-forms class="p-20 p-lr-30" ref="form" :rules="rules" :modelValue="formData" label-position="left" label-align="left" label-width="80">
					<uni-forms-item label="身份角色">
						<view class="border-b-grey p-20">
							<!-- <picker @change="val=>{formData.type = opts_all.role_house[val.detail.value].key }" :range="opts_all.role_house" range-key="val">
								<view>{{ getFuncOptVal(opts_all.role_house,formData.type)  || '请选择' }}</view>
							</picker> -->
							<uni-data-checkbox v-model="formData.type" selectedColor="#00d5c0" :localdata="types"/>
						</view>
					</uni-forms-item>
					<!-- <uni-forms-item label="姓名" name="realname" >
						<uni-easyinput class="na-input" v-model="formData.realname" placeholder="请输入姓名" :inputBorder="false" maxlength="11"/>
					</uni-forms-item>
					<uni-forms-item label="身份证号" name="idcard" >
						<uni-easyinput class="na-input" v-model="formData.idcard" placeholder="请输入证件号码" :inputBorder="false" maxlength="18"/>
					</uni-forms-item> -->
					<uni-forms-item label="佐证材料"  :errorMessage="err_obj&&err_obj['affix']&&err_obj['affix']">
						<view class="p-20">
							<uni-file-picker @select="(val)=>{
							formData.affix = formData.affix.concat(val.tempFiles) 
						}" @delete="deleteFileFunc" limit="9" :auto-upload="false" ></uni-file-picker>
						</view>
					</uni-forms-item>
				</uni-forms>
			</view>
			<view class="p-tb-30">
				<button type="primary" @click="submit">提交绑定申请</button>
			</view>
		</view>
	</view>
</template>

<script>
	
	import Cache from '@/pages/framework/utils/cache/cache.js'
	import GetFilesKey from '@/pages/framework/utils/file/file.js'
	import {HOUSE_APPLY} from '@/pages/framework/config/folder.js'
	import {
		USER_INFO
	} from '@/pages/framework/config/cache.js'
	import {
		postHouseApply,
		putHouseApply
		} from './service/api.js'
	// 配置项
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
	export default {
		data() {
			return {
				house_list: '',
				formData: {
					type:'',
					realname: '',
					idcard: '',
					affix:[]
				},
				err_obj:{},
				opts_all:{},
				user_info: '',
				rules: {
					realname: {
						validateTrigger: 'bind',
						rules: [{
								required: true,
								errorMessage: '请输姓名',
							},
							{
								errorMessage: '请输入正确的姓名！',
							}
						]
					},
					idcard: {
						validateTrigger: 'bind',
						rules: [{
							required: true,
							errorMessage: '请输入证件号码',
						}]
					}
				},
				// 单选数据源
				types: [{
					text: '业主',
					value: 1
				}, {
					text: '非业主',
					value: 0
				}],
			}
		},
		onShow() {
			this.user_info = this.utils.getUser()
			setTimeout(()=>{
				if(this.user_info.status_cert!=this.opts_all.status_cert[2].key){
					uni.showToast({
						icon:'none',
						title:'请完成实名认证！即将跳转！',
						mask:true
					})
					setTimeout(()=>{
						this.utils.route('/pages/mine/verify/verify')
					},1000)
				}
			},100)
		},
		onLoad(opts) {
			let opt = JSON.parse(decodeURIComponent(opts.opt))
			if(opt.modify){
				this.title = '修改房屋申请'
				this.formData = opt.modify
			}else{
				this.house_list = opt.zone
				this.formData = {
					hid:opt.zone.id,
					type:'',
					realname: '',
					idcard: '',
					affix:[]
				}
			}
			getOpts(['role_house','status_cert']).then(res => {
			    this.opts_all = res
			})
		},
		methods: {
			submit() {
				// 上传文件的处理
				if(this.formData.affix.length>0){
					let arr = []
					for(let j in this.formData.affix){
						arr.push(this.formData.affix[j].url)
					}
					GetFilesKey(HOUSE_APPLY,arr).then(res=>{
						this.formData.affix = res
					})
				}
				// 将不同身份转化为（家人司机保姆租客），业主和非业主
				if(this.formData.type != 1){
					this.formData.type = 0
				}
				uni.showModal({
					title: '提示',
					content: `确定要提交么？`,
					success:  res => {
						if (res.confirm) {
							this.err_obj = {}
							if(this.house_list){
								postHouseApply(this.formData).then(res=>{
									uni.showToast({
										icon:'none',
										title:'申请成功',
										mask: true
									})
									setTimeout(()=>{
										uni.navigateBack()
									},1000)
								}).catch(err=>{
									this.err_obj = err.data
								})
							}
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			// 删除附件
			deleteFileFunc(val){
				for(let i in this.formData.affix){
					if(this.formData.affix[i].url == val.tempFile.url){
						this.formData.affix.splice(i,1)
						return false
					}
				}
			},
			getFuncOptVal(arr,key){
				return getOptVal(arr,key)
			},
		}
	}
</script>

<style>
	.uni-forms-item--border {
		padding:5rpx;
	}
</style>
