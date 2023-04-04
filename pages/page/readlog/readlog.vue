<template>
	<view class="bg-white">
		<view>
			<headbar title="阅读记录"></headbar>
		</view>
		<view class="na-main">
			<uni-row>
				<uni-col :span="12">
					<text class="font-grey size-sm">阅读次数：</text><text class="size-lg"> </text><text class="font-grey size-sm">次</text>
				</uni-col>
				<uni-col :span="12">
					<text class="font-grey size-sm">阅读人数：</text><text class="size-lg"> </text><text class="font-grey size-sm">人</text>
				</uni-col>
			</uni-row>
		</view>
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="na-main na-box">
				<view class="na-title"><text class="text">阅读记录</text></view>				
				<view class="line-height-170">
					<view class="flex-row flex-between p-tb-10" v-for="(item,i) in readloglist" :key="i">
						<text class="font-darkgrey size-base">{{item.created_at}}</text>
						<view class="font-grey size-base">
							<text>阅读人：</text>
							<safe-str v-if="item.uinfo" style="width: auto;" size="38rpx" type="name" :str="item.uinfo.nickname || item.uinfo.name"></safe-str><text v-else class="font-grey size-base">匿名业主</text>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
import { getReadLog } from './service/api.js'
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
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
			id:'',
			readloglist:[]
        }
    },
    onLoad(options) {
		this.id = options.id
    },
    methods: {
        /* 上拉加载的回调*/
        upCallback(page) {
			let data ={
				page: page.num,
				per_page: page.size,
				tgt_id : this.id
			}
			getReadLog(data).then(res=>{
				this.readloglist = this.readloglist.concat(res.data)
				this.mescroll.endSuccess(res.data.length);
			}).catch(err=>{
				this.mescroll.endErr()
			})
        },
        // 下拉刷新回调
        downCallback() {
            this.mescroll.resetUpScroll()
        }
    }
}
</script>

<style lang="scss">

</style>
