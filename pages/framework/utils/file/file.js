import request from "@/pages/framework/utils/request/request.js";
import Mime from 'mime'
// 实名认证
export default async function GetFilesKey(folder,srcArr,srcType) {
	// let res = await request1.POST(`blob/form`,{folder:folder,number:srcArr.length});
	let res = await request.POST(`blob/form`,{folder:folder,number:srcArr.length});
	let promiseList = []
	for(let i in srcArr){
		let src = srcArr[i];
		promiseList.push(new Promise((reslove, reject) => {
			let inputs = res.data.inputs;
			let attrs = res.data.attrs;
			let keys = res.data.keys;
			let data = {
				'Policy': inputs.Policy,
				'X-Amz-Algorithm': inputs['X-Amz-Algorithm'],
				'X-Amz-Credential': inputs['X-Amz-Credential'],
				'X-Amz-Date': inputs['X-Amz-Date'],
				'X-Amz-Signature': inputs['X-Amz-Signature'],
				'acl': inputs.acl,
				// 'key': folder+'/'+keys[i]+'.'+srcType[i],
				'Content-Type': Mime.getType(src.substring(src.lastIndexOf(".")+1)),
				// 'file': src
			}
            if(srcType) {
                data.key = folder+'/'+keys[i]+'.'+srcType[i]
            }else {
                data.key = folder+'/'+keys[i]
            }
			uni.uploadFile({
				url: attrs.action,
				filePath: src,
				name: 'file',  //后台接收字段名
				// header:{
				// 	"content-type" : 'multipart/form-data'
				// },
				formData:data,
				success: (suc) => {
					if(suc.statusCode>=200&&suc.statusCode<=300){
                        if(srcType) {
                            reslove(folder + '/' + keys[i]+'.'+srcType[i])
                        }else {
                            reslove(folder + '/' + keys[i])
                        }
					}else{
						reject('上传失败！')
					}
				},
				fail:err=>{
					reject(err)
				}
			})
		}));
	}
	return Promise.all(promiseList)
}

