// 网络接口修改此字符 小程序域名要求https
let httpApi = 'http://219.151.149.203:10030' //线上测试
// let httpApi = 'https://smartapi.cqyezhuapp.com' //
let api_version = httpApi + '/api/'
// 聊天接口修改此字符 小程序聊天要求wss 例如：wss://mer.ccc.net
// let wsApi = ''

module.exports = {
	SHARE_BASE_URL : httpApi+'/appshare?',
	URL_LOGO : 'https://app.cqyezhuapp.com/appdown/logo.png',
	// 请求域名 格式： https://您的域名 
	HTTP_REQUEST_URL: api_version,
	// 图片服务器
	VITE_APP_FOLDER_SRC: 'https://s.cqyezhuapp.com/zgj/',
	HEADER: {
		'Accept': 'application/json',
		'Authorization': 'Bearer ',
	},
	VAPTCHA_API: httpApi+'/vaptcha/view.html',
	// VAPTCHA_API: httpApi1+'/vaptcha/view.html',
	VAPTCHA_VID: '617fa9796eb8a2c589f24550',
	APPID : '6348dce7fa6767989b027650',
	EQTYPE: '5', // 1pt总平台管理端    2ptr区域平台管理端   5mbr业主端   4pm物业端  3gov行政管理端
	EQTYPESTR: 'mbr',
	SECRET: 'secret',
	// SECRET: 'ba2db4cf139d946dd914e1d5031c75320bf663cc'
	// 热更新地址
	// HOT_UPDATA_LINK: '' 
};