<template>
	<view>
		<view class="">
			<view @click="clickGroup" class="p-10">
				{{group.name ||'请选择'}}
			</view>
			<uni-popup ref="popup" type="bottom">
				<view>
					<v-tabs :tabs="group_type" @change="groupTabsChangeType" v-model="currentIndex"></v-tabs>
				</view>
				<view>
					<uni-search-bar @confirm="search" v-model="searchValue" @blur="blur" @clear="clear"></uni-search-bar>
				</view>
				<view style="width: 100%;height: 400px;">
					<view class="flex-row" style="flex-wrap: wrap;">
						<view v-for="item in group_list" :key="item.id" class="m-t-20 boder-radius">
							<text v-if="item.type==currentType">
								<view v-if="group.id == item.id">
									<uni-tag :text="item.name" :value="item.type" :circle="true" class="m-r-10" @click="chooseGroupType(item,currentType)" type="success"></uni-tag>
								</view>
								<view v-else>
									<uni-tag :text="item.name" :value="item.type" :inverted="true" :circle="true" class="m-r-10" @click="chooseGroupType(item,currentType)"></uni-tag>
								</view>
							</text>
						</view>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {
        getGroupList,
		getUpstream,
		getGroupDetail
	} from './service/api.js'
	export default {
		name: 'ber-group',
		data() {
			return {
                err_obj:{},
				group:{},//选中用户组
                group_type: ['住建', '街道', '社区', '业委会', '物业'],
                currentIndex: 0, //当前用户组类型索引
                currentType: 0, //当前选择用户组类型
                group_list: [], //用户组列表
				searchValue :'',
				keyword :''
			}
		},
		props:{
			groupid:{
				type:String,
				default:''
			},
			all: {
				type: Boolean,
				default: false
			},
		},
		watch: {
            groupid:{
				handler(newVal){
					if(newVal){
						getGroupDetail(newVal).then(res=>{
							this.group = res.data
							this.currentType = this.group.type
							this.typeTocurrent(this.currentType)
						})
					}
				}
			}
		},
		created() {
			this.usergroup = this.utils.getUserGroups()
			this.currentIndex = 0
			this.currentType = 3
		},
		methods: {
			//搜索
			blur(e) {
				if(e.value){
					this.keyword = e.value
					this.clickGroup()
				}				
			},
			clear(){
				this.keyword = ''
				this.clickGroup()
			},
            //点击选择用户组弹出框
            clickGroup() {
                // 数据默认拉取15条，难以满足条件
				let data={
                    page:1,
                    per_page:500
                }
				if(this.keyword){
					data.name = this.keyword
				}
				if(this.all){//拉取全部
					getGroupList(data).then(res => {
						this.group_list = res.data
					})
				}else{//拉取自己所在的用户组的相关组织。
                    if(this.usergroup.id) {
                        data.gid_or_zid = this.usergroup.id
                    }else {
                        data.gid_or_zid = this.utils.getUserZone().id
                    }
					getUpstream(data).then(res=>{
						this.group_list = res.data
					})
				}
            	this.$refs.popup.open()
            },
            //选择用户组类型
            chooseGroupType(item,i) {
				this.group = item
				this.currentType = i
                this.$emit('checked',item)
            	this.$refs.popup.close()
            },
			//根据type转化为index
			typeTocurrent(val){
				switch(val){
					case 3:
						this.currentIndex=0
						break
					case 4:
						this.currentIndex=1
						break
					case 5:
						this.currentIndex=2
						break
					case 6:
						this.currentIndex=3
						break
					case 7:
						this.currentIndex=4
						break
				}
			},
            //选择用户组类型Tabs
            groupTabsChangeType(val) {
            	this.currentIndex = val
            	switch (val) {
            		case 0:
            			this.currentType = 3
            			break
            		case 1:
            			this.currentType = 4
            			break
            		case 2:
            			this.currentType = 5
            			break
            		case 3:
            			this.currentType = 6
            			break
            		case 4:
            			this.currentType = 7
            			break
            	}
            },
		}
	}
</script>
<style lang="scss" scoped>
	.uni-searchbar{
		padding:20rpx 0;
	}
</style>
