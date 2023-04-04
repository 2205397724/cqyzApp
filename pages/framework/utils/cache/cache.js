/** 
 *	import Cache from '@/utils/cache.js'
 * 	Cache.set(key,data,expire)  expire<=0 永久缓存forever
 *
 **/


class Cache {
	
	constructor(handler) {
	    this.cacheSetHandler = uni.setStorageSync;
		this.cacheGetHandler = uni.getStorageSync;
		this.cacheClearHandler = uni.removeStorageSync;
		this.cacheExpire = '_Expire';
	}
	
	/**
	 * 获取当前时间戳
	 */
	time()
	{
		return Math.round(new Date() / 1000);
	}
	
	/**
	 * 设置过期时间缓存秒
	 * @param {Object} key
	 * @param {Object} expire
	 */
	setExpireCahe(key,expire)
	{
		expire = expire > 0 ? expire + this.time() : 'forever';
		this.cacheSetHandler(key + this.cacheExpire, expire)
	}
	
	/**
	 * 缓存是否过期,过期自动删除
	 * @param {Object} key
	 * @param {Object} $bool true = 删除,false = 不删除
	 */
	getExpireCahe(key)
	{
		try{
			let time = this.cacheGetHandler(key + this.cacheExpire);
			// 如果是‘forever’代表永久
			if (time) {
				if (time < this.time() && !Number.isNaN(time)) {
					this.clear(key);
					return true;
				} else {
					return false;
				}
			} else {
				this.clear(key);
				return true;
			}
		}catch(e){
			this.clear(key);
			return true;
		}
	}
	
	/**
	 * 缓存是否在指定时间过期
	 * 
	 */
	toVerification(key, addTime)
	{
		try{
			let time = JSON.parse(this.cacheGetHandler(key + this.cacheExpire));
			if (time) {
				if (!Number.isNaN(time) && time > this.time()+addTime) {
					return false;
				} else {
					return true;
				}
			} else {
				return true;
			}
		}catch(e){
			return true;
		}
	}
	
	/**
	 * 设置缓存
	 * @param {Object} key
	 * @param {Object} data
	 */
	set(key,data,expire){
		this.clear(key);
		data = JSON.stringify(data);
		try{
			this.setExpireCahe(key,expire);
			this.cacheSetHandler(key,data);
			return true;
		}catch(e){
			return false;
		}
	}
	modify(key,data){
		this.cacheSetHandler(key,JSON.stringify(data));
	}
	/**
	 * 获取缓存
	 * @param {Object} key
	 * @param {Object} $default
	 * @param {Object} expire
	 */
	get(key){
		try{
			let isExpire = this.getExpireCahe(key);
			let data = this.cacheGetHandler(key);
			if (data && !isExpire) {
				return JSON.parse(data);
			} else {
				return ''
			}
		}catch(e){
			return '';
		}
	}
	
	/**
	 * 删除缓存
	 * @param {Object} key
	 */
	clear(key)
	{
		try{
			this.cacheClearHandler(key);
			this.cacheClearHandler(key + this.cacheExpire);
			return true
		}catch(e){
			return false;
		}
	}

}


export default new Cache;