<template>
    <view class="errs" :style="{backgroundColor:bg}">
        <view class="errs-dis">
            <view class="err-box">
                <view class="circular" :style="{backgroundColor:color}">
                    <view class="innercircular" :style="{backgroundColor:bg}">
                        <view class="word-box">
                            <view class="word-bg">
                                <view class="bbg" :style="{backgroundColor:color}" />
                                <view class="word" :style="{backgroundColor:bg}" />
                            </view>
                        </view>
                        <view class="text-box">
                            <view class="word-text" :style="{color:color}">
                                404
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
// <img-error class="img-item" :bg="loadBg" :color="loadColor" />
export default {
    name: 'ImgError',
    props: {
        bg: {
            type: String,
            default: '#000'
        },
        color: {
            type: String,
            default: '#eeeeee'
        }
    },
    data() {
        return {

        }
    }
}
</script>
<style lang="scss" scoped>
	$color: #000;
	$bg: #eee;
	
	.errs {
		height: 100%;
		width: 100%;
		background-color: $bg;
		position: relative;
	}
	.errs .errs-dis{
		width: 100%;
		position: absolute;
		left: 0;
		top: 50%;
		height: 1px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.err-box {
		max-width: 100px;
		width: 50%;
		min-width: 58px;
	}

	.err-box .circular {
		border-radius: 50%;
		background-color: $color;
		height: 0;
		width: 100%;
		padding-bottom: 100%;
		box-sizing: border-box;
		transform: rotate(-45deg);
		animation: rotateA 6s linear infinite;
	}

	.err-box .circular .innercircular {
		padding-bottom: 100%;
		width: 100%;
		background-color: $bg;
		border-radius: 50%;
		transform: scale(0.85);
		position: relative;
	}

	.err-box .circular .innercircular .word-box {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.err-box .circular .innercircular .word-box .word-bg {
		padding-bottom: 12%;
		width: 100%;
		display: flex;
		justify-content: center;
		position: relative;
	}
	.err-box .circular .innercircular .word-box .word-bg .bbg{
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: $color;
	}
	.err-box .circular .innercircular .word-box .word {
		background-color: $bg;
		width: 60%;
		text-align: center;
		position: absolute;
		left: 20%;
		top: -10%;
		height: 120%;
	}
	.err-box .circular .innercircular .text-box{
		height: 1px;
		width: 100%;
		position: absolute;
		left: 0;
		top: 50%;
	}
	.err-box .circular .innercircular .text-box .word-text{
		width: 100%;
		text-align: center;
		position: absolute;
		left: 0;
		top: -10px;
		height: 20px;
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0.14rem;
	}
	@keyframes rotateA {
		0% {
			transform: rotate(-45deg);
		}
	
		100% {
			transform: rotate(315deg);
		}
	}
</style>
