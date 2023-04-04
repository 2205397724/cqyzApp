<template>
	<!-- 搜索框 -->
	<view>
        <view class="bg-white btn-size-xs  flex-row flex-center font-grey" @click="openSearch">
            <uni-icons type="search" size="16" color="#666666"></uni-icons>
            <text>搜索</text>
        </view>
        <uni-popup ref="popup" type="top">
        	<form @submit="formSubmit">
        		<view class="search_popup">
					<view class="title">关键字</view>
        			<view class="input">
        				<input name="keywords" type="text" :value="keywords" class="ui-input" :placeholder="keywords !='' ? keywords : '请输入关键词'" maxlength="20">
        			</view>
                    <view v-if="sokeywords.length>0">
                    	<view class="title flex-row flex-between">
                    		<text class="">搜索历史</text>
                    		<text class="" @tap="clear_key()">清除历史</text>
                    	</view>
                        <view class="flex-row" style="flex-wrap: wrap;">
                            <view class="p-10" v-for="(sokey,i) in sokeywords" :key="i">
                            	<text v-if="i<=10" :class="sokey == keywords ? 'na-tag2' : 'na-tag1'" @tap="key_click(sokey)">{{sokey}}</text>
                            </view>
                        </view>
                    </view>
        			<view class="flex-row m-t-30">
                        <button type="primary" class="flex-block" size="mini" form-type="submit">搜索</button>
                        <button type="default" class="flex-block m-l-20" size="mini" @click="cancel">清空搜索</button>
        			</view>
        		</view>
        	</form>
        </uni-popup>
	</view>
</template>

<script>
	export default {
		name: 'search',
		data() {
			return {
                keywords: '', //搜索关键词
                sokeywords : [],//作为搜索历史用
			};
		},
		props:{
			stokeys:{
				type:String,
				default:'HistoryKeys'
			},
		},
		methods: {
            // 打开搜索框
            openSearch() {
				// #ifdef APP
				uni.setNavigationBarColor({
				    frontColor: '#000000',
				    backgroundColor: '#007aff'
				})
				// #endif
                this.loadOldKeyword();
                this.$refs.popup.open()
            },
            //点击清空
            cancel() {
            	this.keywords = '';
            	this.$refs.popup.close();
            	this.$emit('search',this.keywords)
            },
            //搜索
            formSubmit(e) {
            	this.keywords = e.detail.value.keywords
				if(this.keywords){
					this.saveKeyword(this.keywords);
					this.$emit('search',this.keywords)
				}
            	this.$refs.popup.close();
            },
            //保存关键字到历史记录
            saveKeyword(keyword) {
            	uni.getStorage({
            		key: this.stokeys,
            		success: (res) => {
            			var OldKeys = JSON.parse(res.data);
            			var findIndex = OldKeys.indexOf(keyword);
            			if (findIndex == -1) {
            				OldKeys.unshift(keyword);
            			} else {
            				OldKeys.splice(findIndex, 1);
            				OldKeys.unshift(keyword);
            			}
            			//最多10个纪录
            			OldKeys.length > 10 && OldKeys.pop();
            			uni.setStorage({
            				key: this.stokeys,
            				data: JSON.stringify(OldKeys)
            			});
            			this.sokeywords = OldKeys; //更新历史搜索
            		},
            		fail: (e) => {
            			var OldKeys = [keyword];
            			uni.setStorage({
            				key: this.stokeys,
            				data: JSON.stringify(OldKeys)
            			});
            			this.sokeywords = OldKeys; //更新历史搜索
            		}
            	});
            },
            //加载历史搜索,自动读取本地Storage
            loadOldKeyword() {
            	uni.getStorage({
            		key: this.stokeys,
            		success: (res) => {
            			var OldKeys = JSON.parse(res.data);
            			this.sokeywords = OldKeys;
            		}
            	});
            },
            //清除搜索历史
            clear_key(){
            	uni.removeStorageSync(this.stokeys);
            	this.sokeywords=[];
            },
			//点击关键字
            key_click(key){
            	this.keywords = key;
                this.$refs.popup.close();
                this.$emit('search',this.keywords)
            },
		}
	}
</script>

<style lang="scss">
    /* 搜索框 */
    .search_popup{
        background-color: #FFFFFF;
		padding-top:20rpx;
        .title{
        	padding:20rpx 0;
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
