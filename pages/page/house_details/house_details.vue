<template>
	<view>
		<view class="na-header-white">
			<headbar backgroundColor='#ffffff' color="" title="房屋详情" fixed="true"></headbar>
			<view class="na-main">
				<view class="size-lg strong">{{deftail_house.pos_name || ''}} {{deftail_house.name||''}}</view>
				<view class="p-t-20">
					<text class="na-tag1">{{getFuncOptVal(opts_all.house_status_use,deftail_house.status_use) }}</text>
					<text class="na-tag1">{{getFuncOptVal(opts_all.house_status_plan_fact,deftail_house.status_plan) }}</text>
				</view>
				<view class="flex-row flex-center flex-around p-t-20">
					<view class="flex-column flex-center">
						<view class="font-grey size-sm">房号</view>
						<view class="font-darkgrey size-lg">{{deftail_house.house_num}}</view>
					</view>
					<view class="flex-column flex-center">
						<view class="font-grey size-sm">建筑面积</view>
						<view class="font-darkgrey size-lg">{{deftail_house.area_build}}㎡</view>
					</view>
				</view>
			</view>
		</view>
		<view class="na-main">
			<view class="na-card bg-white p-30">
				<view class="size-base p-10">
					<text class="font-grey">物理楼层：</text>
					<text class="font-darkgrey">{{deftail_house.floor_truth}}</text>
				</view>
				<view class="size-base p-10">
					<text class="font-grey">名义层：</text>
					<text class="font-darkgrey">{{deftail_house.floor_alias}}</text>
				</view>
				<view class="size-base p-10">
					<text class="font-grey">地址：</text>
					<text class="font-darkgrey">{{deftail_house.addr}}</text>
				</view>
				<view class="size-base p-10">
					<text class="font-grey">户型：</text>
					<text class="font-darkgrey">{{ getFuncOptVal(opts_all.house_type_model,deftail_house.type_model) }}</text>
				</view>
				<view class="size-base p-10">
					<text class="font-grey">产权性质：</text>
					<text class="font-darkgrey">{{ getFuncOptVal(opts_all.house_type_property,deftail_house.type_property) }}</text>
				</view>
				<view class="size-base p-10">
					<text class="font-grey">楼栋性质：</text>
					<text class="font-darkgrey">{{ getFuncOptVal(opts_all.house_type_building,deftail_house.type_building) }}</text>
				</view>
				<view class="size-base p-10">
					<text class="font-grey">使用状态：</text>
					<text class="font-darkgrey">{{getFuncOptVal(opts_all.house_status_use,deftail_house.status_use) }}</text>
				</view>
				<view class="size-base p-10">
					<text class="font-grey">安全状态：</text>
					<text class="font-darkgrey">{{ getFuncOptVal(opts_all.house_status_safe,deftail_house.status_safe) }}</text>
				</view>
				<view class="size-base p-10">
					<text class="font-grey">规划用途：</text>
					<text class="font-darkgrey">{{getFuncOptVal(opts_all.house_status_plan_fact,deftail_house.status_plan) }}</text>
				</view>
				<view class="size-base p-10">
					<text class="font-grey">实际用途：</text>
					<text class="font-darkgrey">{{getFuncOptVal(opts_all.house_status_plan_fact,deftail_house.status_fact) }}</text>
				</view>
				<view class="size-base p-10">
					<text class="font-grey">上级类型：</text>
					<text class="font-darkgrey">{{ getFuncOptVal(opts_all.houseable_type,deftail_house.houseable_type) }}</text>
				</view>
				<!-- <view class="size-base">
					<text class="font-grey">创建时间：</text>
					<text class="font-darkgrey">{{deftail_house.created_at}}</text>
				</view>
				<view class="size-base">
					<text class="font-grey">修改时间：</text>
					<text class="font-darkgrey">{{deftail_house.updated_at}}</text>
				</view> -->
				<view class="size-base p-10 line-height-170" v-if="deftail_house.addition">
					<view class="font-grey">简介：</view>
					<view class="font-darkgrey">
						<mp-html :content="deftail_house.addition.desc"></mp-html>
					</view>
				</view>
			</view>
            <!-- 房屋产权信息 -->
            <view class="m-t-30">
            	<view class="na-card p-30 bg-white size-base">
            		<view class="na-title-sm p-tb-10">
            			<text class="title">产权信息</text>
            		</view>
            		<view class="p-tb-10" v-if="houseProperty.code_property">
            			<text class="font-darkgrey size-sm">产权证号：</text><text>{{houseProperty.code_property}}</text>
            		</view>
            		<view class="p-tb-10" v-if="houseProperty.code_property">
            			<text class="font-darkgrey size-sm">地房籍号：</text><text>{{houseProperty.code_room}}</text>
            		</view>
            		<view class="p-tb-10" v-if="houseProperty.code_property">
            			<text class="font-darkgrey size-sm">交易时间：</text><text>{{houseProperty.time_deal}}</text>
            		</view>
            		<view class="flex-row flex-center" v-if="!houseProperty.code_property">
            			<text class="font-grey">~无产权信息~</text>
            		</view>
            		<view class="na-title-sm p-b-20 p-t-30">
            			<text class="title">产权人信息</text>
            		</view>
            		<scroll-view>
            			<view>
                            <view v-if="!houseProperty.owners"
                            	style="padding: 20rpx 0;font-size: 24rpx;color: gray;text-align: center;width: 100%;">
                            	~无产权人信息
                            </view>
                            <uni-swipe-action>
                            	<uni-swipe-action-item v-for="(item,index) in houseProperty.owners" :key="item.id" class="m-t-20">
                            		<view class="bg-light-grey m-b-20 p-20 border-radius-base size-base">
                            			<view><text class="strong size-lg">{{item.name}}</text></view>
                            			<view>
											<text class="font-darkgrey size-sm">证件号码：</text>
											<safe-str style="width: auto;" size="38rpx" type="id" :str="item.id_card" :show="true"></safe-str>
                            			</view>
                            			<view>
											<text class="font-darkgrey size-sm">联系方式：</text>
											<safe-str style="width: auto;" size="38rpx" type="tel" :str="item.mobile" :show="true" :dial="true"></safe-str>
                            			</view>
                            		</view>
                            	</uni-swipe-action-item>
                            </uni-swipe-action>
            			</view>
            		</scroll-view>
            	</view>
            </view>
			<view class="popup-box na-card bg-white m-t-30 p-30">
				<view>
					<view class="flex-row flex-between p-b-30">
						<view>随住成员</view>
						<view>
							<button class="btn-size-xs btn-secondary" @click="addHouseUser">添加随住成员</button>
						</view>
					</view>
					<!-- <view>
						<view v-if="isyezhu" class="tool-item" @click="scanFunc" >
							<uni-icons type="scan" size="20" color="#00a292"></uni-icons>
						</view>
					</view> -->
				</view>
				<view class="m-b-20">
					<view v-if="user_list.length<=0" class="p-tb-40 font-grey size-base">无房屋成员信息！</view>
					<view v-else class="flex-row flex-center flex-between p-tb-10" v-for="(item,i) in user_list" :key="item.id" @click.stop="clickFuncOpenPop(item)">
						<text class="size-base" v-if="item.user">{{item.user.name}}</text>
						<text class="size-base font-grey" v-if="item.user">{{ getFuncOptVal(opts_all.gender,item.user.gender) }}</text>
						<view class="btn-size-xs btn-extra btn-circle" v-if="item.user">
							<safe-str style="width: auto;" size="38rpx" type="tel" :str="item.user.mobile" :show="true" :dial="true"></safe-str>
						</view>
					</view>
				</view>
			</view>
			<view class="p-20"></view>
		</view>
		<uni-popup ref="popup" type="bottom" >
            <view class="popup-box">
            	<view class="popup-box " >
                    <view class="size-base p-b-20">
                    	<view class="font-grey">证件号码：</view>
                    	<view class="font-dark size-lg" v-if="user_deftail">
                    		<safe-str type="id" :str="user_deftail.id_card" :show="true"></safe-str>
                    	</view>
                    </view>
                    <view class="size-base p-b-20">
                    	<view class="font-grey">联系电话：</view>
                    	<view class="font-dark size-lg" v-if="user_deftail.user" style="height: 44rpx;">
                    		<safe-str type="tel" :str="user_deftail.user.mobile" :show="true" :dial="true"></safe-str>
                    	</view>
                    </view>
            		<view class="size-base p-b-20">
            			<view class="font-grey">姓名：</view>
            			<view class="font-dark size-lg" v-if="user_deftail.user">{{user_deftail.user.name || '匿名'}}</view>
            		</view>
                    <view class="size-base p-b-20">
                    	<view class="font-grey">性别：</view>
                    	<view class="font-dark size-lg" v-if="user_deftail.user">{{getFuncOptVal(opts_all.gender,user_deftail.user.gender) }}</view>
                    </view>
                    <!-- 暂无信息要调用接口请求该数据 -->
            		<!-- <view class="size-base p-b-20">
            			<view class="font-grey">角色：</view>
            			<view class="font-dark size-lg" v-if="user_deftail.user">{{getFuncOptVal(opts_all.role_house,user_deftail.flag) }}</view>
            		</view> -->
            		<view class="flex-row">
            			<view class="btn-extra btn-size-base btn-block m-l-10" @click="deleteMember(user_deftail)">删除</view>
                        <!-- <view class="btn-primary btn-size-base btn-block m-l-10" @click="todetail(user_deftail)">查看更多</view> -->
            		</view>
            	</view>
            </view>
		</uni-popup>
		<uni-popup ref="popadd" type="bottom" >
			<view class="popup-box">
				<uni-forms ref="form" :modelValue="formData" label-position="top" label-align="top" label-width="50" >
					<view class="na-title-sm">
						添加成员
					</view>
                    <uni-forms-item label="身份证"  label-width="auto">
                    	<view class="bg-light-grey border-radius-base p-10">
                    		<uni-easyinput v-model="formData.id_card" @blur="getPeopleMessage" type="idcard" placeholder="请输入身份证号码" :inputBorder="false" :clearSize="18"/>
                    	</view>
                    </uni-forms-item>
					<uni-forms-item label="电话"  label-width="auto">
						<view class="bg-light-grey border-radius-base p-10">
							<uni-easyinput v-model="formData.mobile" type="number" placeholder="请输入电话号码" :inputBorder="false" :clearSize="18"/>
						</view>
					</uni-forms-item>
					<uni-forms-item label="姓名"  label-width="auto">
						<view class="bg-light-grey border-radius-base p-10">
							<uni-easyinput v-model="formData.name" type="text" placeholder="请输入姓名" :inputBorder="false" :clearSize="18"/>
						</view>
					</uni-forms-item>
                    <uni-forms-item label="角色性别"  label-width="auto">
                    	<view class="bg-light-grey border-radius-base p-10">
                            <uni-data-checkbox v-model="formData.gender" :localdata="gender"/>
                    	</view>
                    </uni-forms-item>
					<view class="p-t-30">
						<button type="primary" @click="addMember">保存</button>
					</view>
				</uni-forms>
				<!-- <form @submit="addMember" >
					<view class="size-base">
						<view class="popup-title font-grey pop-tit">姓名：</view>
						<view class="m-b-20">
							<input type="text" class="na-input" v-model="mobile" placeholder="请输入姓名" maxlength="30"/>
						</view>
					</view>
					<view class="size-base">
						<view class="popup-title font-grey pop-tit">联系电话：</view>
						<view class="m-b-20">
							<input type="number" class="na-input" v-model="mobile" placeholder="请输入电话号码" maxlength="11"/>
						</view>
					</view>
					<view class="size-base">
						<view class="popup-title font-grey pop-tit">身份证：</view>
						<view class="m-b-20">
							<input type="idcard" class="na-input bg-light-grey" v-model="mobile" placeholder="请输入身份证" maxlength="18"/>
						</view>
					</view>
					<view class="size-base">
						<view class="popup-title font-grey pop-tit">角色备注：</view>
						<view class="m-b-20">
							<input type="text" class="na-input" v-model="mobile" placeholder="请输入角色备注" maxlength="30"/>
						</view>
					</view>
					<view>
						<button form-type="submit" type="primary">确定</button>
					</view>
				</form> -->
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import Cache from "@/pages/framework/utils/cache/cache.js"
	import {USER_INFO} from "@/pages/framework/config/cache.js"
	import permision from "@/pages/framework/utils/permission/permission.js"
	import {
		getHouseDetails,
		getHouseUser,
		postHouseUser,
		deleteHouseUser,
		getScan,
        getHouseProperty,
        getPropertyDetail,
        getPeopleList,
        addPeople
	} from './service/api.js'
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
	export default {
		data() {
			return {
				house_id:'',
				deftail_house: '',
				opts_all:{},
				user_list: '',
				user_deftail: '',
				user_info:'',
				isyezhu:false,
				mobile:'',//电话
				formData: {
					name:'',
					mobile:'',
					id_card:'',
					flag:''
				},
                house_property: [],
                houseProperty: {
                    owners:[]
                }, //房屋产权
                housePropertyOnwerArr: [],
                currentPropertyId: 0,
                gender:[{
                    text:'男',
                    value:'M'
                },{
                    text:'女',
                    value:'F'
                }],
                exist:false,//判断添加的随住人员是否已存在对应的人员信息
			}
		},
		onReady() {
			// #ifdef APP-PLUS
                plus.navigator.setStatusBarStyle("dark");
            // #endif
		},
		onLoad(opts) {
			this.user_info = this.utils.getUser()
			// 接收hash传递过来的参数，使用decodeURIComponent()进行解码
			this.house_id = opts.id
			this.getFuncHouseDetails()
			getOpts(['role_house','gender','houseable_type','house_type_model','house_type_property','house_type_building','house_status_use','house_status_safe','house_status_plan_fact']).then(res => {
			    this.opts_all = res
			})
            this.getProperty()
		},
		methods: {
            //身份证输入框失去焦点时，获取对应的成员信息
            getPeopleMessage(e) {
                // console.log("e",e.detail.value);
                getPeopleList({id_card:e.detail.value}).then(res=>{
                    // console.log("res",res.data.length)
                    if(res.data.length === 0) {
                        // 没有对应人员信息,提示用户将创建对应的成员
                        uni.showToast({
                        	title:"无对应的成员信息",
                        	duration:2000
                        })
                        this.exist = false
                    }else {
                        // 有对应人员信息
                        uni.showToast({
                        	title:"有对应成员信息",
                        	duration:2000
                        })
                        this.exist = true
                        this.formData.mobile = res.data[0].mobile
                        this.formData.name = res.data[0].name
                        this.formData.gender = res.data[0].gender
                        // console.log("res",res.data[0].mobile,this.formData)
                        setTimeout(()=>{
                            // 不强制更新，对应数据不会渲染到对应输入框
                            this.$forceUpdate()
                        },2000)
                    }
                })
            },
			// 扫描二维码
			handleScanFunc(){
				uni.scanCode({
					success:  (url) => {
						console.log(url)
						getScan(this.house_id,{qr:url.result}).then(res=>{
							this.getFuncHouseDetails()
						})
					}
				});
			},
			scanFunc(){
				// #ifdef APP-PLUS
				let _this = this;
				if (uni.getSystemInfoSync().platform == 'ios') {
				    if(permision.judgeIosPermission("camera")){
				    	_this.handleScanFunc()
				    }else{
						permision.gotoAppPermissionSetting();
					}
				}else if(uni.getSystemInfoSync().platform == 'android'){
					permision.requestAndroidPermission("android.permission.CAMERA").then(res=>{
						if(res>0){
							_this.handleScanFunc()
						}else{
							permision.gotoAppPermissionSetting();
						}
					})
				}
				// #endif
				// #ifndef APP-PLUS
				uni.showToast({
					icon:'none',
					title:'请在手机端使用！',
					mask:true
				})
				// #endif
			},
			clickFuncOpenPop(item){
				this.user_deftail = item
				this.$refs.popup.open()
			},
			addHouseUser(){
                this.formData = {}
				this.$refs.popadd.open()
			},
			getFuncHouseDetails(){
				getHouseDetails(this.house_id).then(res=>{
					this.deftail_house = res.data
					// getHouseUser(this.active_house.id).then(res2=>{
					// 	this.user_list = res2.data
					// 	this.isyezhu = false
					// 	for(let i in this.user_list){
					// 		if(this.user_list[i].flag==this.opts_all.role_house[0].key&&this.user_info.user_id==this.user_list[i].uid){
					// 			this.isyezhu = true
					// 		}
					// 	}
					// })
					let data = {
						hid:this.house_id
					}
					getHouseUser(data).then(res2=>{
						this.user_list = res2.data
						this.isyezhu = false
						for(let i in this.user_list){
							if(this.user_list[i].flag==this.opts_all.role_house[0].key&&this.user_info.id==this.user_list[i].uid){
								this.isyezhu = true
							}
						}
					})
				})
			},
			// 添加房屋成员
			addMember() {
                let data = {
                    hid:this.house_id,
                    mobile:this.formData.mobile,
                    id_card:this.formData.id_card,
                    name:this.formData.name,
                    gender:this.formData.gender,
                }
                if(!this.exist) {
                    // 没有对应人员信息,需要先添加人员信息再添加房屋成员
                    addPeople(data).then(res=>{
                        if(res.statusCode === 200) {
                            postHouseUser(data).then(res=>{
                            	uni.showToast({
                            		title:"添加成功",
                            		duration:1500
                            	})
                            })
                        }
                    })
                }else {
                    // 有对应人员信息
                    postHouseUser(data).then(res=>{
                    	uni.showToast({
                    		title:"添加成功",
                    		duration:1500
                    	})
                    })
                }
				this.mobile = ''
				this.close()
				setTimeout(()=>{
					this.getFuncHouseDetails()
				},1000)
			},
			// 删除房屋成员
			deleteMember(detail) {
				let _this = this
				uni.showModal({
					title: '提示',
					content: `您确定删除【${detail.user.name}】吗？`,
					success: res => {
						if (res.confirm) {
							deleteHouseUser({ids:[detail.id]}).then(res=>{
								uni.showToast({
									title:"删除成功",
									duration:1000,
								})
								_this.close()
								setTimeout(()=>{
									_this.getFuncHouseDetails()
								},1500)
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			close() {
				this.$refs.popup.close()
				this.$refs.popadd.close()
			},
			getFuncOptVal(arr,key){
				return getOptVal(arr,key)
			},
            // 获取产权信息
            getProperty() {
                // getHouseProperty().then(res => {
                //     // console.log("res",res.data);
                //     this.house_property = res.data
                //     this.house_property.forEach(item => {
                //         if(item.house_id === this.house_id) {
                //             this.currentPropertyId = item.id
                //             getPropertyDetail(this.currentPropertyId).then(res => {
                //                 this.houseProperty = res.data
                //                 // console.log("res.data",res.data);
                //                 // this.housePropertyOnwerArr = this.houseProperty.property_owners
                //                 // console.log("this.houseProperty.owners",this.houseProperty.owners);
                //             })
                //         }
                //     })
                // })
                let data = {
                    house_id:this.house_id
                }
                getHouseProperty(data).then(res => {
                    // console.log("res",res.data);
                    this.house_property = res.data[0]
                    this.currentPropertyId = this.house_property.id
                    getPropertyDetail(this.currentPropertyId).then(res => {
                        this.houseProperty = res.data
                    })
                })
            },
		}
	}
</script>

<style lang="scss" scoped>
	.popup-box{
		.popup-item{
			display: flex;
			margin-bottom: 10rpx;
			.popup-title{
				min-width: 180rpx;
				// width: 80rpx;
				box-sizing: border-box;
				padding: 0 10rpx;
				text-align: right;
			}
			.pop-tit{
				
			}
			.popup-content{
				
			}
		}
	}
</style>
