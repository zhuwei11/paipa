const wechat = require('./utils/wechat.js')
/**
 * Baidu API 模块
 * @type {Object}
 */
const baidu = require('./utils/baidu.js')

// const douban = require('./utils/douban.js')

const comjs = require('./utils/common.js')


App({

  data: {
    name: 'paipa',
    version: '0.1.0',
    userId: null,
    currentCity: '未知'
  },

  wechat: wechat,

  // douban: douban,

  comjs: comjs,

  /**
   * Baidu API
   */
  baidu: baidu,

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    // wechat
    //   .getLocation()
    //   .then(res => {
    //     const { latitude, longitude } = res
    //     return baidu.getCityName(latitude, longitude)
    //   })
    //   .then(name => {
    //     this.data.currentCity = name.replace('市', '')
    //     console.log(`currentCity : ${this.data.currentCity}`)
    //   })
    //   .catch(err => {
    //     this.data.currentCity = '未知'
    //     console.error(err)
    //   })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
